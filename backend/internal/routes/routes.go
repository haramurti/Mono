package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/haramurti/Mono/internal/app/Users/handler"
)

func SetupAuthRoutes(app *fiber.App, authHandler *handler.AuthHandler, jwtMiddleware fiber.Handler) {
	auth := app.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/refresh", authHandler.RefreshToken)

	// protected
	app.Get("/me", jwtMiddleware, authHandler.Me)
}
