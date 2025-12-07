import { useState } from "react";
import { generateRandomPiece, makeGrid } from "../context/gamecontext";
import Grid from "./grid";
import { Controls } from "./controls";
import { Color, GameObject, GameState, Piece, Position } from "../interfaces/interfaces";
import { SPAWN_POSITION } from "../consts/consts";
import { useKeyboardControls } from "../context/inputcontext";
export default function Game() {
  const [grid, setGrid] = useState(makeGrid());
  const [piece, setPiece] = useState<Piece>(generateRandomPiece());
  const [position, setPosition] = useState<Position>(SPAWN_POSITION);

  useKeyboardControls({
    grid,
    setGrid,
    piece,
    setPiece,
    position,
    setPosition,
  });

  return (
    <div
      className="flex flex-col h-[55vw]"
    >
      <div className="w-[22.5vw] h-[45vw] border-2 m-5">
        <Grid grid={grid} setGrid={setGrid} />
      </div>
      <Controls
        grid={grid}
        setGrid={setGrid}
        piece={piece}
        setPiece={setPiece}
        position={position}
        setPosition={setPosition}
      />
    </div>
  )
}
