package models

import "github.com/google/uuid"

type UserStats struct {
	UserID       uuid.UUID `json:"user_id"`
	HighScore    int       `json:"high_score"`
	GamesPlayed  int       `json:"games_played"`
	LinesCleared int       `json:"lines_cleared"`
	BestLines    int       `json:"best_lines"`
	LastPlayed   string    `json:"last_played"`
	UpdatedAt    string    `json:"updated_at"`
}
