"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/dal";

export async function markCard(
  cardId: string,
  result: "KNOWN" | "UNKNOWN",
  topicId: string,
  subjectId: string,
) {
  const user = await requireUser();

  await db.$transaction([
    db.cardProgress.upsert({
      where: { userId_cardId: { userId: user.id, cardId } },
      create: {
        userId: user.id,
        cardId,
        status: result === "KNOWN" ? "KNOWN" : "LEARNING",
        timesReviewed: 1,
        lastReviewedAt: new Date(),
      },
      update: {
        status: result === "KNOWN" ? "KNOWN" : "LEARNING",
        timesReviewed: { increment: 1 },
        lastReviewedAt: new Date(),
      },
    }),
    db.reviewLog.create({
      data: { userId: user.id, cardId, result },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath(`/subjects/${subjectId}/topics/${topicId}/progress`);
}

export async function resetCard(
  cardId: string,
  topicId: string,
  subjectId: string,
) {
  const user = await requireUser();

  await db.cardProgress.upsert({
    where: { userId_cardId: { userId: user.id, cardId } },
    create: { userId: user.id, cardId, status: "NEW" },
    update: { status: "NEW" },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath(`/subjects/${subjectId}/topics/${topicId}/progress`);
}

export async function resetKnownInTopic(topicId: string, subjectId: string) {
  const user = await requireUser();

  await db.cardProgress.updateMany({
    where: {
      userId: user.id,
      status: "KNOWN",
      card: { topicId },
    },
    data: { status: "NEW" },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath(`/subjects/${subjectId}/topics/${topicId}/progress`);
}
