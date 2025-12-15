import { GameState } from "../interfaces/interfaces"

interface GameTextProps {
  gameState: GameState;
}

function getGameText(state: GameState): string {
  switch (state) {
    case GameState.Menu: {
      return "Start Game";
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
    <div>
      {gameText}
    </div>
  )
}
