package main

import (
	"log"

	"github.com/haramurti/Mono/cmd/bootstrap"
	// "github.com/haramurti/Mono/internal/infra/database"
)

func main() {
	app := bootstrap.Init()
	// defer database.CloseDB()

	log.Printf("🚀 Server running on port %s", app.Config.Port)
	if err := app.Fiber.Listen(":" + app.Config.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
