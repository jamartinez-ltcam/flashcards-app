"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { markCard } from "@/lib/actions/study";

type Card = { id: string; front: string; back: string };

export function StudyClient({
  cards,
  topicId,
  subjectId,
}: {
  cards: Card[];
  topicId: string;
  subjectId: string;
}) {
  const [queue, setQueue] = useState(cards);
  const [flipped, setFlipped] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const current = queue[0];
  const totalRemaining = queue.length;

  function handleAnswer(result: "KNOWN" | "UNKNOWN") {
    if (!current) return;
    const card = current;

    startTransition(async () => {
      await markCard(card.id, result, topicId, subjectId);
    });

    setFlipped(false);
    setQueue((prev) => {
      const [, ...rest] = prev;
      if (result === "KNOWN") {
        return rest;
      }
      return [...rest, card];
    });
    if (result === "KNOWN") setDoneCount((d) => d + 1);
  }

  if (!current) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="mb-4 text-lg text-slate-700">
          🎉 ¡Repaso completado! Has aprendido {doneCount} fichas nuevas.
        </p>
        <Link
          href={`/subjects/${subjectId}/topics/${topicId}/progress`}
          className="text-indigo-600 underline"
        >
          Ver progreso
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-slate-500">
        Quedan {totalRemaining} fichas por repasar
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={`flex min-h-[220px] w-full max-w-md flex-col items-center justify-center gap-3 rounded-3xl border-2 p-8 text-center shadow-lg transition hover:shadow-xl ${
          flipped
            ? "border-amber-300 bg-amber-50 text-amber-900"
            : "border-indigo-300 bg-indigo-50 text-indigo-900"
        }`}
      >
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
            flipped
              ? "bg-amber-200 text-amber-800"
              : "bg-indigo-200 text-indigo-800"
          }`}
        >
          {flipped ? "Respuesta" : "Pregunta"}
        </span>
        <span className="text-2xl font-semibold">
          {flipped ? current.back : current.front}
        </span>
      </button>
      <p className="-mt-4 text-xs text-slate-400">
        Toca la ficha para {flipped ? "ver la pregunta" : "ver la respuesta"}
      </p>

      <div className="flex w-full max-w-md gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleAnswer("UNKNOWN")}
          className="flex-1 rounded-xl bg-rose-100 px-4 py-3 font-semibold text-rose-700 hover:bg-rose-200 disabled:opacity-60"
        >
          Aún no
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleAnswer("KNOWN")}
          className="flex-1 rounded-xl bg-emerald-100 px-4 py-3 font-semibold text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
        >
          Lo sé
        </button>
      </div>
    </div>
  );
}
