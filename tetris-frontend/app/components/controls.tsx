import { Button } from "@/components/ui/button";
import { Color, GridCell, Piece } from "../interfaces/interfaces";
import { moveLeft, moveRight, drawPiece } from "../context/gamecontext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PieceType } from "../interfaces/interfaces";
import { Position } from "../interfaces/interfaces";

interface ControlsProps {
  grid: GridCell[][];
  setGrid: (grid: GridCell[][]) => void;
  piece: Piece;
  position: Position;
  setPosition: (position: Position) => void;
}

export function Controls({ grid, setGrid, piece, position, setPosition }: ControlsProps) {
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

  const handleDraw = () => {
    const newGrid = drawPiece(grid, piece);
    setGrid(newGrid);
  };
  const newPiece: Piece = {
    type: 'T',
    rotation: 0,
    cells: [],
    color: Color.Purple,
  };
  return (
    <div className="flex flex-row justify-center gap-1">
      <Button onClick={handleMoveLeft}><ArrowLeft /></Button>
      <Button className="align-middle" onClick={handleDraw}>draw</Button>
      <Button onClick={handleMoveRight}><ArrowRight /></Button>
    </div>
  );
}
