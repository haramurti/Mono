package bootstrap

import (
	"log"

	"github.com/gofiber/fiber/v2"

	"github.com/haramurti/Mono/config"
	authHandler "github.com/haramurti/Mono/internal/app/Users/handler"
	authRepo "github.com/haramurti/Mono/internal/app/Users/repository"
	authService "github.com/haramurti/Mono/internal/app/Users/service"
	chatHandler "github.com/haramurti/Mono/internal/app/chat/handler"
	chatRepo "github.com/haramurti/Mono/internal/app/chat/repository"
	chatService "github.com/haramurti/Mono/internal/app/chat/service"
	"github.com/haramurti/Mono/internal/infra/database"
	"github.com/haramurti/Mono/internal/infra/gemini"
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

	// ─── Database ───
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	if err := database.Migrate(db); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	// ─── Auth ───
	userRepo := authRepo.NewUserRepository(db)
	tokenRepo := authRepo.NewRefreshTokenRepository(db)
	authSvc := authService.NewAuthService(userRepo, tokenRepo)
	authH := authHandler.NewAuthHandler(authSvc)

	// ─── Gemini ───
	geminiClient, err := gemini.NewGeminiClient()
	if err != nil {
		log.Fatalf("failed to init gemini: %v", err)
	}

	// ─── Chat ───
	sessionRepo := chatRepo.NewChatSessionRepository(db)
	messageRepo := chatRepo.NewChatMessageRepository(db)
	memoryRepo := chatRepo.NewUserMemoryRepository(db)
	chatSvc := chatService.NewChatService(
		sessionRepo,
		messageRepo,
		memoryRepo,
		geminiClient,
		nil, // getRecentJournals: akan di-inject setelah journal domain selesai
	)
	chatH := chatHandler.NewChatHandler(chatSvc)

	// ─── Fiber ───
	f := fiber.New(fiber.Config{
		AppName: "Mono API",
	})

	jwtMiddleware := middleware.JWTMiddleware()
	routes.SetupRoutes(f, authH, chatH, jwtMiddleware)

	return &App{
		DB:     db,
		Config: cfg,
		Fiber:  f,
	}
}
