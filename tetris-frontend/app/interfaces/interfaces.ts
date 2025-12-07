
enum GameState {
  Menu,
  Running,
  Paused,
  Over,
}

export interface GridCell {
  occuppied: boolean;
  color?: string;
}

export interface Game {
  state: GameState,
  timeElapsed: number,
  grid: number[][],
}
