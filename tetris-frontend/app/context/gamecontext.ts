
enum GameState {
  Menu,
  Running,
  Paused,
  Over,
}

export interface Game {
  state: GameState,
  timeElapsed: number,
  grid: number[][],
}
