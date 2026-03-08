export interface Message {
  message: string;
}

export interface Profile {
  // UUID
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface UserStats {
  id: string;
  highScore: number;
  gamesPlayed: number;
  linesCleared: number;
  bestLines?: number;
  createdAt: string;
}


