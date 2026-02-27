"use client";

import { useEffect, useState } from "react";
import { GameObject } from "../interfaces/interfaces";
import { NextPieces } from "./nextpieces";

interface StatsProps {
    game: GameObject;
    elapsedTime: number;
}

export default function Stats({ game, elapsedTime }: StatsProps) {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("tetris-high-score");
    if (stored) setHighScore(Number(stored));
  }, []);

  useEffect(() => {
    if (game.score > highScore) {
      setHighScore(game.score);
      localStorage.setItem("tetris-high-score", String(game.score));
    }
  }, [game.score, highScore]);

  return (
    <div className="flex flex-col h-[45vw] w-[20vw] border-2">
      <div className="text-lg"> Time Elapsed: {(elapsedTime / 1000).toFixed(1)}s </div>
      <div className="text-lg"> Score: {game.score} </div>
      <div className="text-lg"> High Score: {highScore} </div>
      <div className="text-lg"> Lines Cleared {game.clearedLines} </div>
      <NextPieces game={game} />
    </div>
  );
}
