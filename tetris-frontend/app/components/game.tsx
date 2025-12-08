import { useState } from "react";
import { generateRandomPiece, makeGrid } from "../context/gamecontext";
import Grid from "./grid";
import { Controls } from "./controls";
import { Color, GameObject, GameState, Piece, Position } from "../interfaces/interfaces";
import { SPAWN_POSITION } from "../consts/consts";
import { useKeyboardControls } from "../context/inputcontext";
import { useTimer } from "../context/timecontext";
import Stats from "./stats";
export default function Game() {
  const [grid, setGrid] = useState(makeGrid());
  const [piece, setPiece] = useState<Piece>(generateRandomPiece());
  const [position, setPosition] = useState<Position>(SPAWN_POSITION);
  const [isRunning, setIsRunning] = useState(true);

  useKeyboardControls({
    grid,
    setGrid,
    piece,
    setPiece,
    position,
    setPosition,
  });

  const {elapsedTime, resetTimer } = useTimer({ isRunning: isRunning });  

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-start w-full">
    <div/>
     <div className="flex flex-col h-[55vw]">
      <div className="w-[22.5vw] h-[45vw] border-2 m-5">
        <Grid grid={grid} setGrid={setGrid} />
      </div>
      <Controls
        resetTimer={resetTimer}
        grid={grid}
        setGrid={setGrid}
        piece={piece}
        setPiece={setPiece}
        position={position}
        setPosition={setPosition}
      />
    </div>
    <div className="m-5">
    <Stats elapsedTime={elapsedTime} />
    </div>
  </div>
  )
}
