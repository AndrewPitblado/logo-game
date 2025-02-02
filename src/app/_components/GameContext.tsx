"use client";
import React, { createContext, useContext, useState } from "react";

interface GameContextType {
  score: number;
  setScore: (score: number | ((prev: number) => number)) => void;
  totalLogos: number;
  setTotalLogos: (totalLogos: number) => void;
  incorrectGuesses: number;
  setIncorrectGuesses: (guesses: number | ((prev: number) => number)) => void;
  timeRemaining: number;
  setTimeRemaining: (
    timeRemaining: number | ((prev: number) => number),
  ) => void;
  gameTimeRemaining: number;
  setGameTimeRemaining: (
    gameTimeRemaining: number | ((prev: number) => number),
  ) => void;
  isGameOver: boolean;
  setIsGameOver: (isGameOver: boolean) => void;
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({
  children,
  initialTotal,
}: {
  children: React.ReactNode;
  initialTotal: number;
}) {
  const [score, setScore] = useState(0);
  const [totalLogos, setTotalLogos] = useState(initialTotal);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [gameTimeRemaining, setGameTimeRemaining] = useState(300);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  return (
    <GameContext.Provider
      value={{
        score,
        setScore,
        totalLogos,
        setTotalLogos,
        incorrectGuesses,
        setIncorrectGuesses,
        timeRemaining,
        setTimeRemaining,
        gameTimeRemaining,
        setGameTimeRemaining,
        isGameOver,
        setIsGameOver,
        isGameStarted,
        setIsGameStarted,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
