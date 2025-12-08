import { GameObject } from "../interfaces/interfaces";

interface StatsProps {
    game: GameObject;
}
export default function Stats({ game }: StatsProps) {
  return (
    <div className="flex flex-col h-[45vw] w-[20vw] border-2">
      <div className="text-lg"> Time Elapsed: {(game.timeElapsed / 1000).toFixed(1)}s </div>
    </div>
  );
}