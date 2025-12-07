import { useEffect, useRef } from "react";
import { GridCell } from "../interfaces/interfaces";

interface GridProps {
  grid: GridCell[][];
  setGrid: (grid: GridCell[][]) => void;
}
export default function Grid({ grid, setGrid }: GridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) { return; }

    const ctx = canvas.getContext('2d');
    if (!ctx) { return; }

    const container = canvas.parentElement;
    if (!container) return;
    const drawGrid = () => {
      canvas.height = container.clientHeight;
      canvas.width = container.clientWidth;

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
    };

    drawGrid();

    const handleResize = () => {
      drawGrid();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [grid])

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
}
