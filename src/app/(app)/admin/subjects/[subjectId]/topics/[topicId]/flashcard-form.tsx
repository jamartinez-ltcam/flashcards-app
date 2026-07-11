"use client";

import { useActionState, useRef, useEffect } from "react";
import { createFlashcard } from "@/lib/actions/admin";

export function FlashcardForm({
  topicId,
  subjectId,
}: {
  topicId: string;
  subjectId: string;
}) {
  const action = createFlashcard.bind(null, topicId, subjectId);
  const [error, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !error) formRef.current?.reset();
  }, [pending, error]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Pregunta / palabra
        </label>
        <input
          name="front"
          required
          placeholder="dog"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Respuesta
        </label>
        <input
          name="back"
          required
          placeholder="perro"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Añadiendo..." : "Añadir ficha"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
