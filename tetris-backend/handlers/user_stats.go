package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/ziad-bakki/tetris-backend/config"
	"github.com/ziad-bakki/tetris-backend/internal/middleware"
	"github.com/ziad-bakki/tetris-backend/models"
)

func GetUserStats(c *gin.Context) {
	uuidParam := c.Param("uuid")
	userUUID, err := uuid.Parse(uuidParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid UUID format",
		})
		return
	}

	data, _, err := config.SupabaseClient.
		From("user_stats").
		Select("*", "", false).
		Eq("user_id", userUUID.String()).
		Execute()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database query failed",
			"details": err.Error(),
		})
		return
	}

	var stats []models.UserStats
	if err := json.Unmarshal(data, &stats); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse response",
			"details": err.Error(),
		})
		return
	}

	if len(stats) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Stats not found for this user",
		})
		return
	}

	c.JSON(http.StatusOK, stats[0])
}

func UpdateUserStats(c *gin.Context) {
	uuidParam := c.Param("uuid")
	userUUID, err := uuid.Parse(uuidParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid UUID format",
		})
		return
	}

	authenticatedUserID, exists := c.Get(middleware.ContextKeyUserID)
	if !exists || authenticatedUserID.(string) != userUUID.String() {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "You can only update your own stats",
		})
		return
	}

	var updateData map[string]any
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request body",
			"details": err.Error(),
		})
		return
	}

	delete(updateData, "user_id")
	delete(updateData, "updated_at")

	if len(updateData) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No valid fields to update",
		})
		return
	}

	client := getClient()
	data, _, err := client.
		From("user_stats").
		Update(updateData, "", "").
		Eq("user_id", userUUID.String()).
		Execute()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update stats",
			"details": err.Error(),
		})
		return
	}

	var result []models.UserStats
	if err := json.Unmarshal(data, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse response",
			"details": err.Error(),
		})
		return
	}

	if len(result) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Stats not found or no permission to update",
		})
		return
	}

	c.JSON(http.StatusOK, result[0])
}
