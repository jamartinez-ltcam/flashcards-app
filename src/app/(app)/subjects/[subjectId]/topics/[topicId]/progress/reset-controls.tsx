"use client";

import { useTransition } from "react";
import { resetCard, resetKnownInTopic } from "@/lib/actions/study";

export function ResetCardButton({
  cardId,
  topicId,
  subjectId,
}: {
  cardId: string;
  topicId: string;
  subjectId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await resetCard(cardId, topicId, subjectId);
        })
      }
      className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-60"
    >
      Resetear
    </button>
  );
}

export function ResetKnownButton({
  topicId,
  subjectId,
  disabled,
}: {
  topicId: string;
  subjectId: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onClick={() => {
        if (
          !confirm(
            "¿Resetear todas las fichas ya sabidas de este tema? Volverán a aparecer en el estudio.",
          )
        )
          return;
        startTransition(async () => {
          await resetKnownInTopic(topicId, subjectId);
        });
      }}
      className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-200 disabled:opacity-50"
    >
      Resetear fichas sabidas
    </button>
  );
}
