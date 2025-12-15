import { Button } from "@/components/ui/button";
import { GameObject, GameState, GridCell } from "../interfaces/interfaces";
import { drawPiece, generateRandomPiece } from "../context/gamecontext";
import { Pause, Play } from "lucide-react";
import { Position } from "../interfaces/interfaces";
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
    const remainingPieces = game.nextPieces.slice(1);
    const newNextPieces = [...remainingPieces, generateRandomPiece()];
    const newPosition = SPAWN_POSITION;
    const newGrid = drawPiece(grid, nextPiece, newPosition);
    setGame({ ...game, state: GameState.Running, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid });
    setPosition(newPosition);
    resetTimer();
  };


  const PauseButton = game.state === GameState.Running ? (<Pause />) : (<Play />);
  const running = game.state === GameState.Running || game.state === GameState.Paused;
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
        <Button onClick={handlePause}>{PauseButton}</Button>
      }
    </div>
  );
}
