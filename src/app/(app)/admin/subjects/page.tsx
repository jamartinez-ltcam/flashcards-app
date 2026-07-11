import Link from "next/link";
import { db } from "@/lib/db";
import { DeleteButton } from "../delete-button";
import { deleteSubject } from "@/lib/actions/admin";
import { SubjectForm } from "./subject-form";

export default async function AdminSubjectsPage() {
  const subjects = await db.subject.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { topics: true } } },
  });

  return (
    <div>
      <SubjectForm />

      <div className="flex flex-col gap-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm"
          >
            <Link
              href={`/admin/subjects/${subject.id}`}
              className="flex flex-1 items-center gap-3"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              <div>
                <p className="font-medium text-slate-800">{subject.name}</p>
                <p className="text-xs text-slate-400">
                  {subject._count.topics} temas
                </p>
              </div>
            </Link>
            <DeleteButton
              action={async () => {
                "use server";
                await deleteSubject(subject.id);
              }}
              confirmMessage={`¿Eliminar "${subject.name}"? Se borrarán también sus temas y fichas.`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
