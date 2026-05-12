package bootstrap

import (
	"log"

	"github.com/gofiber/fiber/v2"

	"github.com/haramurti/Mono/config"
	"github.com/haramurti/Mono/internal/app/Users/handler"
	"github.com/haramurti/Mono/internal/app/Users/repository"
	"github.com/haramurti/Mono/internal/app/Users/service"
	"github.com/haramurti/Mono/internal/infra/database"
	"github.com/haramurti/Mono/internal/middleware"
	"github.com/haramurti/Mono/internal/routes"

	"gorm.io/gorm"
)

type App struct {
	DB     *gorm.DB
	Config *config.Config
	Fiber  *fiber.App
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

	// wire up auth
	userRepo := repository.NewUserRepository(db)
	tokenRepo := repository.NewRefreshTokenRepository(db)
	authSvc := service.NewAuthService(userRepo, tokenRepo)
	authHandler := handler.NewAuthHandler(authSvc)

	// fiber
	f := fiber.New(fiber.Config{
		AppName: "Mono API",
	})

	// middleware
	jwtMiddleware := middleware.JWTMiddleware()

	// routes
	routes.SetupAuthRoutes(f, authHandler, jwtMiddleware)

	return &App{
		DB:     db,
		Config: cfg,
		Fiber:  f,
	}
}
