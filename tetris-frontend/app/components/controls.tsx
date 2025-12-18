import { Button } from "@/components/ui/button";
import { GameObject, GameState, GridCell, Position } from "../interfaces/interfaces";
import { Start } from "../context/gamecontext";
import { Pause } from "lucide-react";
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
    const newGame = Start(game);
    setGame(newGame);
    setPosition(SPAWN_POSITION);
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
