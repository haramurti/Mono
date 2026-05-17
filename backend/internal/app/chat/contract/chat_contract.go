package contract

import (
	"context"

	"github.com/haramurti/Mono/internal/app/chat/dto"
	chatEntity "github.com/haramurti/Mono/internal/app/chat/entity"
	userEntity "github.com/haramurti/Mono/internal/app/users/entity"
)

// ─────────────────────────────────────────────
// REPOSITORY INTERFACES
// ─────────────────────────────────────────────

type ChatSessionRepository interface {
	// FindTodayByUserID cari session hari ini, return nil kalau belum ada
	FindTodayByUserID(ctx context.Context, userID string) (*chatEntity.ChatSession, error)
	// Create buat session baru
	Create(ctx context.Context, session *chatEntity.ChatSession) error
	// MarkCompleted tandai session selesai setelah di-summarize
	MarkCompleted(ctx context.Context, sessionID string) error
}

type ChatMessageRepository interface {
	// Save simpan satu pesan
	Save(ctx context.Context, message *chatEntity.ChatMessage) error
	// FindBySessionID ambil semua pesan dalam satu sesi, urut ascending
	FindBySessionID(ctx context.Context, sessionID string) ([]chatEntity.ChatMessage, error)
	// CountUserMessages hitung berapa pesan dari role "user" dalam sesi
	CountUserMessages(ctx context.Context, sessionID string) (int, error)
}

type UserMemoryRepository interface {
	// FindByUserID ambil memory summary user, nil kalau belum ada
	FindByUserID(ctx context.Context, userID string) (*userEntity.UserMemory, error)
	// Upsert create atau update memory summary
	Upsert(ctx context.Context, userID string, summary string) error
}

// ─────────────────────────────────────────────
// SERVICE INTERFACE
// ─────────────────────────────────────────────

type ChatService interface {
	// SendMessage proses pesan user, call Gemini, return response
	SendMessage(ctx context.Context, userID string, req *dto.SendMessageRequest) (*dto.SendMessageResponse, error)
}

// ─────────────────────────────────────────────
// GEMINI INTERFACE
// ─────────────────────────────────────────────

type GeminiClient interface {
	// Chat kirim full context + pesan baru ke Gemini, return reply
	Chat(ctx context.Context, geminiCtx dto.GeminiContext, userMessage string) (string, error)
	// UpdateUserMemory generate updated rolling summary dari journal baru
	UpdateUserMemory(ctx context.Context, currentSummary string, newJournalContent string) (string, error)
}
