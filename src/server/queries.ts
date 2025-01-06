import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { defaultLogos } from "./defaultLogos";
import { gameProgress, images } from "./db/schema";
import { count, and, eq, isNull } from "drizzle-orm";

export async function initalizeUserLogos(userId: string) {
  const existingLogos = await db.query.images.findMany({
    where: (model, { and, eq }) =>
      and(eq(model.userId, userId), eq(model.isDefault, true)),
  });
  const existingUrls = new Set(existingLogos.map((logo) => logo.url));
  const newLogosToAdd = defaultLogos.filter(
    (logo) => !existingUrls.has(logo.url),
  );

  if (newLogosToAdd.length > 0) {
    const logosToInsert = newLogosToAdd.map((logo) => ({
      userId: userId,
      url: logo.url,
      name: logo.name,
      isDefault: true,
    }));
    await db.insert(images).values(logosToInsert);
  }
}

export async function getMyLogos() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  await initalizeUserLogos(user.userId);
  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
  });
  return images;
}
export async function getRandomLogo() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  await initalizeUserLogos(user.userId);

  const imageResults = await db
    .select({
      id: images.id,
      name: images.name,
      url: images.url,
      cropX: images.cropX,
      cropY: images.cropY,
      cropWidth: images.cropWidth,
      cropHeight: images.cropHeight,
    })
    .from(images)
    .leftJoin(
      gameProgress,
      and(
        eq(gameProgress.imageId, images.id),
        eq(gameProgress.userId, user.userId),
        eq(gameProgress.guessedCorrectly, true),
      ),
    )
    .where(
      and(
        eq(images.userId, user.userId),
        isNull(gameProgress.id), // This ensures we only get unguessed logos
      ),
    );

  if (imageResults.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * imageResults.length);
  return imageResults[randomIndex];
}

export async function markLogoAsGuessed(imageId: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db.insert(gameProgress).values({
    userId: user.userId,
    imageId: imageId,
    guessedCorrectly: true,
  });
}

export async function getGameStats() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const stats = await db
    .select({
      total: count(images.id),
      guessed: count(gameProgress.id),
    })
    .from(images)
    .leftJoin(
      gameProgress,
      and(
        eq(gameProgress.imageId, images.id),
        eq(gameProgress.userId, user.userId),
        eq(gameProgress.guessedCorrectly, true),
      ),
    )
    .where(eq(images.userId, user.userId))
    .groupBy(images.userId);

  return stats[0] ?? { total: 0, guessed: 0 };
}

export async function resetGameProgress() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db.delete(gameProgress).where(eq(gameProgress.userId, user.userId));
}
