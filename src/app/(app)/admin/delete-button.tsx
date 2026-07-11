"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmMessage,
  label = "Eliminar",
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        startTransition(action);
      }}
      className="rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
    >
      {label}
    </button>
  );
}
