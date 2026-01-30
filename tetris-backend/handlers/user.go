package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/ziad-bakki/tetris-backend/config"
	"github.com/ziad-bakki/tetris-backend/models"
)

func GetUserByUUID(c *gin.Context) {
	uuidParam := c.Param("uuid")

	userUUID, err := uuid.Parse(uuidParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid UUID Format",
		})
		return
	}

	data, _, err := config.SupabaseClient.
		From("users").
		Select("*", "", false).
		Eq("id", userUUID.String()).
		Execute()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database query failed",
			"details": err.Error(),
		})
		return
	}

	var users []models.User
	if err := json.Unmarshal(data, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse response",
			"details": err.Error(),
		})
		return
	}

	if len(users) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, users[0])

}

func GetAllUsers(c *gin.Context) {

	data, _, err := config.SupabaseClient.From("users").Select("*", "", false).Execute()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database query failed",
			"details": err.Error(),
		})
		return
	}

	var users []models.User
	if err := json.Unmarshal(data, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse response",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"count": len(users),
	})

}
