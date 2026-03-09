export interface Message {
  message: string;
}

export interface Profile {
  // UUID
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  high_score: number;
  games_played: number;
  lines_cleared: number;
  best_lines?: number;
  created_at: string;
}

export interface Leaderboard {
  username: string;
  high_score: number;
  games_played: number;
  lines_cleared: number;
  best_lines: number;
  score_rank: number;
  lines_rank: number;
}


