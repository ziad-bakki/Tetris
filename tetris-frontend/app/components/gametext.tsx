import { GameState } from "../interfaces/interfaces"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface GameTextProps {
  gameState: GameState;
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

export default function GameText({ gameState }: GameTextProps) {
  const gameText: string = getGameText(gameState);
  return (
    <Dialog defaultOpen={true}>
      {/* <DialogTrigger></DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gameText}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
