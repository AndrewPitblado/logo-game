"use client";
import React, { useTransition } from "react";
import { useGame } from "./GameContext";
import { useRouter } from "next/navigation";

export default function PlayAgain() {
  const [isPending, startTransition] = useTransition();
  const { setTimeRemaining, setIsGameOver, setScore } = useGame();
  const router = useRouter();

  async function handlePlayAgain() {
    // 1) Reset on server side
    await fetch("/api/reset-game", { method: "POST" });

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={handlePlayAgain}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      {isPending ? "Loading..." : "Play Again"}
    </button>
  );
}
