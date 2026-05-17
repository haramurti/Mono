package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"github.com/haramurti/Mono/internal/app/journal/contract"
	"github.com/haramurti/Mono/internal/app/journal/dto"
)

type JournalHandler struct {
	journalService contract.JournalService
	validate       *validator.Validate
}

func NewJournalHandler(journalService contract.JournalService) *JournalHandler {
	return &JournalHandler{
		journalService: journalService,
		validate:       validator.New(),
	}
}

// POST /journals/today/summarize
func (h *JournalHandler) SummarizeToday(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	resp, err := h.journalService.SummarizeToday(c.Context(), userID)
	if err != nil {
		switch err.Error() {
		case "NOT_ENOUGH_MESSAGES":
			return errorResponse(c, fiber.StatusBadRequest, "NOT_ENOUGH_MESSAGES",
				"You need at least 3 messages to summarize today's journal.")
		default:
			if len(err.Error()) > 25 && err.Error()[:25] == "SUMMARY_GENERATION_FAILED" {
				return errorResponse(c, fiber.StatusInternalServerError, "SUMMARY_GENERATION_FAILED",
					"We could not generate your summary right now. Your chat was saved safely. Please try again.")
			}
			return errorResponse(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", "Something went wrong.")
		}
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// GET /journals/calendar?month=YYYY-MM
func (h *JournalHandler) GetCalendar(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	month := c.Query("month")
	if month == "" {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", "month query parameter is required (YYYY-MM).")
	}

	resp, err := h.journalService.GetCalendar(c.Context(), userID, month)
	if err != nil {
		return errorResponse(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", "Something went wrong.")
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// GET /journals/:date
func (h *JournalHandler) GetByDate(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	date := c.Params("date")

	resp, err := h.journalService.GetByDate(c.Context(), userID, date)
	if err != nil {
		if err.Error() == "JOURNAL_NOT_FOUND" {
			return errorResponse(c, fiber.StatusNotFound, "JOURNAL_NOT_FOUND", "No journal found for this date.")
		}
		return errorResponse(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", "Something went wrong.")
	}

	return c.Status(fiber.StatusOK).JSON(resp)
}

// PATCH /journals/:date
func (h *JournalHandler) UpdateByDate(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	date := c.Params("date")

	var req dto.UpdateJournalRequest
	if err := c.BodyParser(&req); err != nil {
		return errorResponse(c, fiber.StatusBadRequest, "BAD_REQUEST", "Invalid request body.")
	}

	resp, err := h.journalService.UpdateByDate(c.Context(), userID, date, &req)
	if err != nil {
		if err.Error() == "JOURNAL_NOT_FOUND" {
			return errorResponse(c, fiber.StatusNotFound, "JOURNAL_NOT_FOUND", "No journal found for this date.")
		}
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
