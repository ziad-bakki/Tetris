package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/ziad-bakki/tetris-backend/config"
	"github.com/ziad-bakki/tetris-backend/handlers"
	"github.com/ziad-bakki/tetris-backend/internal/middleware"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	} else {
		log.Println(".env file loaded")
	}

	config.InitSupabase()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	// Public routes
	r.GET("/health", handlers.HealthCheck)
	r.GET("/users", handlers.GetAllUsers)
	r.GET("/users/:uuid", handlers.GetUserByUUID)
	r.GET("/favicon.ico", func(c *gin.Context) {
		c.Status(204)
	})

	// Protected routes
	protected := r.Group("/")
	protected.Use(middleware.AuthRequired())
	{
		protected.PUT("/users/:uuid", handlers.UpdateUser)
		protected.DELETE("/users/:uuid", handlers.DeleteUser)
	}

	log.Printf("Server starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}

}
