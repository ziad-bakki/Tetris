import { useEffect } from "react";
import { GridCell, Piece, Position } from "../interfaces/interfaces";
import { drawPiece, generateRandomPiece, hardDrop, moveDown, moveLeft, moveRight, rotateRight } from "./gamecontext";
import { SPAWN_POSITION } from "../consts/consts";

interface KeyboardProps {
  grid: GridCell[][];
  setGrid: (grid: GridCell[][]) => void;
  piece: Piece;
  setPiece: (piece: Piece) => void;
  position: Position;
  setPosition: (position: Position) => void;
}

export function useKeyboardControls({
  grid,
  setGrid,
  piece,
  setPiece,
  position,
  setPosition,
}: KeyboardProps): KeyboardProps {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft": {
          const result = moveLeft(grid, piece, position);
          setGrid(result.grid);
          setPosition(result.position);
          break;
        }
        case "ArrowRight": {
          const result = moveRight(grid, piece, position);
          setGrid(result.grid);
          setPosition(result.position);
          break;
        }
        case "ArrowDown": {
          const result = moveDown(grid, piece, position);
          setGrid(result.grid);
          if (result.placed) {
            const newPiece = generateRandomPiece();
            const newGrid = drawPiece(result.grid, newPiece, SPAWN_POSITION);
            setPiece(newPiece);
            setPosition(SPAWN_POSITION);
            setGrid(newGrid);
          } else {
            setPosition(result.position);
          }
          break;
        }
        case "ArrowUp": {
          const result = rotateRight(grid, piece, position);
          setGrid(result.grid);
          setPosition(result.position);
          setPiece(result.piece);
          break;
        }
        case " ": {
          event.preventDefault();
          const result = hardDrop(grid, piece, position);
          const newPiece = generateRandomPiece();
          const newGrid = drawPiece(result.grid, newPiece, SPAWN_POSITION);
          setPiece(newPiece);
          setPosition(SPAWN_POSITION);
          setGrid(newGrid);
          break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [grid, piece, position, setGrid, setPiece, setPosition])


}
