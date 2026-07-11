"use client";

import { useActionState } from "react";
import { createTopic } from "@/lib/actions/admin";

export function TopicForm({ subjectId }: { subjectId: string }) {
  const action = createTopic.bind(null, subjectId);
  const [error, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="mb-6 flex gap-3 rounded-2xl bg-white p-5 shadow-sm"
    >
      <input
        name="name"
        required
        placeholder="Nuevo tema (ej. Vocabulario básico)"
        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Creando..." : "Crear tema"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
