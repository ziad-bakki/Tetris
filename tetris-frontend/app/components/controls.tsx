import { Button } from "@/components/ui/button";
import { GameObject, GameState, GridCell } from "../interfaces/interfaces";
import { drawPiece, generateNextPieces, } from "../context/gamecontext";
import { Pause } from "lucide-react"; import { Position } from "../interfaces/interfaces";
import { SPAWN_POSITION } from "../consts/consts";

interface ControlsProps {
  grid: GridCell[][];
  setPosition: (position: Position) => void;
  resetTimer: () => void;
  game: GameObject;
  setGame: (game: GameObject) => void;
}

export function Controls({ grid, setPosition, resetTimer, game, setGame }: ControlsProps) {

  const handleStart = () => {
    const nextPiece = game.nextPieces[0];
    const tempGame: GameObject = { ...game, nextPieces: game.nextPieces.slice(1) };
    const newNextPieces = generateNextPieces(tempGame, 4);
    const newPosition = SPAWN_POSITION;
    const newGrid = drawPiece(grid, nextPiece, newPosition);
    setGame({ ...game, state: GameState.Running, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid });
    setPosition(newPosition);
    resetTimer();
  };


  const running = game.state === GameState.Running;
  const handlePause = () => {
    if (game.state === GameState.Running) {
      setGame({ ...game, state: GameState.Paused });
    } else {
      setGame({ ...game, state: GameState.Running });
    }
  }


  return (
    <div className="flex flex-row justify-center gap-1">
      {
        game.state === GameState.Menu &&
        <Button variant="destructive" onClick={handleStart}>Start</Button>
      }
      {
        running &&
        <Button onClick={handlePause}>
          <Pause />
        </Button>
      }
    </div>
  );
}
