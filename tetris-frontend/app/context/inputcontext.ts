import { useEffect } from "react";
import { GameObject, GridCell, Position } from "../interfaces/interfaces";
import { drawPiece, generateRandomPiece, hardDrop, holdPiece, moveDown, moveLeft, moveRight, rotateRight } from "./gamecontext";
import { SPAWN_POSITION } from "../consts/consts";

interface KeyboardProps {
  grid: GridCell[][];
  setGrid: (grid: GridCell[][]) => void;
  position: Position;
  setPosition: (position: Position) => void;
  game: GameObject;
  setGame: (game: GameObject) => void;
}

export function useKeyboardControls({
  grid,
  setGrid,
  position,
  setPosition,
  game,
  setGame,
}: KeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft": {
          const result = moveLeft(grid, game.currentPiece, position);
          setGrid(result.grid);
          setPosition(result.position);
          break;
        }
        case "ArrowRight": {
          const result = moveRight(grid, game.currentPiece, position);
          setGrid(result.grid);
          setPosition(result.position);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          const result = moveDown(grid, game.currentPiece, position);

          if (result.placed) {
            const nextPiece = game.nextPieces[0];
            const remainingPieces = game.nextPieces.slice(1);
            const newNextPieces = [...remainingPieces, generateRandomPiece()];
            const newGrid = drawPiece(result.grid, nextPiece, SPAWN_POSITION);
            setGame({ ...game, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid });
            setPosition(SPAWN_POSITION);
          } else {
            setGrid(result.grid);
            setPosition(result.position);
          }
          break;
        }
        case "ArrowUp": {
          const result = rotateRight(grid, game.currentPiece, position);
          setGame({ ...game, currentPiece: result.piece, grid: result.grid });
          setPosition(result.position);
          break;
        }
        case "c": {
          event.preventDefault();
          const newGame = holdPiece(game, position);
          const newGrid = drawPiece(newGame.grid, newGame.currentPiece, SPAWN_POSITION);
          setPosition(SPAWN_POSITION);
          setGrid(newGrid);
          setGame(newGame);
          break;
        }
        case " ": {
          event.preventDefault();
          const result = hardDrop(grid, game.currentPiece, position);
          const nextPiece = game.nextPieces[0];
          const remainingPieces = game.nextPieces.slice(1);
          const newNextPieces = [...remainingPieces, generateRandomPiece()];
          const newGrid = drawPiece(result.grid, nextPiece, SPAWN_POSITION);
          setGame({ ...game, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid });
          setPosition(SPAWN_POSITION);
          break;
        }
        case "Enter": {
          event.preventDefault();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [grid, position, setGrid, setPosition, game, setGame])


}
