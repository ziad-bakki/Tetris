import { generateNextPieces, makeGrid } from "../context/gamecontext";
import { GameObject, GameState, Position } from "../interfaces/interfaces";

export const SPAWN_POSITION: Position = { row: 0, col: 4 } as const;
