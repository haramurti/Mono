package routes

import (
	"github.com/gofiber/fiber/v2"

	authHandler "github.com/haramurti/Mono/internal/app/Users/handler"
	chatHandler "github.com/haramurti/Mono/internal/app/chat/handler"
)

func SetupRoutes(app *fiber.App, auth *authHandler.AuthHandler, chat *chatHandler.ChatHandler, jwtMiddleware fiber.Handler) {
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
}
