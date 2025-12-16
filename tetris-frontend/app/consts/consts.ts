import { generateNextPieces, makeGrid } from "../context/gamecontext";
import { GameObject, GameState, Position } from "../interfaces/interfaces";

export const SPAWN_POSITION: Position = { row: 0, col: 4 } as const;
export const DEFAULT_GAME_OBJECT: GameObject = {
  state: GameState.Menu,
  grid: makeGrid(),
  clearedLines: 0,
  nextPieces: generateNextPieces(undefined, 4),
  currentPiece: undefined,
  heldPiece: undefined,
}
