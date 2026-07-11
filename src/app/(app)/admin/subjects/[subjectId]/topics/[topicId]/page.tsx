import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteFlashcard } from "@/lib/actions/admin";
import { DeleteButton } from "../../../../delete-button";
import { FlashcardForm } from "./flashcard-form";

export default async function AdminTopicPage({
  params,
}: {
  params: Promise<{ subjectId: string; topicId: string }>;
}) {
  const { subjectId, topicId } = await params;
  const topic = await db.topic.findUnique({
    where: { id: topicId },
    include: {
      subject: true,
      flashcards: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!topic || topic.subjectId !== subjectId) notFound();

  return (
    <div>
      <Link
        href={`/admin/subjects/${subjectId}`}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← {topic.subject.name}
      </Link>
      <h2 className="mb-6 mt-2 text-xl font-bold text-slate-800">
        {topic.name}
      </h2>

      <FlashcardForm topicId={topic.id} subjectId={subjectId} />

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {topic.flashcards.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">
            Todavía no hay fichas en este tema.
          </p>
        ) : (
          topic.flashcards.map((card) => (
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
              <DeleteButton
                action={async () => {
                  "use server";
                  await deleteFlashcard(card.id, topic.id, subjectId);
                }}
                confirmMessage={`¿Eliminar la ficha "${card.front}"?`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
