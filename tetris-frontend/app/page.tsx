'use client'

import { useEffect, useRef, useState } from "react";
import { makeGrid } from "./context/gamecontext";

export default function Home() {
  const [grid, setGrid] = useState(makeGrid());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) { return; }

    const ctx = canvas.getContext('2d');
    if (!ctx) { return; }

    const container = canvas.parentElement;
    if (container) {
      canvas.height = container.clientHeight;
      canvas.width = container.clientWidth;
    }

    const COLS = 10;
    const ROWS = 20;
    const cellWidth = canvas.width / COLS;
    const cellHeight = canvas.height / ROWS;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * cellWidth;
        const y = row * cellHeight;

        ctx.fillStyle = grid[row][col].color || '#000';
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }
  }, [grid])
  return (
    <>
      <div className="text-2xl text-center p-5">
        Tetris Game
      </div>
      <div className="flex justify-center align-middle">
        <div className="w-[25vw] h-[50vw] border-2">
          <canvas ref={canvasRef}>

          </canvas>

        </div>
      </div>

    </>
  );
}
