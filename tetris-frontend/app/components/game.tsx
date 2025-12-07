import { useState } from "react";
import { makeGrid } from "../context/gamecontext";
import Grid from "./grid";
import { Controls } from "./controls";
export default function Game() {
  const [grid, setGrid] = useState(makeGrid());
  return (

    <div className="w-[25vw] h-[50vw] border-2 m-5">
      <Grid grid={grid} setGrid={setGrid} />
      <Controls grid={grid} setGrid={setGrid} />
    </div>

  )
}
