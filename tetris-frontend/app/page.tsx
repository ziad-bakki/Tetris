'use client'

import Game from "./components/game";
import Grid from "./components/grid";
import { testDraw } from "./context/gamecontext";

export default function Home() {
  return (
    <>
      <div className="text-2xl text-center p-5">
        Tetris Game
      </div>
      <div className="flex justify-center align-middle">
        <Game />
      </div>

    </>
  );
}
