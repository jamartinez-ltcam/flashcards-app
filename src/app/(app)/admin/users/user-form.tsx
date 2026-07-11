"use client";

import { useActionState } from "react";
import { createUser } from "@/lib/actions/admin";

export function UserForm() {
  const [error, formAction, pending] = useActionState(createUser, undefined);

  return (
    <form action={formAction} className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-600">
        Nuevo usuario
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Nombre
          </label>
          <input
            name="name"
            required
            placeholder="Lucía"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Usuario
          </label>
          <input
            name="username"
            required
            placeholder="lucia"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Contraseña
          </label>
          <input
            name="password"
            type="text"
            required
            placeholder="mín. 4 caracteres"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Las cuentas que crees aquí son de hija/o. Solo tu cuenta puede administrar.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Creando..." : "Crear usuario"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
