package routes

import (
	"github.com/gofiber/fiber/v2"

	authHandler "github.com/haramurti/Mono/internal/app/Users/handler"
	chatHandler "github.com/haramurti/Mono/internal/app/chat/handler"
	journalHandler "github.com/haramurti/Mono/internal/app/journal/handler"
	recapHandler "github.com/haramurti/Mono/internal/app/recap/handler"
)

func SetupRoutes(
	app *fiber.App,
	auth *authHandler.AuthHandler,
	chat *chatHandler.ChatHandler,
	journal *journalHandler.JournalHandler,
	recap *recapHandler.RecapHandler,
	jwtMiddleware fiber.Handler,
) {
	// ─── Auth (public) ───
	authGroup := app.Group("/auth")
	authGroup.Post("/register", auth.Register)
	authGroup.Post("/login", auth.Login)
	authGroup.Post("/refresh", auth.RefreshToken)

	// ─── Protected ───
	app.Get("/me", jwtMiddleware, auth.Me)

	// ─── Chat (protected) ───
	chatGroup := app.Group("/chat", jwtMiddleware)
	chatGroup.Post("/messages", chat.SendMessage)

	// ─── Journal (protected) ───
	journalGroup := app.Group("/journals", jwtMiddleware)
	journalGroup.Post("/today/summarize", journal.SummarizeToday)
	journalGroup.Get("/calendar", journal.GetCalendar)
	journalGroup.Get("/:date", journal.GetByDate)
	journalGroup.Patch("/:date", journal.UpdateByDate)

	recapGroup := app.Group("/recaps", jwtMiddleware)
	recapGroup.Get("/monthly", recap.GetMonthlyRecap)
	recapGroup.Post("/monthly/generate", recap.GenerateMonthlyRecap)
}
