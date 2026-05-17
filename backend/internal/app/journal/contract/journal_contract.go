package contract

import (
	"context"

	chatDto "github.com/haramurti/Mono/internal/app/chat/dto"
	"github.com/haramurti/Mono/internal/app/journal/dto"

	"github.com/haramurti/Mono/internal/app/journal/entity"
)

// ─────────────────────────────────────────────
// REPOSITORY
// ─────────────────────────────────────────────

type JournalRepository interface {
	// FindByDate cari journal by userID + date, nil kalau belum ada
	FindByDate(ctx context.Context, userID string, date string) (*entity.Journal, error)
	// FindByMonth ambil semua journal dalam satu bulan (YYYY-MM)
	FindByMonth(ctx context.Context, userID string, month string) ([]entity.Journal, error)
	// FindRecentSummarized ambil N journal terakhir yang sudah summarized/edited
	FindRecentSummarized(ctx context.Context, userID string, limit int) ([]entity.Journal, error)
	// Create buat journal baru
	Create(ctx context.Context, journal *entity.Journal) error
	// Update update journal yang sudah ada
	Update(ctx context.Context, journal *entity.Journal) error
	// FindByChatSessionID cari journal by session ID
	FindByChatSessionID(ctx context.Context, sessionID string) (*entity.Journal, error)
}

// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────

type JournalService interface {
	// SummarizeToday trigger Gemini untuk summarize chat session hari ini
	SummarizeToday(ctx context.Context, userID string) (*dto.JournalResponse, error)
	// GetByDate ambil journal by date (YYYY-MM-DD)
	GetByDate(ctx context.Context, userID string, date string) (*dto.JournalResponse, error)
	// UpdateByDate update field journal yang bisa diedit user
	UpdateByDate(ctx context.Context, userID string, date string, req *dto.UpdateJournalRequest) (*dto.JournalResponse, error)
	// GetCalendar ambil calendar data untuk satu bulan
	GetCalendar(ctx context.Context, userID string, month string) (*dto.CalendarResponse, error)
	// GetRecentSnippets untuk hybrid memory layer 3 — dipassing ke chat service
	GetRecentSnippets(ctx context.Context, userID string, limit int) ([]chatDto.RecentJournalSnippet, error)
}

// ─────────────────────────────────────────────
// GEMINI SUMMARIZER
// ─────────────────────────────────────────────

type JournalSummarizer interface {
	// Summarize generate journal dari chat history
	Summarize(ctx context.Context, chatHistory string) (*dto.SummarizeResult, error)
}
