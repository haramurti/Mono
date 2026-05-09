package bootstrap

import (
	"log"

	"github.com/haramurti/Mono/config"
	"github.com/haramurti/Mono/internal/infra/database"

	"gorm.io/gorm"
)

type App struct {
	DB     *gorm.DB
	Config *config.Config
}

func Init() *App {
	cfg := config.Load()

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	if err := database.Migrate(db); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	return &App{
		DB:     db,
		Config: cfg,
	}
}
