"use client";

import { useActionState } from "react";
import { resetUserPassword } from "@/lib/actions/admin";

export function ResetPasswordForm({ userId }: { userId: string }) {
  const action = resetUserPassword.bind(null, userId);
  const [message, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input
        name="password"
        type="text"
        placeholder="Nueva contraseña"
        required
        className="w-36 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-60"
      >
        {pending ? "..." : "Cambiar"}
      </button>
      {message && <span className="text-xs text-emerald-600">{message}</span>}
    </form>
  );
}
