import { useState, useCallback } from "react";
import { generateRandomPiece, generateNextPieces, makeGrid, moveDown, drawPiece } from "../context/gamecontext";
import Grid from "./grid";
import { Controls } from "./controls";
import { Color, GameObject, GameState, Piece, Position } from "../interfaces/interfaces";
import { SPAWN_POSITION, DEFAULT_GAME_OBJECT } from "../consts/consts";
import { useKeyboardControls } from "../context/inputcontext";
import { useTimer } from "../context/timecontext";
import Stats from "./stats";
import { PiecePreview } from "./piecepreview";
export default function Game() {
  const [gameObject, setGameObject] = useState<GameObject>(DEFAULT_GAME_OBJECT);
  const [position, setPosition] = useState<Position>(SPAWN_POSITION);

  const handleTimerTick = useCallback((time: number) => {
    let grid = gameObject.grid;
    if ( gameObject.currentPiece) {
      const result  = moveDown(gameObject.grid, gameObject.currentPiece, position);
      if (result.placed) {
        const nextPiece = gameObject.nextPieces[0];
        const remainingPieces = gameObject.nextPieces.slice(1);
        const newNextPieces = [...remainingPieces, generateRandomPiece()];
        const newGrid = drawPiece( result.grid, nextPiece, SPAWN_POSITION )
        grid = newGrid;
        setGameObject({ ...gameObject, nextPieces: newNextPieces, currentPiece: nextPiece, grid: grid});
        setPosition(SPAWN_POSITION);
        return;
      } else {
        grid = result.grid; 
        setGameObject({ ...gameObject, grid: grid });
        setPosition(result.position);
      }
    }
    setGameObject((prev) => ({ ...prev, grid: grid, timeElapsed: time }));
  }, [gameObject, position]);

  const { elapsedTime, resetTimer } = useTimer({
    isRunning: gameObject.state === GameState.Running,
    onTick: handleTimerTick
  });

  useKeyboardControls({
    grid: gameObject.grid,
    setGrid: (grid) => setGameObject({ ...gameObject, grid }),
    position,
    setPosition,
    game: gameObject,
    setGame: setGameObject,
    resetTimer,
  });

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-start w-full">
      <div className="w-[8vw] h-[8vw] right-0">
        {gameObject.heldPiece &&
          <PiecePreview piece={gameObject.heldPiece}/>
        }
      </div>
     <div className="flex flex-col h-[55vw]">
      <div className="w-[22.5vw] h-[45vw] border-2 m-5">
        <Grid grid={gameObject.grid} setGrid={(grid) => setGameObject({ ...gameObject, grid })} />
      </div>
      <Controls
        resetTimer={resetTimer}
        grid={gameObject.grid}
        setPosition={setPosition}
        game={gameObject}
        setGame={setGameObject}
      />
    </div>
    <div className="m-5">
    <Stats game={gameObject} />
    </div>
  </div>
  )
}
