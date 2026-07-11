import { requireUser } from "@/lib/dal";
import { db } from "@/lib/db";
import { deleteUser } from "@/lib/actions/admin";
import { DeleteButton } from "../delete-button";
import { UserForm } from "./user-form";
import { ResetPasswordForm } from "./reset-password-form";

const ROLE_LABEL: Record<string, string> = {
  PARENT: "Administrador",
  CHILD: "Hija/o",
};

export default async function AdminUsersPage() {
  const me = await requireUser();
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <UserForm />

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-800">
                {user.name}{" "}
                <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {ROLE_LABEL[user.role]}
                </span>
              </p>
              <p className="text-xs text-slate-400">@{user.username}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ResetPasswordForm userId={user.id} />
              {user.id !== me.id && (
                <DeleteButton
                  action={async () => {
                    "use server";
                    await deleteUser(user.id);
                  }}
                  confirmMessage={`¿Eliminar a ${user.name}? Se perderá todo su progreso.`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
