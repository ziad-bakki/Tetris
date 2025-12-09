import { generateNextPieces, makeGrid } from "../context/gamecontext";
import { GameObject, GameState, Position } from "../interfaces/interfaces";

export const SPAWN_POSITION: Position = { row: 0, col: 4 } as const;
export const DEFAULT_GAME_OBJECT: GameObject = {  
    state: GameState.Menu,
    timeElapsed: 0,
    grid: makeGrid(),
    nextPieces: generateNextPieces(4),
    currentPiece: undefined,
    heldPiece: undefined,
}