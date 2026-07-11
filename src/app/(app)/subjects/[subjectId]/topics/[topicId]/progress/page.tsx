import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getReviewHistory, getTopicMeta, getTopicProgress } from "@/lib/queries";
import { ProgressChart } from "./progress-chart";
import { ResetCardButton, ResetKnownButton } from "./reset-controls";

const STATUS_LABEL: Record<string, string> = {
  NEW: "Nueva",
  LEARNING: "Repasando",
  KNOWN: "Sabida",
};

const STATUS_STYLE: Record<string, string> = {
  NEW: "bg-slate-100 text-slate-600",
  LEARNING: "bg-amber-100 text-amber-700",
  KNOWN: "bg-emerald-100 text-emerald-700",
};

export default async function TopicProgressPage({
  params,
}: {
  params: Promise<{ subjectId: string; topicId: string }>;
}) {
  const { subjectId, topicId } = await params;
  const user = await requireUser();
  const topic = await getTopicMeta(topicId);
  if (!topic || topic.subjectId !== subjectId) notFound();

  const [progress, history] = await Promise.all([
    getTopicProgress(topicId, user.id),
    getReviewHistory(topicId, user.id),
  ]);

  return (
    <div>
      <Link
        href={`/subjects/${subjectId}`}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← {topic.subject.name}
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-800">
        Progreso: {topic.name}
      </h1>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{progress.known}</p>
          <p className="text-xs text-slate-500">Sabidas</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-amber-600">{progress.learning}</p>
          <p className="text-xs text-slate-500">Repasando</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-slate-500">{progress.fresh}</p>
          <p className="text-xs text-slate-500">Nuevas</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-slate-600">
          Evolución (últimos 14 días)
        </h2>
        <ProgressChart data={history} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-600">Fichas</h2>
        <ResetKnownButton
          topicId={topicId}
          subjectId={subjectId}
          disabled={progress.known === 0}
        />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {progress.cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {card.front}
              </p>
              <p className="truncate text-xs text-slate-400">{card.back}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[card.status]}`}
            >
              {STATUS_LABEL[card.status]}
            </span>
            {card.status !== "NEW" && (
              <ResetCardButton
                cardId={card.id}
                topicId={topicId}
                subjectId={subjectId}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
