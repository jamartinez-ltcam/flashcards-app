import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

const ENGLISH_WORDS: Array<[string, string]> = [
  ["dog", "perro"],
  ["cat", "gato"],
  ["house", "casa"],
  ["tree", "árbol"],
  ["water", "agua"],
  ["book", "libro"],
  ["friend", "amigo/a"],
  ["school", "colegio"],
  ["family", "familia"],
  ["food", "comida"],
  ["sun", "sol"],
  ["moon", "luna"],
  ["red", "rojo"],
  ["blue", "azul"],
  ["green", "verde"],
  ["yellow", "amarillo"],
  ["black", "negro"],
  ["white", "blanco"],
  ["one", "uno"],
  ["two", "dos"],
  ["three", "tres"],
  ["four", "cuatro"],
  ["five", "cinco"],
  ["six", "seis"],
  ["seven", "siete"],
  ["eight", "ocho"],
  ["nine", "nueve"],
  ["ten", "diez"],
  ["mother", "madre"],
  ["father", "padre"],
  ["sister", "hermana"],
  ["brother", "hermano"],
  ["horse", "caballo"],
  ["bird", "pájaro"],
  ["fish", "pez"],
  ["apple", "manzana"],
  ["bread", "pan"],
  ["milk", "leche"],
  ["happy", "feliz"],
  ["sad", "triste"],
];

async function main() {
  const adminUsername = "papa";
  const adminPassword = "cambiar123";

  const admin = await db.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      name: "Papá",
      username: adminUsername,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "PARENT",
    },
  });

  const english = await db.subject.upsert({
    where: { id: "seed-subject-english" },
    update: {},
    create: {
      id: "seed-subject-english",
      name: "Inglés",
      color: "#3b82f6",
      createdById: admin.id,
    },
  });

  const basicVocab = await db.topic.upsert({
    where: { id: "seed-topic-basic-vocab" },
    update: {},
    create: {
      id: "seed-topic-basic-vocab",
      name: "Vocabulario básico",
      subjectId: english.id,
    },
  });

  for (const [front, back] of ENGLISH_WORDS) {
    const existing = await db.flashcard.findFirst({
      where: { topicId: basicVocab.id, front },
    });
    if (!existing) {
      await db.flashcard.create({
        data: { front, back, topicId: basicVocab.id },
      });
    }
  }

  console.log("Seed completado.");
  console.log(`Usuario administrador: ${adminUsername} / ${adminPassword}`);
  console.log("Cambia esta contraseña desde Administración > Usuarios.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
