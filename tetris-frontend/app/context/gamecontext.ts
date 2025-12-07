import { GridCell } from "../interfaces/interfaces";

export function makeGrid(): GridCell[][] {
  const cols = 10;
  const rows = 20;
  const grid: GridCell[][] = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      const cell: GridCell = { occuppied: true }
      grid[i].push(cell);
    }
  }

  return grid;
}


