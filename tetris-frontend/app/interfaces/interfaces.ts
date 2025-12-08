export enum GameState {
  Menu,
  Running,
  Paused,
  Over,
}

export enum Color {
  Black = "#000000",
  White = "#FFFFFF",
  I = "#00FFFF",    // I
  O = "#FFFF00",  // O
  T = "#800080",  // T
  S = "#008000",   // S
  Z = "#FF0000",     // Z
  J = "#0000FF",    // J
  L = "#FFA500",  // L
}

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Rotation = 0 | 1 | 2 | 3;

export interface Piece {
  type: PieceType;
  rotation: Rotation;
  color: Color;
}

export interface GridCell {
  occupied: boolean;
  currentPiece: boolean;
  color?: Color;
}

export interface GameObject {
  state: GameState,
  timeElapsed: number,
  grid: GridCell[][],
  currentPiece: Piece,
  nextPieces: Piece[],
  heldPiece?: Piece,
}

export type Position = { row: number, col: number }; 
