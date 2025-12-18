'use client'
import Game from "./components/game";
import NavBar from "./components/navbar";
import Stats from "./components/stats";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex justify-center align-middle flex-col items-center">
        <Game />
      </div>

    </>
  );
}
