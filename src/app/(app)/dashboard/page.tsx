import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { getSubjectsWithProgress } from "@/lib/queries";

export default async function DashboardPage() {
  const user = await requireUser();
  const subjects = await getSubjectsWithProgress(user.id);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800">
        Hola, {user.name ?? user.username} 👋
      </h1>
      <p className="mb-6 text-slate-500">Elige una asignatura para estudiar</p>

      {subjects.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm">
          Todavía no hay asignaturas.{" "}
          {user.role === "PARENT" && (
            <>
              Ve a{" "}
              <Link href="/admin/subjects" className="text-indigo-600 underline">
                Administración
              </Link>{" "}
              para crear la primera.
            </>
          )}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {subjects.map((subject) => {
            const pct =
              subject.cardCount === 0
                ? 0
                : Math.round((subject.knownCount / subject.cardCount) * 100);
            return (
              <Link
                key={subject.id}
                href={`/subjects/${subject.id}`}
                className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <h2 className="text-lg font-semibold text-slate-800">
                    {subject.name}
                  </h2>
                </div>
                <p className="mb-2 text-sm text-slate-500">
                  {subject.topicCount} temas · {subject.cardCount} fichas
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {subject.knownCount} de {subject.cardCount} sabidas ({pct}%)
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
