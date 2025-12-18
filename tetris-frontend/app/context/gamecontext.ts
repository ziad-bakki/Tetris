import { SPAWN_POSITION } from "../consts/consts";
import { PIECE_SHAPES } from "../consts/piececonsts";
import { Color, GameObject, GameState, GridCell, Piece, PieceType, Position, Rotation } from "../interfaces/interfaces";

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


export function generateNextPieces(game: GameObject | undefined, count: number): { nextPieces: Piece[], pieceBag: PieceType[] } {
  const pieceTypes: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const newPieces: Piece[] = game ? [...game.nextPieces] : [];
  let currentBag: PieceType[] = game ? [...game.pieceBag] : [];

  const shuffle = (arr: PieceType[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Fill nextPieces to reach count, using shuffle bag properly
  while (newPieces.length < count) {
    // If bag is empty, create a new shuffled bag
    if (currentBag.length === 0) {
      currentBag = shuffle([...pieceTypes]);
    }

    // Take the first piece from the bag
    const pieceType = currentBag.shift()!;
    newPieces.push({
      type: pieceType,
      rotation: 0,
      color: Color[pieceType],
    });
  }

  return { nextPieces: newPieces, pieceBag: currentBag };
}

const initialPieces = generateNextPieces(undefined, 4);

export const DEFAULT_GAME_OBJECT: GameObject = {
  state: GameState.Menu,
  grid: makeGrid(),
  clearedLines: 0,
  nextPieces: initialPieces.nextPieces,
  currentPiece: undefined,
  heldPiece: undefined,
  pieceBag: initialPieces.pieceBag,
}

function clearPiece(grid: GridCell[][], piece: Piece, position: Position) {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const shape = PIECE_SHAPES[piece.type][piece.rotation];
  const landingPos = findLandingPosition(newGrid, piece, position);

  for (const offset of shape) {
    const actualRow = position.row + offset.row;
    const actualCol = position.col + offset.col;
    if (actualRow >= 0 && actualCol >= 0) {
      newGrid[actualRow][actualCol].currentPiece = false;
      newGrid[actualRow][actualCol].occupied = false;
      newGrid[actualRow][actualCol].color = Color.Black;
    }

    const landingRow = landingPos.row + offset.row;
    const landingCol = landingPos.col + offset.col;
    if (landingRow >= 0 && landingCol >= 0) {
      newGrid[landingRow][landingCol].currentPiece = false;
      newGrid[landingRow][landingCol].occupied = false;
      newGrid[landingRow][landingCol].color = Color.Black;
    }
  }

  return newGrid;
}



export function drawPiece(grid: GridCell[][], piece: Piece, position: Position) {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const shape = PIECE_SHAPES[piece.type][piece.rotation];
  const landingPos: Position = findLandingPosition(newGrid, piece, position);

  // Draw all 4 cells of the piece
  shape.forEach(offset => {
    const actualRow = position.row + offset.row;
    const actualCol = position.col + offset.col;
    const landingRow = landingPos.row + offset.row;
    const landingCol = landingPos.col + offset.col;

    if (actualRow >= 0 && actualRow < grid.length && actualCol >= 0 && actualCol < grid[0].length) {
      newGrid[actualRow][actualCol].currentPiece = true;
      newGrid[actualRow][actualCol].color = piece.color;
      newGrid[actualRow][actualCol].occupied = true;
    }
    if (landingRow >= 0 && landingRow < grid.length && landingCol >= 0 && landingCol < grid[0].length) {
      newGrid[landingRow][landingCol].currentPiece = false;
      newGrid[landingRow][landingCol].color = piece.color + "80" as Color;
      newGrid[landingRow][landingCol].occupied = false;
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

  // Clear old piece and draw at new position
  const clearedGrid = clearPiece(grid, piece, position);
  const newGrid = drawPiece(clearedGrid, piece, newPosition);

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

  // Clear old piece and draw at new position
  const clearedGrid = clearPiece(grid, piece, position);
  const newGrid = drawPiece(clearedGrid, piece, newPosition);

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
      emptyRow.push({ occupied: false, currentPiece: false, color: Color.Black });
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
    const currentPiece = game.nextPieces[0];
    const tempGame: GameObject = { ...game, nextPieces: game.nextPieces.slice(1) };
    const { nextPieces: newNextPieces, pieceBag: newPieceBag } = generateNextPieces(tempGame, 4);

    return {
      ...game,
      grid: newGrid,
      heldPiece: pieceToHold,
      currentPiece: currentPiece,
      nextPieces: newNextPieces,
      pieceBag: newPieceBag,
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

export function canSpawn(grid: GridCell[][], piece: Piece, spawnPosition: Position): boolean {
  const shape = PIECE_SHAPES[piece.type][piece.rotation];

  for (const offset of shape) {
    const actualRow = spawnPosition.row + offset.row;
    const actualCol = spawnPosition.col + offset.col;

    // If spawn position is already occupied, game over
    if (actualRow >= 0 && grid[actualRow][actualCol].occupied) {
      return false;
    }
  }
  return true;
}


export function Start(game: GameObject): GameObject {
  const nextPiece = game.nextPieces[0];
  const tempGame: GameObject = { ...game, nextPieces: game.nextPieces.slice(1) };
  const { nextPieces: newNextPieces, pieceBag: newPieceBag } = generateNextPieces(tempGame, 4);
  const newPosition = SPAWN_POSITION;
  const newGrid = drawPiece(makeGrid(), nextPiece, newPosition);
  return { ...game, state: GameState.Running, nextPieces: newNextPieces, currentPiece: nextPiece, grid: newGrid, heldPiece: undefined, pieceBag: newPieceBag }
}


