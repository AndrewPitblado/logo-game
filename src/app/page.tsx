import { db } from "~/server/db";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import {
  getGameStats,
  getMyLogos,
  getRandomLogo,
  resetGameProgress,
} from "~/server/queries";
import { LogoQuizForm } from "./_components/LogoQuizForm";
import { LogoQuizClient } from "./_components/LogoQuizClient";
import { GameProvider } from "./_components/GameContext";
import { ScoreBoard } from "./_components/Scoreboard";
export const dynamic = "force-dynamic";

async function LogoQuiz() {
  const randomLogo = await getRandomLogo();
  const stats = await getGameStats();

  if (!randomLogo) {
    resetGameProgress();
    return (
      <div className="text-center text-2xl">
        <p>Congratulations! You have guessed all of the logos! </p>
        <p>
          Your final score is: {stats.guessed} out of {stats.total}
        </p>
      </div>
    );
  }
  const logoWithCrop = {
    ...randomLogo,
    cropX: randomLogo.cropX ?? 0,
    cropY: randomLogo.cropY ?? 0,
    cropWidth: randomLogo.cropWidth ?? 100,
    cropHeight: randomLogo.cropHeight ?? 100,
  };
  return (
    <div className="w-full max-w-2xl p-4">
      <ScoreBoard />
      <LogoQuizClient randomLogo={logoWithCrop} initialScore={stats.guessed} />
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-wrap items-center justify-center">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in to play the Logo Game.
        </div>
      </SignedOut>
      <SignedIn>{LogoQuiz()}</SignedIn>
    </main>
  );
}
