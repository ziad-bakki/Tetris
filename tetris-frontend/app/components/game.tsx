import { useState } from "react";
import { generateRandomPiece, generateNextPieces, makeGrid } from "../context/gamecontext";
import Grid from "./grid";
import { Controls } from "./controls";
import { Color, GameObject, GameState, Piece, Position } from "../interfaces/interfaces";
import { SPAWN_POSITION } from "../consts/consts";
import { useKeyboardControls } from "../context/inputcontext";
import { useTimer } from "../context/timecontext";
import Stats from "./stats";
export default function Game() {
  const [gameObject, setGameObject] = useState<GameObject>({
    state: GameState.Running,
    timeElapsed: 0,
    grid: makeGrid(),
    nextPieces: generateNextPieces(4),
    currentPiece: generateRandomPiece(),
  });
  const [piece, setPiece] = useState<Piece>(generateRandomPiece());
  const [position, setPosition] = useState<Position>(SPAWN_POSITION);

  useKeyboardControls({
    grid: gameObject.grid,
    setGrid: (grid) => setGameObject({ ...gameObject, grid }),
    piece,
    setPiece,
    position,
    setPosition,
  });

  const { elapsedTime, resetTimer } = useTimer({
    isRunning: gameObject.state === GameState.Running,
    onTick: (time) => setGameObject({ ...gameObject, timeElapsed: time })
  });  

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-start w-full">
    <div/>
     <div className="flex flex-col h-[55vw]">
      <div className="w-[22.5vw] h-[45vw] border-2 m-5">
        <Grid grid={gameObject.grid} setGrid={(grid) => setGameObject({ ...gameObject, grid })} />
      </div>
      <Controls
        resetTimer={resetTimer}
        grid={gameObject.grid}
        setGrid={(grid) => setGameObject({ ...gameObject, grid })}
        piece={piece}
        setPiece={setPiece}
        position={position}
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
