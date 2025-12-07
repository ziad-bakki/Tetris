import { Button } from "@/components/ui/button";
import { Color, GridCell, Piece } from "../interfaces/interfaces";
import { moveLeft, moveRight, drawPiece, moveDown, generateRandomPiece } from "../context/gamecontext";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { PieceType } from "../interfaces/interfaces";
import { Position } from "../interfaces/interfaces";
import { SPAWN_POSITION } from "../consts/consts";

interface ControlsProps {
  grid: GridCell[][];
  setGrid: (grid: GridCell[][]) => void;
  piece: Piece;
  setPiece: (piece: Piece) => void;
  position: Position;
  setPosition: (position: Position) => void;
}

export function Controls({ grid, setGrid, piece, setPiece, position, setPosition }: ControlsProps) {
  const handleMoveLeft = () => {
    const { grid: newGrid, position: newPosition } = moveLeft(grid, piece, position);
    setGrid(newGrid);
    setPosition(newPosition);
  };

  const handleMoveRight = () => {
    const { grid: newGrid, position: newPosition } = moveRight(grid, piece, position);
    setGrid(newGrid);
    setPosition(newPosition);
  };

  const handleMoveDown = () => {
    const { grid: newGrid, position: newPosition, placed } = moveDown(grid, piece, position);
    setGrid(newGrid);

    if (placed) {
      const newPiece = generateRandomPiece();
      const spawnPosition = SPAWN_POSITION;
      const gridWithNewPiece = drawPiece(newGrid, newPiece, spawnPosition);
      setPiece(newPiece);
      setPosition(spawnPosition);
      setGrid(gridWithNewPiece);
    } else {
      setPosition(newPosition);
    }
  }

  const handleDraw = () => {
    const newPiece = generateRandomPiece();
    const newPosition = SPAWN_POSITION;
    const newGrid = drawPiece(grid, newPiece, newPosition);
    setPiece(newPiece);
    setPosition(newPosition);
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-row justify-center gap-1">
      <Button onClick={handleMoveLeft}><ArrowLeft /></Button>
      <Button className="align-middle" onClick={handleDraw}>draw</Button>
      <Button onClick={handleMoveRight}><ArrowRight /></Button>
      <Button onClick={handleMoveDown}><ArrowDown /></Button>
    </div>
  );
}
