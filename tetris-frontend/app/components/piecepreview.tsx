import { useEffect, useRef } from "react";
import { GridCell, Piece } from "../interfaces/interfaces";
import { PIECE_SHAPES } from "../consts/piececonsts";

interface PiecePreviewProps {
  piece: Piece;
}

export function PiecePreview({ piece }: PiecePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    const drawGrid = () => {
      canvas.height = container.clientHeight;
      canvas.width = container.clientWidth;

      const COLS = 4;
      const ROWS = 4;
      const cellWidth = canvas.width / COLS;
      const cellHeight = canvas.height / ROWS;

      // Create empty grid
      const grid: GridCell[][] = Array(ROWS)
        .fill(null)
        .map(() =>
          Array(COLS)
            .fill(null)
            .map(() => ({ occupied: false, currentPiece: false }))
        );

      // Draw piece in the grid
      const shape = PIECE_SHAPES[piece.type][piece.rotation];
      for (const offset of shape) {
        const row = 0 + offset.row;
        const col = 0 + offset.col;
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
          grid[row][col] = { occupied: true, currentPiece: true, color: piece.color };
        }
      }

      // Draw cells
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
  }, [piece]);

  return <canvas ref={canvasRef} />;
}
