package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"github.com/haramurti/Mono/internal/app/chat/contract"
	"github.com/haramurti/Mono/internal/app/chat/dto"
)

type ChatHandler struct {
	chatService contract.ChatService
	validate    *validator.Validate
}

func NewChatHandler(chatService contract.ChatService) *ChatHandler {
	return &ChatHandler{
		chatService: chatService,
		validate:    validator.New(),
	}
}

// POST /chat/messages
func (h *ChatHandler) SendMessage(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)
	if !ok || userID == "" {
		return errorResponse(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "Authentication is required.")
	}

	var req dto.SendMessageRequest
	if err := c.BodyParser(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid request body.")
	}
	if err := h.validate.Struct(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", err.Error())
	}

	resp, err := h.chatService.SendMessage(c.Context(), userID, &req)
	if err != nil {
		return errorResponse(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", "Something went wrong.")
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func errorResponse(c *fiber.Ctx, status int, code, message string) error {
	return c.Status(status).JSON(fiber.Map{
		"code":    code,
		"message": message,
	})
}
