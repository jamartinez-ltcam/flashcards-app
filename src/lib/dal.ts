import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const getSession = cache(async () => {
  return auth();
});

export const requireUser = cache(async () => {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
});

export const requireParent = cache(async () => {
  const user = await requireUser();
  if (user.role !== "PARENT") {
    redirect("/dashboard");
  }
  return user;
});
