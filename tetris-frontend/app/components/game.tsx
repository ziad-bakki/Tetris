import { useState, useCallback, useRef, useEffect } from "react";
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
  const tickCounterRef = useRef(0);
  const gameObjectRef = useRef(gameObject);
  const positionRef = useRef(position);

  // Reset tick counter when game state changes
  useEffect(() => {
    tickCounterRef.current = 0;
  }, [gameObject.state]);

  useEffect(() => {
    gameObjectRef.current = gameObject;
  }, [gameObject]);
  
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const handleTimerTick = useCallback(() => {
    tickCounterRef.current += 1;

    // Only move piece down every 5 ticks
    if (tickCounterRef.current % 5 !== 0) return;

    const currentGame = gameObjectRef.current;
    const currentPosition = positionRef.current;

    if (!currentGame.currentPiece) return;


    const result  = moveDown(currentGame.grid, currentGame.currentPiece, currentPosition);
    if (result.placed) {
      const nextPiece = currentGame.nextPieces[0];
      const remainingPieces = currentGame.nextPieces.slice(1);
      const newNextPieces = [...remainingPieces, generateRandomPiece()];
      const newGrid = drawPiece( result.grid, nextPiece, SPAWN_POSITION )
      setGameObject({ ...currentGame, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid});
      setPosition(SPAWN_POSITION);
    } else {
      setGameObject({ ...currentGame, grid: result.grid });
      setPosition(result.position);
    }
  } , []);

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
    <Stats game={gameObject} elapsedTime={elapsedTime} />
    </div>
  </div>
  )
}
