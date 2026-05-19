package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"github.com/haramurti/Mono/internal/app/recap/contract"
	"github.com/haramurti/Mono/internal/app/recap/dto"
)

type RecapHandler struct {
	recapService contract.RecapService
	validate     *validator.Validate
}

func NewRecapHandler(recapService contract.RecapService) *RecapHandler {
	return &RecapHandler{
		recapService: recapService,
		validate:     validator.New(),
	}
}

// GET /recaps/monthly?month=YYYY-MM
func (h *RecapHandler) GetMonthlyRecap(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	month := c.Query("month")
	if month == "" {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", "month query parameter is required (YYYY-MM).")
	}

	resp, err := h.recapService.GetMonthlyRecap(c.Context(), userID, month)
	if err != nil {
		return errorResponse(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", "Something went wrong.")
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// POST /recaps/monthly/generate
func (h *RecapHandler) GenerateMonthlyRecap(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	var req dto.GenerateMonthlyRecapRequest
	if err := c.BodyParser(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid request body.")
	}
	if err := h.validate.Struct(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", err.Error())
	}

	resp, err := h.recapService.GenerateMonthlyRecap(c.Context(), userID, &req)
	if err != nil {
		switch err.Error() {
		case "NOT_ENOUGH_MONTHLY_DATA":
			return errorResponse(c, fiber.StatusBadRequest, "NOT_ENOUGH_MONTHLY_DATA",
				"You need at least 3 journal entries this month to generate a monthly recap.")
		default:
			return errorResponse(c, fiber.StatusInternalServerError, "MONTHLY_RECAP_GENERATION_FAILED",
				"We could not generate your monthly recap right now. Please try again.")
		}
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

func errorResponse(c *fiber.Ctx, status int, code, message string) error {
	return c.Status(status).JSON(fiber.Map{
		"code":    code,
		"message": message,
	})
}
