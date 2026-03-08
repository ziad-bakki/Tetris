'use client'
import { Button } from "@/components/ui/button";
import Game from "./components/game";
import NavBar from "./components/navbar";
import Stats from "./components/stats";
import { GetUserByID, GetUsers } from "./context/api";

export default function Home() {
  return (
    <>
      <div className="flex justify-center align-middle flex-col items-center">
        <Game />
      </div>
    </>
  );
}
