import { GameObject } from "../interfaces/interfaces";
import { NextPieces } from "./nextpieces";

interface StatsProps {
    game: GameObject;
    elapsedTime: number;
}
export default function Stats({ game, elapsedTime }: StatsProps) {
  return (
    <div className="flex flex-col h-[45vw] w-[20vw] border-2">
      <div className="text-lg"> Time Elapsed: {(elapsedTime / 1000).toFixed(1)}s </div>
      <div className="text-lg"> Lines Cleared {game.clearedLines} </div>
      <NextPieces game={game} />
    </div>
  );
}