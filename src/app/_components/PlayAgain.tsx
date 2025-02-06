"use client";
import React, { use, useEffect, useTransition } from "react";
import { useGame } from "./GameContext";
import { useRouter } from "next/navigation";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import * as motion from "motion/react-client";
export default function PlayAgain() {
  const [isPending, startTransition] = useTransition();
  const {
    setTimeRemaining,
    setIsGameOver,
    setScore,
    setGameTimeRemaining,
    setIncorrectGuesses,
  } = useGame();
  const router = useRouter();
  const { width, height } = useWindowSize();

  async function handlePlayAgain() {
    // 1) Reset on server side
    await fetch("/api/reset-game", { method: "POST" });
    setGameTimeRemaining(300);
    setIncorrectGuesses(0);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="p-5 text-center text-2xl">
      <Confetti width={width} height={height} />
      <motion.button
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.5 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={handlePlayAgain}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          {isPending ? "Loading..." : "Play Again"}
        </button>
      </motion.button>
    </div>
  );
}
