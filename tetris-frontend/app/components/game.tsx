import { useState } from "react";
import { makeGrid } from "../context/gamecontext";
import Grid from "./grid";
import { Controls } from "./controls";
import { Color, GameObject, GameState, Piece, Position } from "../interfaces/interfaces";
import { SPAWN_POSITION } from "../consts/consts";
export default function Game() {
  const [grid, setGrid] = useState(makeGrid());
  const [piece, setPiece] = useState<Piece>({
    type: 'T',
    rotation: 0,
    cells: [],
    color: Color.T,
  });
  const [position, setPosition] = useState<Position>(SPAWN_POSITION);

  // const Game: GameObject = { state: GameState.Running, timeElapsed: 0, grid: grid };

  return (
    <div className="flex flex-col h-[55vw]">
      <div className="w-[22.5vw] h-[45vw] border-2 m-5">
        <Grid grid={grid} setGrid={setGrid} />
      </div>
      <Controls
        grid={grid}
        setGrid={setGrid}
        piece={piece}
        position={position}
        setPosition={setPosition}
      />
    </div>
  )
}
