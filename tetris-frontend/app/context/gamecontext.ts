import { watch } from "fs/promises";
import { DEFAULT_GAME_OBJECT, SPAWN_POSITION } from "../consts/consts";
import { PIECE_SHAPES } from "../consts/piececonsts";
import { Color, GameObject, GridCell, Piece, PieceType, Position, Rotation } from "../interfaces/interfaces";

export function makeGrid(): GridCell[][] {
  const cols = 10;
  const rows = 20;
  const grid: GridCell[][] = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      const cell: GridCell = { occupied: false, currentPiece: false, color: Color.Black }
      grid[i].push(cell);
    }
  }

  return grid;
}

export function generateRandomPiece(): Piece {
  const pieceTypes: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const randomPiece = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
  const piece: Piece = {
    type: randomPiece,
    rotation: 0,
    color: Color[randomPiece]
  };

  return piece;
}

export function generateNextPieces(count: number): Piece[] {
  return Array.from({ length: count }, () => generateRandomPiece());
}

function clearPiece(grid: GridCell[][], piece: Piece, position: Position) {
  const newGrid = grid.map(row => [...row]);
  const shape = PIECE_SHAPES[piece.type][piece.rotation];

  for (const offset of shape) {
    const actualRow = position.row + offset.row;
    const actualCol = position.col + offset.col;
    if (actualRow >= 0 && actualCol >= 0) {
      newGrid[actualRow][actualCol].currentPiece = false;
      newGrid[actualRow][actualCol].occupied = false;
      newGrid[actualRow][actualCol].color = Color.Black;
    }
  }

  return newGrid;
}



export function drawPiece(grid: GridCell[][], piece: Piece, position: Position) {
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


export function moveRight(grid: GridCell[][], piece: Piece, position: Position) {
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
  const newGrid = clearPiece(grid, piece, position);

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
  const shape = PIECE_SHAPES[piece.type][piece.rotation];
  const newPosition = { ...position, col: position.col - 1 };

  // Check bounds and collisions
  for (const offset of shape) {
    const actualRow = newPosition.row + offset.row;
    const actualCol = newPosition.col + offset.col;

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
  const newGrid = clearPiece(grid, piece, position);

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

export function rotateRight(grid: GridCell[][], piece: Piece, position: Position) {
  const newRotation = (piece.rotation + 1) % 4 as Rotation;
  const newShape = PIECE_SHAPES[piece.type][newRotation];
  for (const offset of newShape) {
    const actualRow = position.row + offset.row;
    const actualCol = position.col + offset.col;

    if (actualRow < 0 || actualRow >= grid.length || actualCol < 0 || actualCol >= grid[0].length) {
      return { grid, piece, position };
    }

    if (grid[actualRow][actualCol].occupied && !grid[actualRow][actualCol].currentPiece) {
      return { grid, piece, position };
    }
  }

  const newPiece = { ...piece, rotation: newRotation };
  const clearedGrid = clearPiece(grid, piece, position);
  const newGrid = drawPiece(clearedGrid, newPiece, position);
  return { grid: newGrid, piece: newPiece, position }
}

function canMoveDown(grid: GridCell[][], piece: Piece, position: Position): boolean {
  const shape = PIECE_SHAPES[piece.type][piece.rotation];
  const newPosition = { ...position, row: position.row + 1 };
  for (const offset of shape) {
    const actualRow = newPosition.row + offset.row;
    const actualCol = newPosition.col + offset.col;

    if (actualRow >= grid.length) {
      return false;
    }

    if (grid[actualRow][actualCol].occupied && !grid[actualRow][actualCol].currentPiece) {
      return false;
    }
  }
  return true;
}

export function moveDown(grid: GridCell[][], piece: Piece, position: Position) {
  if (!canMoveDown(grid, piece, position)) {
    const { grid: newGrid, linesCleared } = place(grid, piece, position);
    return { grid: newGrid, position, placed: true, linesCleared }
  }
  const newPosition = { ...position, row: position.row + 1 };
  const clearedGrid = clearPiece(grid, piece, position);
  const newGrid = drawPiece(clearedGrid, piece, newPosition);

  return { grid: newGrid, position: newPosition, placed: false, linesCleared: 0 }
}

function place(grid: GridCell[][], piece: Piece, position: Position) {
  const newGrid = grid.map(row => [...row]);
  const shape = PIECE_SHAPES[piece.type][piece.rotation];

  for (const offset of shape) {
    const actualRow = position.row + offset.row;
    const actualCol = position.col + offset.col;
    newGrid[actualRow][actualCol].currentPiece = false;
    newGrid[actualRow][actualCol].occupied = true;
    newGrid[actualRow][actualCol].color = piece.color;
  }
  const { grid: clearedGrid, linesCleared } = clearLines(newGrid);
  return { grid: clearedGrid, linesCleared }
}

function findLandingPosition(grid: GridCell[][], piece: Piece, position: Position) {
  let landingPosition = { ...position };

  while (canMoveDown(grid, piece, landingPosition)) {
    landingPosition = { ...landingPosition, row: landingPosition.row + 1 };
  }

  return landingPosition;

}

export function hardDrop(grid: GridCell[][], piece: Piece, position: Position) {
  const landingPosition = findLandingPosition(grid, piece, position);

  const clearedGrid = clearPiece(grid, piece, position);

  const { grid: newGrid, linesCleared } = place(clearedGrid, piece, landingPosition);

  return { grid: newGrid, position: landingPosition, placed: true, linesCleared }
}


export function clearLines(grid: GridCell[][]) {
  const newGrid = grid.filter(row => !row.every(cell => cell.occupied));
  const linesCleared = grid.length - newGrid.length;
  while (newGrid.length < 20) {
    const emptyRow: GridCell[] = [];
    for (let j = 0; j < 10; j++) {
      emptyRow.push({ occupied: false, currentPiece: false });
    }
    newGrid.unshift(emptyRow);
  }

  return { grid: newGrid, linesCleared };
}

export function holdPiece(game: GameObject, position: Position): GameObject {
  if (!game.currentPiece) {
    return game; // No current piece to hold
  }
  const newGrid = clearPiece(game.grid, game.currentPiece, position);

  const pieceToHold: Piece = {
    ...game.currentPiece,
    rotation: 0,
  }

  if (!game.heldPiece) {
    // First hold: move next piece to current
    const nextPiece = game.nextPieces[0];
    const remainingPieces = game.nextPieces.slice(1);
    const newNextPieces = [...remainingPieces, generateRandomPiece()];

    return {
      ...game,
      grid: newGrid,
      heldPiece: pieceToHold,
      currentPiece: nextPiece,
      nextPieces: newNextPieces,
    };
  } else {
    // Swap current with held piece
    return {
      ...game,
      grid: newGrid,
      currentPiece: { ...game.heldPiece, rotation: 0 },
      heldPiece: pieceToHold,
    };
  }
}