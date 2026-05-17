package dto

import "time"

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

type JournalResponse struct {
	ID                  string   `json:"id"`
	UserID              string   `json:"userId"`
	Date                string   `json:"date"`
	Status              string   `json:"status"`
	Title               *string  `json:"title"`
	Summary             *string  `json:"summary"`
	PrimaryMood         *string  `json:"primaryMood"`
	MoodIntensity       *int     `json:"moodIntensity"`
	EmotionTags         []string `json:"emotionTags"`
	TopicTags           []string `json:"topicTags"`
	KeyInsight          *string  `json:"keyInsight"`
	SuggestedNextAction *string  `json:"suggestedNextAction"`
	Language            string   `json:"language"`
	IsEdited            bool     `json:"isEdited"`
	SafetyFlag          string   `json:"safetyFlag"`
	SummarizedAt        *string  `json:"summarizedAt"`
	CreatedAt           string   `json:"createdAt"`
	UpdatedAt           string   `json:"updatedAt"`
}

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

type UpdateJournalRequest struct {
	Title       *string  `json:"title"`
	Summary     *string  `json:"summary"`
	PrimaryMood *string  `json:"primaryMood"`
	EmotionTags []string `json:"emotionTags"`
	TopicTags   []string `json:"topicTags"`
}

// ─────────────────────────────────────────────
// CALENDAR
// ─────────────────────────────────────────────

type CalendarDayResponse struct {
	Date        string `json:"date"`
	Status      string `json:"status"`
	PrimaryMood string `json:"primaryMood"`
	MoodEmoji   string `json:"moodEmoji"`
	Title       string `json:"title"`
	IsEdited    bool   `json:"isEdited"`
}

type MonthlyRecapCardResponse struct {
	Status           string  `json:"status"`
	Month            string  `json:"month"`
	Title            *string `json:"title"`
	SummaryPreview   *string `json:"summaryPreview"`
	MostFrequentMood *string `json:"mostFrequentMood"`
	MoodEmoji        *string `json:"moodEmoji"`
	JournalCount     int     `json:"journalCount"`
	MinimumRequired  *int    `json:"minimumRequired"`
}

type CalendarResponse struct {
	Month        string                   `json:"month"`
	Streak       int                      `json:"streak"`
	Days         []CalendarDayResponse    `json:"days"`
	MonthlyRecap MonthlyRecapCardResponse `json:"monthlyRecap"`
}

// ─────────────────────────────────────────────
// INTERNAL — untuk Gemini summarize
// ─────────────────────────────────────────────

type SummarizeResult struct {
	Title               string
	Summary             string
	PrimaryMood         string
	MoodIntensity       int
	EmotionTags         []string
	TopicTags           []string
	KeyInsight          string
	SuggestedNextAction string
	Language            string
	SafetyFlag          string
}

// untuk format waktu yang konsisten
const TimeFormat = time.RFC3339
