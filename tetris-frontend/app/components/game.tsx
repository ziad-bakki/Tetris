import { useState, useCallback, useRef, useEffect, ReactElement } from "react";
import { generateNextPieces, makeGrid, moveDown, drawPiece, canSpawn, DEFAULT_GAME_OBJECT } from "../context/gamecontext";
import Grid from "./grid";
import { Controls } from "./controls";
import { Color, GameObject, GameState, Piece, Position } from "../interfaces/interfaces";
import { SPAWN_POSITION, } from "../consts/consts";

import { useKeyboardControls } from "../context/inputcontext";
import { useTimer } from "../context/timecontext";
import Stats from "./stats";
import { PiecePreview } from "./piecepreview";
import GameText from "./gametext";
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

    setGameObject((currentGame) => {
      const currentPosition = positionRef.current;
      if (!currentGame.currentPiece) return currentGame;

      const result = moveDown(currentGame.grid, currentGame.currentPiece, currentPosition);
      const clearedLines = result.linesCleared + currentGame.clearedLines;
      if (result.placed) {
        const nextPiece = currentGame.nextPieces[0];
        const tempGame: GameObject = { ...currentGame, nextPieces: currentGame.nextPieces.slice(1) };
        const newNextPieces = generateNextPieces(tempGame, 4);
        let state = undefined;
        if (!canSpawn(result.grid, nextPiece, SPAWN_POSITION)) {
          state = GameState.Over;
        }
        else {
          state = currentGame.state;
        }
        const newGrid = drawPiece(result.grid, nextPiece, SPAWN_POSITION);
        setPosition(SPAWN_POSITION);
        return { ...currentGame, state: state, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid, clearedLines };
      } else {
        setPosition(result.position);
        return { ...currentGame, grid: result.grid, clearedLines };
      }
    });
  }, []);

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

  const gameText: ReactElement = (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
      <GameText game={gameObject} setGame={setGameObject} />
    </div>
  );

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-start w-full">
      <div className="w-[8vw] h-[8vw] right-0">
        {gameObject.heldPiece &&
          <PiecePreview piece={gameObject.heldPiece} />
        }
      </div>
      <div className="flex flex-col h-[55vw]">
        <div className="relative w-[22.5vw] h-[45vw] border-2 m-5">
          <Grid grid={gameObject.grid} setGrid={(grid) => setGameObject({ ...gameObject, grid })} />
          {!(gameObject.state === GameState.Running) && gameText}
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
