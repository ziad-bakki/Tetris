import { Button } from "@/components/ui/button";
import { GameObject, GameState } from "../interfaces/interfaces"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface GameTextProps {
  game: GameObject;
  setGame: (game: GameObject) => void;
}

function getGameText(state: GameState): string {
  switch (state) {
    case GameState.Menu: {
      return "Start Game";
    }
    case GameState.Win: {
      return "Win"
    }
    case GameState.Over: {
      return "Game Over";
    }
    case GameState.Paused: {
      return "Paused"
    }
    case GameState.Running: {
      return "Running"
    }
  }
}

function getGameDescription(state: GameState): string {
  switch (state) {
    case GameState.Menu: {
      return "Click Start to Begin";
    }
    case GameState.Win: {
      return "You Win"
    }
    case GameState.Over: {
      return "You Lose";
    }
    case GameState.Paused: {
      return "Click the Button Below to Continue"
    }
    case GameState.Running: {
      return "Running"
    }
  }
}

export default function GameText({ game, setGame }: GameTextProps) {
  const gameState: GameState = game.state;
  const gameText: string = getGameText(gameState);
  const gameDescription: string = getGameDescription(gameState);

  const handlePause = () => {
    setGame({ ...game, state: GameState.Running, })
  }
  return (
    <Dialog defaultOpen={true}>
      {/* <DialogTrigger></DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gameText}</DialogTitle>
          <DialogDescription>
            {gameDescription}
            <br />
            {gameState === GameState.Paused &&
              <Button onClick={handlePause}>
                unpause
              </Button>
            }
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
