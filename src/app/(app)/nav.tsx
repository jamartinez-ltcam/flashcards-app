import Link from "next/link";
import { LogoutButton } from "./logout-button";

export function Nav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link
          href="/dashboard"
          className="shrink-0 text-lg font-bold text-indigo-700"
        >
          📚<span className="hidden sm:inline"> Flashcards</span>
        </Link>
        <nav className="flex min-w-0 items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/dashboard"
            className="shrink-0 rounded-lg px-2 py-1.5 font-medium text-slate-600 hover:bg-slate-100 sm:px-3"
          >
            Estudiar
          </Link>
          <Link
            href="/admin"
            className="shrink-0 rounded-lg px-2 py-1.5 font-medium text-slate-600 hover:bg-slate-100 sm:px-3"
          >
            <span className="sm:hidden">Admin</span>
            <span className="hidden sm:inline">Administración</span>
          </Link>
          <span className="hidden truncate pl-2 text-slate-400 md:inline">
            {name}
          </span>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
