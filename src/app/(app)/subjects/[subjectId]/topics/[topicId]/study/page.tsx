import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getStudyQueue, getTopicMeta } from "@/lib/queries";
import { StudyClient } from "./study-client";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ subjectId: string; topicId: string }>;
}) {
  const { subjectId, topicId } = await params;
  const user = await requireUser();
  const topic = await getTopicMeta(topicId);
  if (!topic || topic.subjectId !== subjectId) notFound();

  const cards = await getStudyQueue(topicId, user.id);

  return (
    <div>
      <Link
        href={`/subjects/${subjectId}`}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← {topic.subject.name}
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-800">
        Estudiar: {topic.name}
      </h1>

      {cards.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-lg text-slate-700">
            🎉 ¡Ya te sabes todas las fichas de este tema!
          </p>
          <Link
            href={`/subjects/${subjectId}/topics/${topicId}/progress`}
            className="text-indigo-600 underline"
          >
            Ver progreso o resetear fichas
          </Link>
        </div>
      ) : (
        <StudyClient cards={cards} topicId={topicId} subjectId={subjectId} />
      )}
    </div>
  );
}
