package config

import (
	"log"
	"os"

	supabase "github.com/supabase-community/supabase-go"
)

var SupabaseClient *supabase.Client

func InitSupabase() {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("SUPABASE_URL and SUPABASE_KEY must be set in .env")
	}

	var err error

	SupabaseClient, err = supabase.NewClient(supabaseURL, supabaseKey, nil)
	if err != nil {
		log.Fatal("Failed to initialize Supabase client", err)
	}

	log.Println("Supabase client initialized successfully")
}
