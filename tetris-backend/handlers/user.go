package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/supabase-community/supabase-go"
	"github.com/ziad-bakki/tetris-backend/config"
	"github.com/ziad-bakki/tetris-backend/models"
)

func getClient() *supabase.Client {
	if config.SupabaseAdminClient != nil {
		return config.SupabaseAdminClient
	}
	return config.SupabaseClient
}

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

func UpdateUser(c *gin.Context) {
	uuidParam := c.Param("uuid")

	userUUID, err := uuid.Parse(uuidParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid UUID format",
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

	delete(updateData, "id")
	delete(updateData, "created_at")

	if len(updateData) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No valid fields to update",
		})
		return
	}

	client := getClient()
	data, _, err := client.
		From("users").Update(updateData, "", "").Eq("id", userUUID.String()).Execute()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update user",
			"details": err.Error(),
		})
		return
	}

	var result []models.User
	if err := json.Unmarshal(data, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse response",
			"details": err.Error(),
		})
		return
	}

	if len(result) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found or no permission to update",
		})
		return
	}

	c.JSON(http.StatusOK, result[0])
}

func DeleteUser(c *gin.Context) {
	return
}
