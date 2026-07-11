import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getSubjectWithTopics } from "@/lib/queries";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const user = await requireUser();
  const subject = await getSubjectWithTopics(subjectId, user.id);

  if (!subject) notFound();

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
        ← Asignaturas
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-800">
        {subject.name}
      </h1>

      {subject.topics.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm">
          Esta asignatura todavía no tiene temas.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {subject.topics.map((topic) => {
            const pct =
              topic.cardCount === 0
                ? 0
                : Math.round((topic.knownCount / topic.cardCount) * 100);
            return (
              <div
                key={topic.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {topic.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {topic.knownCount} de {topic.cardCount} sabidas ({pct}%)
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/subjects/${subject.id}/topics/${topic.id}/study`}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Estudiar
                  </Link>
                  <Link
                    href={`/subjects/${subject.id}/topics/${topic.id}/progress`}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Progreso
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
