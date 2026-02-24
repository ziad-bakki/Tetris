package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/supabase-community/gotrue-go/types"
	"github.com/supabase-community/supabase-go"
	"github.com/ziad-bakki/tetris-backend/config"
	"github.com/ziad-bakki/tetris-backend/internal/middleware"
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

	authenticatedUserID, exists := c.Get(middleware.ContextKeyUserID)
	if !exists || authenticatedUserID.(string) != userUUID.String() {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "You can only update your own profile",
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
			"error": "You can only delete your own profile",
		})
		return
	}

	if config.SupabaseAdminClient == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Admin client not configured, cannot delete auth user",
		})
		return
	}

	// Delete from auth.users first (this is the source of truth)
	err = config.SupabaseAdminClient.Auth.AdminDeleteUser(types.AdminDeleteUserRequest{
		UserID: userUUID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to delete auth user",
			"details": err.Error(),
		})
		return
	}

	// Delete from public users table
	client := getClient()
	data, _, err := client.From("users").Delete("", "").Eq("id", userUUID.String()).Execute()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Auth user deleted but failed to delete profile data",
			"details": err.Error(),
		})
		return
	}

	var result []models.User
	if err := json.Unmarshal(data, &result); err != nil || len(result) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "User deleted successfully",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "User deleted successfully",
		"deleted_user": result[0],
	})

}
