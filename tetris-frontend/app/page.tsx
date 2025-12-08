'use client'
import Game from "./components/game";
import Stats from "./components/stats";

export default function Home() {
  return (
    <>
      <div className="text-2xl text-center p-5">
        Tetris Game
      </div>
      <div className="flex justify-center align-middle flex-col items-center">
        <Game />
      </div>

    </>
  );
}
