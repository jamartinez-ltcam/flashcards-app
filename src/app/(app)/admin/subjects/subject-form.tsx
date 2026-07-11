"use client";

import { useActionState } from "react";
import { createSubject } from "@/lib/actions/admin";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899"];

export function SubjectForm() {
  const [error, formAction, pending] = useActionState(createSubject, undefined);

  return (
    <form action={formAction} className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-600">
        Nueva asignatura
      </h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Nombre
          </label>
          <input
            name="name"
            required
            placeholder="Inglés, Historia..."
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Color
          </label>
          <select
            name="color"
            defaultValue={COLORS[0]}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Creando..." : "Crear"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
