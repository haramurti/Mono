package main

import (
	"log"

	"github.com/haramurti/Mono/cmd/bootstrap"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := bootstrap.Init()

	f := fiber.New(fiber.Config{
		AppName: "Mono API",
	})

	// health check
	f.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
		})
	})

	// routes akan ditambahkan di sini nanti
	// routes.Setup(f, app)

	log.Printf("🚀 Server running on port %s", app.Config.Port)
	if err := f.Listen(":" + app.Config.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
