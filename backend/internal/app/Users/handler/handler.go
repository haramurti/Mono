package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"github.com/haramurti/Mono/internal/app/Users/contract"
	"github.com/haramurti/Mono/internal/app/Users/dto"
)

type AuthHandler struct {
	authService contract.AuthService
	validate    *validator.Validate
}

func NewAuthHandler(authService contract.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validate:    validator.New(),
	}
}

// POST /auth/register
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req dto.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid request body.")
	}
	if err := h.validate.Struct(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", err.Error())
	}

	res, err := h.authService.Register(c.Context(), &req)
	if err != nil {
		if err.Error() == "EMAIL_ALREADY_EXISTS" {
			return errorResponse(c, fiber.StatusConflict, "EMAIL_ALREADY_EXISTS", "This email is already registered.")
		}
		return errorResponse(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", "Something went wrong.")
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

// POST /auth/login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid request body.")
	}
	if err := h.validate.Struct(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", err.Error())
	}

	res, err := h.authService.Login(c.Context(), &req)
	if err != nil {
		if err.Error() == "INVALID_CREDENTIALS" {
			return errorResponse(c, fiber.StatusUnauthorized, "INVALID_CREDENTIALS", "Email or password is incorrect.")
		}
		return errorResponse(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", "Something went wrong.")
	}

	return c.Status(fiber.StatusOK).JSON(res)
}

// POST /auth/refresh
func (h *AuthHandler) RefreshToken(c *fiber.Ctx) error {
	var req dto.RefreshTokenRequest
	if err := c.BodyParser(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid request body.")
	}
	if err := h.validate.Struct(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", err.Error())
	}

	res, err := h.authService.RefreshToken(c.Context(), &req)
	if err != nil {
		return errorResponse(c, fiber.StatusUnauthorized, "INVALID_REFRESH_TOKEN", "Refresh token is invalid or has expired.")
	}

	return c.Status(fiber.StatusOK).JSON(res)
}

// GET /me
func (h *AuthHandler) Me(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(string)
	if !ok || userID == "" {
		return errorResponse(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "Authentication is required.")
	}

	res, err := h.authService.GetCurrentUser(c.Context(), userID)
	if err != nil {
		return errorResponse(c, fiber.StatusUnauthorized, "UNAUTHORIZED", "Authentication is required.")
	}

	return c.Status(fiber.StatusOK).JSON(res)
}

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────

func errorResponse(c *fiber.Ctx, status int, code, message string) error {
	return c.Status(status).JSON(fiber.Map{
		"code":    code,
		"message": message,
	})
}
