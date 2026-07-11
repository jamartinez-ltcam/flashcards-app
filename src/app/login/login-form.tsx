"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";

export function LoginForm() {
  const [errorMessage, formAction, pending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium text-slate-700">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoFocus
          className="rounded-xl border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="rounded-xl border border-slate-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-indigo-600 px-4 py-3 text-lg font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
