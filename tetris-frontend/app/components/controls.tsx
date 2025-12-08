import { Button } from "@/components/ui/button";
import { Color, GameObject, GameState, GridCell, Piece } from "../interfaces/interfaces";
import { moveLeft, moveRight, drawPiece, moveDown, generateRandomPiece, hardDrop, rotateRight, makeGrid } from "../context/gamecontext";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, RefreshCcw } from "lucide-react";
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
  resetTimer: () => void;
  game: GameObject;
  setGame: (game: GameObject) => void;
}

export function Controls({ grid, setGrid, piece, setPiece, position, setPosition, resetTimer, game, setGame }: ControlsProps) {
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

  const handleStart = () => {
    handleDraw();
    resetTimer();
  }

  const PauseButton = game.state === GameState.Running ? (<Pause />) : (<Play />);

  const handlePause = () => {
    if (game.state === GameState.Running) {
      setGame({ ...game, state: GameState.Paused });
    } else {
      setGame({ ...game, state: GameState.Running });
    }
  }


  return (
    <div className="flex flex-row justify-center gap-1">
      <Button variant="destructive" onClick={handleStart}>Start</Button>
      <Button onClick={handlePause}>{PauseButton}</Button>
      <Button><RefreshCcw /></Button>
    </div>
  );
}
