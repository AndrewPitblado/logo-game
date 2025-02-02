"use client";
import { useEffect, useState } from "react";
import { useGame } from "./GameContext";
import { useRouter } from "next/navigation";
import { resetGameProgress } from "~/server/queries";
import * as motion from "motion/react-client";
interface LogoQuizFormProps {
  logoName: string;
  onCorrectGuessAction: (arg0: number) => Promise<void>;
}

export function LogoQuizForm({
  logoName,
  onCorrectGuessAction,
}: LogoQuizFormProps) {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const {
    timeRemaining,
    setTimeRemaining,
    incorrectGuesses,
    setIncorrectGuesses,
    setScore,
    score,
    isGameOver,
    setIsGameStarted,
  } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (isGameOver) {
      return;
    }
    const timer =
      timeRemaining > 0 &&
      setInterval(
        () => setTimeRemaining((prev: number) => Math.max(0, prev - 1)),
        1000,
      );
    if (timeRemaining == 0) {
      setMessage("Time's up!");
      setTimeRemaining(30);
      setMessage("");
      router.refresh();
    }
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [timeRemaining, setTimeRemaining, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timeRemaining <= 0) {
      setMessage("Time's up!");
      setTimeRemaining(30);
      router.refresh();

      return;
    }

    if (guess.toLowerCase() === logoName.toLowerCase()) {
      const points = Math.max(10, 30 - incorrectGuesses * 5 + timeRemaining);
      setMessage("Correct!");

      await onCorrectGuessAction(points);
      setTimeRemaining(30);

      setMessage("");
      setGuess("");
    } else {
      setIncorrectGuesses((prev) => prev + 1);
      setScore((prev: number) => Math.max(0, prev - 1));
      setMessage("Oops not quite");
      setGuess("");
      setTimeout(() => {
        router.refresh();
      }, 1000);
    }
  };

  if (isGameOver) {
    return (
      <div className="text-center text-2xl">
        <p>Game Over!</p>
        <p>Final Score: {score}</p>
        <button
          onClick={async () => {
            await fetch("/api/reset-game", { method: "POST" });
            setScore(0);

            router.refresh();
          }}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="What logo is this?"
          className="bg-black-500 rounded border bg-gray-50 px-4 py-2 text-gray-500"
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Submit Guess
        </button>

        {message && (
          <div
            className={
              message === "Correct!" ? "text-green-500" : "text-red-500"
            }
          >
            {message}
          </div>
        )}
        <button
          onClick={async () => {
            await fetch("/api/reset-game", { method: "POST" });
            setScore(0);
            setIsGameStarted(false);
            router.refresh();
          }}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Reset Game
        </button>
      </form>
    </motion.div>
  );
}
