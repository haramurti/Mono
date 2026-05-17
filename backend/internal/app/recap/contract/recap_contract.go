package contract

import (
	"context"

	"github.com/haramurti/Mono/internal/app/recap/dto"
	"github.com/haramurti/Mono/internal/app/recap/entity"
)

// ─────────────────────────────────────────────
// REPOSITORY
// ─────────────────────────────────────────────

type RecapRepository interface {
	// FindByMonth cari recap by userID + month (YYYY-MM), nil kalau belum ada
	FindByMonth(ctx context.Context, userID string, month string) (*entity.MonthlyRecap, error)
	// Create simpan recap baru
	Create(ctx context.Context, recap *entity.MonthlyRecap) error
	// Update update recap yang sudah ada
	Update(ctx context.Context, recap *entity.MonthlyRecap) error
}

// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────

type RecapService interface {
	// GetMonthlyRecap return state recap bulan ini (generated/ready/not_enough)
	GetMonthlyRecap(ctx context.Context, userID string, month string) (interface{}, error)
	// GenerateMonthlyRecap trigger Gemini untuk generate recap
	GenerateMonthlyRecap(ctx context.Context, userID string, req *dto.GenerateMonthlyRecapRequest) (*dto.MonthlyRecapResponse, error)
}

// ─────────────────────────────────────────────
// GEMINI
// ─────────────────────────────────────────────

type RecapGenerator interface {
	// Generate buat recap dari kumpulan journal summaries
	Generate(ctx context.Context, journalSummaries string) (*dto.RecapGenerateResult, error)
}
