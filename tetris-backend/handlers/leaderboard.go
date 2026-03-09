package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	postgrest "github.com/supabase-community/postgrest-go"
	"github.com/ziad-bakki/tetris-backend/config"
)

type LeaderboardEntry struct {
	Username     string `json:"username"`
	AvatarURL    string `json:"avatar_url"`
	HighScore    int    `json:"high_score"`
	GamesPlayed  int    `json:"games_played"`
	LinesCleared int    `json:"lines_cleared"`
	BestLines    int    `json:"best_lines"`
	ScoreRank    int64  `json:"score_rank"`
	LinesRank    int64  `json:"lines_rank"`
}

func GetLeaderboardByHighScore(c *gin.Context) {
	getLeaderboard(c, "score_rank")
}

func GetLeaderboardByLinesCleared(c *gin.Context) {
	getLeaderboard(c, "lines_rank")
}

func getLeaderboard(c *gin.Context, orderBy string) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	data, _, err := config.SupabaseClient.
		From("leaderboard").
		Select("*", "", false).
		Order(orderBy, &postgrest.OrderOpts{Ascending: true}).
		Limit(limit, "").
		Execute()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database query failed",
			"details": err.Error(),
		})
		return
	}

	var entries []LeaderboardEntry
	if err := json.Unmarshal(data, &entries); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse response",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, entries)
}
