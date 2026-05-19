package bootstrap

import (
	"log"

	"github.com/gofiber/fiber/v2"

	"github.com/haramurti/Mono/config"
	chatHandler "github.com/haramurti/Mono/internal/app/chat/handler"
	chatRepo "github.com/haramurti/Mono/internal/app/chat/repository"
	chatService "github.com/haramurti/Mono/internal/app/chat/service"
	journalHandler "github.com/haramurti/Mono/internal/app/journal/handler"
	journalRepo "github.com/haramurti/Mono/internal/app/journal/repository"
	journalService "github.com/haramurti/Mono/internal/app/journal/service"
	recapHandler "github.com/haramurti/Mono/internal/app/recap/handler"
	recapRepo "github.com/haramurti/Mono/internal/app/recap/repository"
	recapService "github.com/haramurti/Mono/internal/app/recap/service"
	authHandler "github.com/haramurti/Mono/internal/app/users/handler"
	authRepo "github.com/haramurti/Mono/internal/app/users/repository"
	authService "github.com/haramurti/Mono/internal/app/users/service"
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

	// ─── Repos bersama ───
	sessionRepo := chatRepo.NewChatSessionRepository(db)
	messageRepo := chatRepo.NewChatMessageRepository(db)
	memoryRepo := authRepo.NewUserMemoryRepository(db)

	// ─── Journal ───
	jRepo := journalRepo.NewJournalRepository(db)
	jSummarizer := gemini.NewJournalSummarizer(geminiClient.RawClient())
	jSvc := journalService.NewJournalService(
		jRepo,
		jSummarizer,
		sessionRepo,
		messageRepo,
		memoryRepo,
		geminiClient,
	)
	journalH := journalHandler.NewJournalHandler(jSvc)

	// ─── Chat (inject getRecentSnippets dari journal service) ───
	chatSvc := chatService.NewChatService(
		sessionRepo,
		messageRepo,
		memoryRepo,
		geminiClient,
		jSvc.GetRecentSnippets, // ← hybrid memory layer 3 aktif
	)
	chatH := chatHandler.NewChatHandler(chatSvc)

	recapRepo := recapRepo.NewRecapRepository(db)
	recapGen := gemini.NewRecapGenerator(geminiClient.RawClient())
	recapSvc := recapService.NewRecapService(recapRepo, jRepo, recapGen)
	recapH := recapHandler.NewRecapHandler(recapSvc)

	// ─── Fiber ───
	f := fiber.New(fiber.Config{
		AppName: "Mono API",
	})

	jwtMiddleware := middleware.JWTMiddleware()
	routes.SetupRoutes(f, authH, chatH, journalH, recapH, jwtMiddleware)

	return &App{
		DB:     db,
		Config: cfg,
		Fiber:  f,
	}
}
