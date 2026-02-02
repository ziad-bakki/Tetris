package config

import (
	"log"
	"os"

	supabase "github.com/supabase-community/supabase-go"
)

var SupabaseClient *supabase.Client
var SupabaseAdminClient *supabase.Client

func InitSupabase() {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")
	supabaseServiceKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("SUPABASE_URL and SUPABASE_KEY must be set in .env")
	}

	var err error

	SupabaseClient, err = supabase.NewClient(supabaseURL, supabaseKey, nil)
	if err != nil {
		log.Fatal("Failed to initialize Supabase client", err)
	}

	if supabaseServiceKey != "" {
		SupabaseAdminClient, err = supabase.NewClient(supabaseURL, supabaseServiceKey, nil)
		if err != nil {
			log.Fatal("Failed to initialize Supabase admin client:", err)
		}
		log.Println("Supabase admin client initialized")
	} else {
		log.Println("Service role key not set - admin operations disabled")
	}

	log.Println("Supabase client initialized successfully")
}
