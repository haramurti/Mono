package dto

import "github.com/haramurti/Mono/internal/app/chat/entity"

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

type SendMessageRequest struct {
	Content     string  `json:"content"     validate:"required,min=1"`
	InitialMood *string `json:"initialMood"` // nullable, hanya di pesan pertama
}

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

type ChatMessageResponse struct {
	ID        string `json:"id"`
	JournalID string `json:"journalId"` // session ID sebagai journal anchor
	Role      string `json:"role"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdAt"`
}

type ChatActionsResponse struct {
	CanSummarize       bool   `json:"canSummarize"`       // true kalau userMessageCount >= 3
	ShouldOfferSummary bool   `json:"shouldOfferSummary"` // true kalau >= 7 pesan (sweet spot)
	SafetyFlag         string `json:"safetyFlag"`         // "none" | "crisis"
}

type JournalStateResponse struct {
	Date             string `json:"date"`
	Status           string `json:"status"`
	UserMessageCount int    `json:"userMessageCount"`
}

type SendMessageResponse struct {
	Message      ChatMessageResponse  `json:"message"`
	Actions      ChatActionsResponse  `json:"actions"`
	JournalState JournalStateResponse `json:"journalState"`
}

// ─────────────────────────────────────────────
// INTERNAL — untuk build Gemini context
// ─────────────────────────────────────────────

type GeminiContext struct {
	UserMemorySummary string                 // layer 2: rolling summary
	RecentJournals    []RecentJournalSnippet // layer 3: 3-5 journal terakhir
	SessionMessages   []entity.ChatMessage   // layer 1: chat hari ini
}

type RecentJournalSnippet struct {
	Date        string
	Title       string
	KeyInsight  string
	PrimaryMood string
}

type GetChatMessagesResponse struct {
	Messages     []ChatMessageResponse `json:"messages"`
	JournalState JournalStateResponse  `json:"journalState"`
}
