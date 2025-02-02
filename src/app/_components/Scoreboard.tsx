"use client";
import { useEffect } from "react";
import { useGame } from "./GameContext";

export function ScoreBoard() {
  const {
    score,
    totalLogos,
    isGameOver,
    timeRemaining,
    setTimeRemaining,
    incorrectGuesses,
  } = useGame();

  return (
    <div className="mb-6 flex w-full justify-around rounded-lg bg-blue-400 p-4 text-center">
      <div>
        <div className="text-sm text-black">Score</div>
        <div
          className={`text-2xl font-bold ${score < 0 ? "text-red-600" : ""}`}
        >
          {score}
        </div>
      </div>
      <div>
        <div className="text-sm text-black">Time Remaining</div>
        <div
          className={`text-2xl font-bold ${timeRemaining < 10 ? "text-red-600" : ""}`}
        >
          {" "}
          {timeRemaining}s
        </div>
      </div>
      <div>
        <div className="text-sm text-black"> Incorrect Tries</div>
        <div className="text-2xl font-bold">{incorrectGuesses}</div>
      </div>
    </div>
  );
}
