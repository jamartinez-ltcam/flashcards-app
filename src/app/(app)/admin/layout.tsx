import Link from "next/link";
import { requireUser } from "@/lib/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Administración</h1>
      <p className="mb-6 text-slate-500">
        Gestiona asignaturas, temas y fichas.
      </p>
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <Link
          href="/admin/subjects"
          className="rounded-t-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Asignaturas
        </Link>
        {user.role === "PARENT" && (
          <Link
            href="/admin/users"
            className="rounded-t-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Usuarios
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
