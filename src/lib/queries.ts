import "server-only";
import { db } from "@/lib/db";

export async function getSubjectsWithProgress(userId: string) {
  const subjects = await db.subject.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      topics: {
        include: {
          flashcards: {
            include: {
              progress: { where: { userId } },
            },
          },
        },
      },
    },
  });

  return subjects.map((subject) => {
    const cards = subject.topics.flatMap((t) => t.flashcards);
    const known = cards.filter(
      (c) => c.progress[0]?.status === "KNOWN",
    ).length;
    return {
      id: subject.id,
      name: subject.name,
      color: subject.color,
      topicCount: subject.topics.length,
      cardCount: cards.length,
      knownCount: known,
    };
  });
}

export async function getSubjectWithTopics(subjectId: string, userId: string) {
  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: {
      topics: {
        orderBy: { createdAt: "asc" },
        include: {
          flashcards: {
            include: {
              progress: { where: { userId } },
            },
          },
        },
      },
    },
  });

  if (!subject) return null;

  return {
    id: subject.id,
    name: subject.name,
    color: subject.color,
    topics: subject.topics.map((topic) => {
      const known = topic.flashcards.filter(
        (c) => c.progress[0]?.status === "KNOWN",
      ).length;
      return {
        id: topic.id,
        name: topic.name,
        cardCount: topic.flashcards.length,
        knownCount: known,
      };
    }),
  };
}

export async function getTopicMeta(topicId: string) {
  return db.topic.findUnique({
    where: { id: topicId },
    include: { subject: true },
  });
}

export async function getStudyQueue(topicId: string, userId: string) {
  const cards = await db.flashcard.findMany({
    where: { topicId },
    orderBy: { createdAt: "asc" },
    include: { progress: { where: { userId } } },
  });

  return cards
    .filter((c) => c.progress[0]?.status !== "KNOWN")
    .map((c) => ({ id: c.id, front: c.front, back: c.back }));
}

export async function getTopicProgress(topicId: string, userId: string) {
  const cards = await db.flashcard.findMany({
    where: { topicId },
    orderBy: { createdAt: "asc" },
    include: { progress: { where: { userId } } },
  });

  const known = cards.filter((c) => c.progress[0]?.status === "KNOWN");
  const learning = cards.filter((c) => c.progress[0]?.status === "LEARNING");
  const fresh = cards.filter((c) => !c.progress[0] || c.progress[0].status === "NEW");

  return {
    total: cards.length,
    known: known.length,
    learning: learning.length,
    fresh: fresh.length,
    cards: cards.map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
      status: c.progress[0]?.status ?? "NEW",
    })),
  };
}

export async function getReviewHistory(
  topicId: string,
  userId: string,
  days = 14,
) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const logs = await db.reviewLog.findMany({
    where: {
      userId,
      reviewedAt: { gte: since },
      card: { topicId },
    },
    select: { reviewedAt: true, result: true },
  });

  // Use local calendar-day keys (not toISOString, which shifts to UTC and
  // can push "today" into a different bucket depending on the server's
  // timezone offset).
  const dayKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const buckets = new Map<string, { known: number; unknown: number }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(dayKey(d), { known: 0, unknown: 0 });
  }

  for (const log of logs) {
    const key = dayKey(log.reviewedAt);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (log.result === "KNOWN") bucket.known += 1;
    else bucket.unknown += 1;
  }

  return Array.from(buckets.entries()).map(([date, counts]) => ({
    date: date.slice(5),
    ...counts,
  }));
}
