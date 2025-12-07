import { SPAWN_POSITION } from "../consts/consts";
import { PIECE_SHAPES } from "../consts/piececonsts";
import { Color, GridCell, Piece, Position } from "../interfaces/interfaces";

export function makeGrid(): GridCell[][] {
  const cols = 10;
  const rows = 20;
  const grid: GridCell[][] = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      const cell: GridCell = { occupied: false, currentPiece: false }
      grid[i].push(cell);
    }
  }

  return grid;
}


export function drawPiece(grid: GridCell[][], piece: Piece) {
  const position = SPAWN_POSITION;
  const newGrid = grid.map(row => [...row]);
  const shape = PIECE_SHAPES[piece.type][piece.rotation];

  // Draw all 4 cells of the piece
  shape.forEach(offset => {
    const actualRow = position.row + offset.row;
    const actualCol = position.col + offset.col;

    if (actualRow >= 0 && actualRow < grid.length && actualCol >= 0 && actualCol < grid[0].length) {
      newGrid[actualRow][actualCol].currentPiece = true;
      newGrid[actualRow][actualCol].color = piece.color;
      newGrid[actualRow][actualCol].occupied = true;
    }
  });

  return newGrid;
}

function getCurrentPosition(grid: GridCell[][]) {
  let position: Position = { row: -1, col: -1 };
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.currentPiece) {
        position = { row: y, col: x };
      }
    });
  });
  return position;
}

export function moveRight(grid: GridCell[][], piece: Piece, position: Position) {
  const newGrid = grid.map(row => [...row]);
  const shape = PIECE_SHAPES[piece.type][piece.rotation];
  const newPosition = { ...position, col: position.col + 1 };

  // Check bounds and collisions
  for (const offset of shape) {
    const actualRow = newPosition.row + offset.row;
    const actualCol = newPosition.col + offset.col;

    // Out of bounds
    if (actualCol >= grid[0].length) {
      return { grid, position }; // Can't move
    }

    // Collision with occupied cell
    if (grid[actualRow][actualCol].occupied && !grid[actualRow][actualCol].currentPiece) {
      return { grid, position }; // Can't move
    }
  }

  // Clear old piece
  for (const offset of shape) {
    const actualRow = position.row + offset.row;
    const actualCol = position.col + offset.col;
    if (actualRow >= 0 && actualCol >= 0) {
      newGrid[actualRow][actualCol].currentPiece = false;
      newGrid[actualRow][actualCol].occupied = false;
      newGrid[actualRow][actualCol].color = Color.Black;
    }
  }

  // Draw piece at new position
  for (const offset of shape) {
    const actualRow = newPosition.row + offset.row;
    const actualCol = newPosition.col + offset.col;
    newGrid[actualRow][actualCol].currentPiece = true;
    newGrid[actualRow][actualCol].occupied = true;
    newGrid[actualRow][actualCol].color = piece.color;
  }

  return { grid: newGrid, position: newPosition };
}


export function moveLeft(grid: GridCell[][], piece: Piece, position: Position) {
  const newGrid = grid.map(row => [...row]);
  const shape = PIECE_SHAPES[piece.type][piece.rotation];
  const newPosition = { ...position, col: position.col - 1 };

  // Check bounds and collisions
  for (const offset of shape) {
    const actualRow = newPosition.row + offset.row;
    const actualCol = newPosition.col + offset.col;
    console.log(`Actual Row: ${actualRow}`)
    console.log(`Actual Col: ${actualCol}`)

    // Out of bounds
    if (actualCol < 0) {
      return { grid, position }; // Can't move
    }

    // Collision with occupied cell
    if (grid[actualRow][actualCol].occupied && !grid[actualRow][actualCol].currentPiece) {
      return { grid, position }; // Can't move
    }

  }

  // Clear old piece
  for (const offset of shape) {
    const actualRow = position.row + offset.row;
    const actualCol = position.col + offset.col;
    if (actualRow >= 0 && actualCol >= 0) {
      newGrid[actualRow][actualCol].currentPiece = false;
      newGrid[actualRow][actualCol].occupied = false;
      newGrid[actualRow][actualCol].color = Color.Black;
    }
  }

  // Draw piece at new position
  for (const offset of shape) {
    const actualRow = newPosition.row + offset.row;
    const actualCol = newPosition.col + offset.col;
    newGrid[actualRow][actualCol].currentPiece = true;
    newGrid[actualRow][actualCol].occupied = true;
    newGrid[actualRow][actualCol].color = piece.color;
  }

  return { grid: newGrid, position: newPosition };
}
