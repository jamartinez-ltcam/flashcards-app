"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireParent } from "@/lib/dal";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createSubject(_prevState: string | undefined, formData: FormData) {
  const user = await requireParent();
  const name = str(formData, "name");
  const color = str(formData, "color") || "#6366f1";
  if (!name) return "El nombre es obligatorio.";

  await db.subject.create({ data: { name, color, createdById: user.id } });
  revalidatePath("/admin/subjects");
  revalidatePath("/dashboard");
}

export async function deleteSubject(subjectId: string) {
  await requireParent();
  await db.subject.delete({ where: { id: subjectId } });
  revalidatePath("/admin/subjects");
  revalidatePath("/dashboard");
}

export async function createTopic(
  subjectId: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  await requireParent();
  const name = str(formData, "name");
  if (!name) return "El nombre es obligatorio.";

  await db.topic.create({ data: { name, subjectId } });
  revalidatePath(`/admin/subjects/${subjectId}`);
  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath("/dashboard");
}

export async function deleteTopic(topicId: string, subjectId: string) {
  await requireParent();
  await db.topic.delete({ where: { id: topicId } });
  revalidatePath(`/admin/subjects/${subjectId}`);
  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath("/dashboard");
}

export async function createFlashcard(
  topicId: string,
  subjectId: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  await requireParent();
  const front = str(formData, "front");
  const back = str(formData, "back");
  if (!front || !back) return "Rellena la pregunta y la respuesta.";

  await db.flashcard.create({ data: { front, back, topicId } });
  revalidatePath(`/admin/subjects/${subjectId}/topics/${topicId}`);
  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath("/dashboard");
}

export async function deleteFlashcard(
  cardId: string,
  topicId: string,
  subjectId: string,
) {
  await requireParent();
  await db.flashcard.delete({ where: { id: cardId } });
  revalidatePath(`/admin/subjects/${subjectId}/topics/${topicId}`);
  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath("/dashboard");
}

export async function createUser(_prevState: string | undefined, formData: FormData) {
  await requireParent();
  const name = str(formData, "name");
  const username = str(formData, "username").toLowerCase();
  const password = str(formData, "password");

  if (!name || !username || !password) {
    return "Rellena nombre, usuario y contraseña.";
  }
  if (password.length < 4) {
    return "La contraseña debe tener al menos 4 caracteres.";
  }

  const existing = await db.user.findUnique({ where: { username } });
  if (existing) return "Ese nombre de usuario ya existe.";

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.create({
    // Solo la cuenta administradora sembrada inicialmente puede administrar;
    // toda cuenta creada desde aquí es de hija/o, sin excepción.
    data: { name, username, passwordHash, role: "CHILD" },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  const currentUser = await requireParent();
  if (userId === currentUser.id) return;
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export async function resetUserPassword(
  userId: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  await requireParent();
  const password = str(formData, "password");
  if (password.length < 4) {
    return "La contraseña debe tener al menos 4 caracteres.";
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.update({ where: { id: userId }, data: { passwordHash } });
  revalidatePath("/admin/users");
  return "Contraseña actualizada.";
}
