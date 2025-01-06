"use client";
import { useRouter } from "next/navigation";
import { LogoQuizForm } from "./LogoQuizForm";
import { useGame } from "./GameContext";
import { CroppedImage } from "./CroppedImage";
import { useEffect } from "react";
interface LogoQuizClientProps {
  randomLogo: {
    url: string;
    name: string;
    id: number;
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
  };
  initialScore: number;
}
import React from "react";

export function LogoQuizClient({
  randomLogo,
  initialScore,
}: LogoQuizClientProps) {
  const router = useRouter();
  const { score, setScore, totalLogos } = useGame();
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setScore(initialScore);
  }, [initialScore, setScore]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return <div>Loading...</div>;
  }

  const handleCorrectGuess = async () => {
    try {
      console.log("Sending imageId :", randomLogo.id);
      await fetch("/api/mark-guessed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId: randomLogo.id }),
      });
      setScore(score + 1);
      router.refresh();
    } catch (error) {
      console.error("Error Marking logo as guessed:", error);
    }
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center">
        <CroppedImage
          src={randomLogo.url}
          alt={randomLogo.name}
          defaultCrop={{
            x: randomLogo.cropX,
            y: randomLogo.cropY,
            width: randomLogo.cropWidth,
            height: randomLogo.cropHeight,
          }}
        />
      </div>

      <LogoQuizForm
        logoName={randomLogo.name}
        onCorrectGuessAction={handleCorrectGuess}
      />
      <button
        onClick={async () => {
          await fetch("/api/reset-game", { method: "POST" });
          setScore(0);
          router.refresh();
        }}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Reset Game
      </button>
    </div>
  );
}
