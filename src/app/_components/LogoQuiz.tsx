import {
  getGameStats,
  getRandomLogo,
  resetGameProgress,
} from "~/server/queries";
import { LogoQuizClient } from "~/app/_components/LogoQuizClient";
import { ScoreBoard } from "~/app/_components/Scoreboard";
import PlayAgain from "~/app/_components/PlayAgain";
import * as motion from "motion/react-client";
import React from "react";

export default async function LogoQuiz() {
  const randomLogo = await getRandomLogo();
  const stats = await getGameStats();

  if (!randomLogo) {
    await resetGameProgress();

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="p-5 text-center text-2xl">
          <p>Congratulations! You have guessed all of the logos! </p>
          <p>
            Your final score is: {stats.guessed} out of {stats.total}
          </p>
          <br />
          <PlayAgain />
        </div>
      </motion.div>
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
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
