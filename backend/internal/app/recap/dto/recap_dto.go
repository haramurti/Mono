package dto

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

type GenerateMonthlyRecapRequest struct {
	Month string `json:"month" validate:"required"`
}

// ─────────────────────────────────────────────
// RESPONSE — generated recap
// ─────────────────────────────────────────────

type MonthlyRecapResponse struct {
	ID                      string         `json:"id"`
	UserID                  string         `json:"userId"`
	Month                   string         `json:"month"`
	Status                  string         `json:"status"`
	Title                   string         `json:"title"`
	Summary                 string         `json:"summary"`
	MostFrequentMood        string         `json:"mostFrequentMood"`
	MoodDistribution        map[string]int `json:"moodDistribution"`
	TopEmotionTags          []string       `json:"topEmotionTags"`
	TopTopicTags            []string       `json:"topTopicTags"`
	RecurringPattern        string         `json:"recurringPattern"`
	MonthlyInsight          string         `json:"monthlyInsight"`
	SuggestedFocusNextMonth string         `json:"suggestedFocusNextMonth"`
	JournalCount            int            `json:"journalCount"`
	GeneratedAt             string         `json:"generatedAt"`
	UpdatedAt               string         `json:"updatedAt"`
}

// ─────────────────────────────────────────────
// RESPONSE — state (not enough / ready)
// ─────────────────────────────────────────────

type MonthlyRecapNotEnoughData struct {
	Month           string `json:"month"`
	Status          string `json:"status"`
	JournalCount    int    `json:"journalCount"`
	MinimumRequired int    `json:"minimumRequired"`
	Message         string `json:"message"`
}

type MonthlyRecapReadyToGenerate struct {
	Month           string `json:"month"`
	Status          string `json:"status"`
	JournalCount    int    `json:"journalCount"`
	MinimumRequired int    `json:"minimumRequired"`
}

// ─────────────────────────────────────────────
// INTERNAL — Gemini output
// ─────────────────────────────────────────────

type RecapGenerateResult struct {
	Title                   string         `json:"title"`
	Summary                 string         `json:"summary"`
	MostFrequentMood        string         `json:"mostFrequentMood"`
	MoodDistribution        map[string]int `json:"moodDistribution"`
	TopEmotionTags          []string       `json:"topEmotionTags"`
	TopTopicTags            []string       `json:"topTopicTags"`
	RecurringPattern        string         `json:"recurringPattern"`
	MonthlyInsight          string         `json:"monthlyInsight"`
	SuggestedFocusNextMonth string         `json:"suggestedFocusNextMonth"`
}
