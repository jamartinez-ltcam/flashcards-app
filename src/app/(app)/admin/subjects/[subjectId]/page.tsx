import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteTopic } from "@/lib/actions/admin";
import { DeleteButton } from "../../delete-button";
import { TopicForm } from "./topic-form";

export default async function AdminSubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: {
      topics: {
        orderBy: { createdAt: "asc" },
        include: { _count: { select: { flashcards: true } } },
      },
    },
  });

  if (!subject) notFound();

  return (
    <div>
      <Link
        href="/admin/subjects"
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Asignaturas
      </Link>
      <h2 className="mb-6 mt-2 text-xl font-bold text-slate-800">
        {subject.name}
      </h2>

      <TopicForm subjectId={subject.id} />

      <div className="flex flex-col gap-3">
        {subject.topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm"
          >
            <Link
              href={`/admin/subjects/${subject.id}/topics/${topic.id}`}
              className="flex-1"
            >
              <p className="font-medium text-slate-800">{topic.name}</p>
              <p className="text-xs text-slate-400">
                {topic._count.flashcards} fichas
              </p>
            </Link>
            <DeleteButton
              action={async () => {
                "use server";
                await deleteTopic(topic.id, subject.id);
              }}
              confirmMessage={`¿Eliminar el tema "${topic.name}" y todas sus fichas?`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
