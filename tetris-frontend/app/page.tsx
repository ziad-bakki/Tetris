'use client'
import { Button } from "@/components/ui/button";
import Game from "./components/game";
import NavBar from "./components/navbar";
import Stats from "./components/stats";
import { GetUserByID, GetUsers } from "./context/api";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex justify-center align-middle flex-col items-center">
        <Game />
      </div>
      <div className="flex justify-center align-middle flex-col items-center">
        <Button onClick={GetUserByID} >Log</Button>
      </div>

    </>
  );
}
