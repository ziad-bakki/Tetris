import { Button } from "@/components/ui/button";
import { Color, GridCell, Piece } from "../interfaces/interfaces";
import { moveLeft, moveRight, drawPiece, moveDown, generateRandomPiece, hardDrop, rotateRight } from "../context/gamecontext";
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

  const handleRotate = () => {
    const { grid: newGrid, piece: newPiece, position: newPosition } = rotateRight(grid, piece, position);
    setGrid(newGrid);
    setPiece(newPiece);
    setPosition(newPosition);
  }

  const handleDrop = () => {
    const { grid: newGrid, position: newPosition, placed } = hardDrop(grid, piece, position);
    handleDraw(newGrid);
  }

  const handleDraw = (theGrid = grid) => {
    const newPiece = generateRandomPiece();
    const newPosition = SPAWN_POSITION;
    const newGrid = drawPiece(theGrid, newPiece, newPosition);
    setPiece(newPiece);
    setPosition(newPosition);
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-row justify-center gap-1">
      <Button variant="destructive" onClick={() => handleDraw(grid)}>Start</Button>
      <Button onClick={handleMoveLeft}><ArrowLeft /></Button>
      <Button onClick={handleMoveRight}><ArrowRight /></Button>
      <Button onClick={handleMoveDown}><ArrowDown /></Button>
      <Button onClick={handleDrop}>Drop</Button>
      <Button onClick={handleRotate}>Rotate</Button>


    </div>
  );
}
