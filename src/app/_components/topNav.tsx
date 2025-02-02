"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { UploadButton } from "../../utils/uploadthing";
import { useRouter } from "next/navigation";
import { useGame } from "./GameContext";
import { useEffect } from "react";
import { time } from "console";
export function TopNav() {
  const router = useRouter();
  const {
    score,
    gameTimeRemaining,
    setGameTimeRemaining,
    setIsGameOver,
    isGameStarted,
  } = useGame();

  useEffect(() => {
    if (!isGameStarted) return;

    const timer =
      gameTimeRemaining > 0 &&
      setInterval(() => {
        setGameTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            clearInterval(timer as NodeJS.Timeout);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [gameTimeRemaining, setGameTimeRemaining, setIsGameOver, isGameStarted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <nav className="flex w-full items-center justify-between border-b bg-gray-800 p-4 font-semibold text-white">
      <div className="text-2xl">Logo Game</div>

      <div
        className={`text-xl ${gameTimeRemaining < 60 ? "text-red-500" : ""}`}
      >
        Time: {formatTime(gameTimeRemaining)}
      </div>
      <div className="flex flex-row">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={() => {
              router.refresh();
            }}
          />
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
