import { useEffect } from "react";
import { GameObject, GameState, GridCell, Position } from "../interfaces/interfaces";
import { canSpawn, drawPiece, generateNextPieces, hardDrop, holdPiece, makeGrid, moveDown, moveLeft, moveRight, rotateRight, Start } from "./gamecontext";
import { SPAWN_POSITION } from "../consts/consts";

interface KeyboardProps {
  grid: GridCell[][];
  setGrid: (grid: GridCell[][]) => void;
  position: Position;
  setPosition: (position: Position) => void;
  game: GameObject;
  setGame: (game: GameObject) => void;
  resetTimer: () => void;
};

export function useKeyboardControls({
  grid,
  setGrid,
  position,
  setPosition,
  game,
  setGame,
  resetTimer,
}: KeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Allow "j" to work anytime to return to menu
      if (event.key === "j") {
        event.preventDefault();
        const newGame = Start(game);
        setGame(newGame);
        setPosition(SPAWN_POSITION);
        resetTimer();
        return;
      }

      if (event.key === "Escape") {
        if (game.state == GameState.Menu) return;
        event.preventDefault();
        const newGrid = makeGrid();
        const nextPieces = generateNextPieces(undefined, 4);
        setGame({
          state: GameState.Menu,
          grid: newGrid,
          nextPieces: nextPieces,
          currentPiece: undefined,
          heldPiece: undefined,
          clearedLines: 0,
        });
        setPosition(SPAWN_POSITION);
        resetTimer();
        return;
      }

      if (game.state !== GameState.Running) return;
      switch (event.key) {
        case "ArrowLeft": {
          if (!game.currentPiece) return;
          const result = moveLeft(grid, game.currentPiece, position);
          setGame({ ...game, grid: result.grid });
          setPosition(result.position);
          break;
        }
        case "ArrowRight": {
          if (!game.currentPiece) return;
          const result = moveRight(grid, game.currentPiece, position);
          setGame({ ...game, grid: result.grid });
          setPosition(result.position);
          break;
        }
        case "ArrowDown": {
          if (!game.currentPiece) return;
          event.preventDefault();
          const result = moveDown(grid, game.currentPiece, position);
          const clearedLines = result.linesCleared + game.clearedLines;
          if (result.placed) {
            const nextPiece = game.nextPieces[0];
            const tempGame: GameObject = { ...game, nextPieces: game.nextPieces.slice(1) };
            const newNextPieces = generateNextPieces(tempGame, 4);
            let state = undefined;
            if (!canSpawn(result.grid, nextPiece, SPAWN_POSITION)) {
              state = GameState.Over;
            }
            else {
              state = game.state;
            }
            const newGrid = drawPiece(result.grid, nextPiece, SPAWN_POSITION);
            setGame({ ...game, state: state, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid, clearedLines });
            setPosition(SPAWN_POSITION);
          } else {
            setGame({ ...game, grid: result.grid, clearedLines });
            setPosition(result.position);
          }
          break;
        }
        case "ArrowUp": {
          if (!game.currentPiece) return;
          const result = rotateRight(grid, game.currentPiece, position);
          setGame({ ...game, currentPiece: result.piece, grid: result.grid });
          setPosition(result.position);
          break;
        }
        case "c": {
          event.preventDefault();
          if (!game.currentPiece) return;
          const newGame = holdPiece(game, position);
          if (!newGame.currentPiece) return;
          const newGrid = drawPiece(newGame.grid, newGame.currentPiece, SPAWN_POSITION);
          setPosition(SPAWN_POSITION);
          setGrid(newGrid);
          setGame(newGame);
          break;
        }
        case " ": {
          if (!game.currentPiece) return;
          event.preventDefault();
          const result = hardDrop(grid, game.currentPiece, position);
          const clearedLines = result.linesCleared + game.clearedLines;
          const nextPiece = game.nextPieces[0];
          const tempGame: GameObject = { ...game, nextPieces: game.nextPieces.slice(1) };
          const newNextPieces = generateNextPieces(tempGame, 4);
          let state = undefined;
          if (!canSpawn(result.grid, nextPiece, SPAWN_POSITION)) {
            state = GameState.Over;
          }
          else {
            state = game.state;
          }
          const newGrid = drawPiece(result.grid, nextPiece, SPAWN_POSITION);
          setGame({ ...game, state: state, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid, clearedLines });
          setPosition(SPAWN_POSITION);
          break;
        }
        case "Enter": {
          event.preventDefault();
          break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, position, setGrid, setPosition, game, setGame, resetTimer]);
}
