package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	userContract "github.com/haramurti/Mono/internal/app/Users/contract"
	chatContract "github.com/haramurti/Mono/internal/app/chat/contract"
	chatDto "github.com/haramurti/Mono/internal/app/chat/dto"
	chatEntity "github.com/haramurti/Mono/internal/app/chat/entity"

	"github.com/haramurti/Mono/internal/app/journal/contract"
	"github.com/haramurti/Mono/internal/app/journal/dto"
	"github.com/haramurti/Mono/internal/app/journal/entity"
)

type journalService struct {
	journalRepo  contract.JournalRepository
	summarizer   contract.JournalSummarizer
	sessionRepo  chatContract.ChatSessionRepository
	messageRepo  chatContract.ChatMessageRepository
	memoryRepo   userContract.UserMemoryRepository
	geminiMemory interface {
		UpdateUserMemory(ctx context.Context, current string, newJournal string) (string, error)
	}
}

func NewJournalService(
	journalRepo contract.JournalRepository,
	summarizer contract.JournalSummarizer,
	sessionRepo chatContract.ChatSessionRepository,
	messageRepo chatContract.ChatMessageRepository,
	memoryRepo userContract.UserMemoryRepository,
	geminiMemory interface {
		UpdateUserMemory(ctx context.Context, current string, newJournal string) (string, error)
	},
) contract.JournalService {
	return &journalService{
		journalRepo:  journalRepo,
		summarizer:   summarizer,
		sessionRepo:  sessionRepo,
		messageRepo:  messageRepo,
		memoryRepo:   memoryRepo,
		geminiMemory: geminiMemory,
	}
}

// ─────────────────────────────────────────────
// SummarizeToday
// ─────────────────────────────────────────────

func (s *journalService) SummarizeToday(ctx context.Context, userID string) (*dto.JournalResponse, error) {
	// 1. get session hari ini
	session, err := s.sessionRepo.FindTodayByUserID(ctx, userID)
	if err != nil || session == nil {
		return nil, errors.New("NOT_ENOUGH_MESSAGES")
	}

	// 2. cek minimum 3 user messages
	msgCount, err := s.messageRepo.CountUserMessages(ctx, session.ID.String())
	if err != nil {
		return nil, err
	}
	if msgCount < 3 {
		return nil, errors.New("NOT_ENOUGH_MESSAGES")
	}

	// 3. ambil semua pesan, format jadi string untuk Gemini
	messages, err := s.messageRepo.FindBySessionID(ctx, session.ID.String())
	if err != nil {
		return nil, err
	}
	chatHistory := formatChatHistory(messages)

	// 4. call Gemini summarizer
	result, err := s.summarizer.Summarize(ctx, chatHistory)
	if err != nil {
		return nil, fmt.Errorf("SUMMARY_GENERATION_FAILED: %w", err)
	}

	// 5. cek apakah journal sudah ada (re-summarize case)
	today := time.Now().Format("2006-01-02")
	existing, _ := s.journalRepo.FindByDate(ctx, userID, today)

	userUUID, _ := uuid.Parse(userID)
	now := time.Now()

	emotionTagsJSON, _ := json.Marshal(result.EmotionTags)
	topicTagsJSON, _ := json.Marshal(result.TopicTags)

	if existing != nil {
		// update existing
		existing.Title = &result.Title
		existing.Summary = &result.Summary
		existing.PrimaryMood = &result.PrimaryMood
		existing.MoodIntensity = &result.MoodIntensity
		existing.EmotionTags = string(emotionTagsJSON)
		existing.TopicTags = string(topicTagsJSON)
		existing.KeyInsight = &result.KeyInsight
		existing.SuggestedNextAction = &result.SuggestedNextAction
		existing.Language = result.Language
		existing.SafetyFlag = result.SafetyFlag
		existing.Status = "summarized"
		existing.SummarizedAt = &now

		if err := s.journalRepo.Update(ctx, existing); err != nil {
			return nil, err
		}

		// mark session completed
		_ = s.sessionRepo.MarkCompleted(ctx, session.ID.String())

		// update user memory di background
		go s.updateUserMemory(context.Background(), userID, result.Summary)

		return toJournalResponse(existing), nil
	}

	// create baru
	journal := &entity.Journal{
		ID:                  uuid.New(),
		UserID:              userUUID,
		ChatSessionID:       session.ID,
		Date:                session.Date,
		Status:              "summarized",
		Title:               &result.Title,
		Summary:             &result.Summary,
		PrimaryMood:         &result.PrimaryMood,
		MoodIntensity:       &result.MoodIntensity,
		EmotionTags:         string(emotionTagsJSON),
		TopicTags:           string(topicTagsJSON),
		KeyInsight:          &result.KeyInsight,
		SuggestedNextAction: &result.SuggestedNextAction,
		Language:            result.Language,
		SafetyFlag:          result.SafetyFlag,
		SummarizedAt:        &now,
	}

	if err := s.journalRepo.Create(ctx, journal); err != nil {
		return nil, err
	}

	_ = s.sessionRepo.MarkCompleted(ctx, session.ID.String())

	// update user memory di background — non-blocking
	go s.updateUserMemory(context.Background(), userID, result.Summary)

	return toJournalResponse(journal), nil
}

// ─────────────────────────────────────────────
// GetByDate
// ─────────────────────────────────────────────

func (s *journalService) GetByDate(ctx context.Context, userID string, date string) (*dto.JournalResponse, error) {
	journal, err := s.journalRepo.FindByDate(ctx, userID, date)
	if err != nil {
		return nil, err
	}
	if journal == nil {
		return nil, errors.New("JOURNAL_NOT_FOUND")
	}
	return toJournalResponse(journal), nil
}

// ─────────────────────────────────────────────
// UpdateByDate
// ─────────────────────────────────────────────

func (s *journalService) UpdateByDate(ctx context.Context, userID string, date string, req *dto.UpdateJournalRequest) (*dto.JournalResponse, error) {
	journal, err := s.journalRepo.FindByDate(ctx, userID, date)
	if err != nil || journal == nil {
		return nil, errors.New("JOURNAL_NOT_FOUND")
	}

	if req.Title != nil {
		journal.Title = req.Title
	}
	if req.Summary != nil {
		journal.Summary = req.Summary
	}
	if req.PrimaryMood != nil {
		journal.PrimaryMood = req.PrimaryMood
	}
	if req.EmotionTags != nil {
		b, _ := json.Marshal(req.EmotionTags)
		journal.EmotionTags = string(b)
	}
	if req.TopicTags != nil {
		b, _ := json.Marshal(req.TopicTags)
		journal.TopicTags = string(b)
	}

	journal.Status = "edited"
	journal.IsEdited = true

	if err := s.journalRepo.Update(ctx, journal); err != nil {
		return nil, err
	}
	return toJournalResponse(journal), nil
}

// ─────────────────────────────────────────────
// GetCalendar
// ─────────────────────────────────────────────

func (s *journalService) GetCalendar(ctx context.Context, userID string, month string) (*dto.CalendarResponse, error) {
	journals, err := s.journalRepo.FindByMonth(ctx, userID, month)
	if err != nil {
		return nil, err
	}

	days := make([]dto.CalendarDayResponse, 0, len(journals))
	streak := 0
	prevDate := time.Time{}

	for _, j := range journals {
		title := ""
		if j.Title != nil {
			title = *j.Title
		}
		mood := ""
		if j.PrimaryMood != nil {
			mood = *j.PrimaryMood
		}

		days = append(days, dto.CalendarDayResponse{
			Date:        j.Date.Format("2006-01-02"),
			Status:      j.Status,
			PrimaryMood: mood,
			MoodEmoji:   moodToEmoji(mood),
			Title:       title,
			IsEdited:    j.IsEdited,
		})

		// hitung streak
		if prevDate.IsZero() || j.Date.Sub(prevDate).Hours() == 24 {
			streak++
		} else {
			streak = 1
		}
		prevDate = j.Date
	}

	// monthly recap card — placeholder, akan diisi recap domain nanti
	recapCard := dto.MonthlyRecapCardResponse{
		Status:       "not_enough_data",
		Month:        month,
		JournalCount: len(journals),
	}
	minRequired := 3
	recapCard.MinimumRequired = &minRequired
	if len(journals) >= 3 {
		recapCard.Status = "ready_to_generate"
	}

	return &dto.CalendarResponse{
		Month:        month,
		Streak:       streak,
		Days:         days,
		MonthlyRecap: recapCard,
	}, nil
}

// ─────────────────────────────────────────────
// GetRecentSnippets — untuk hybrid memory layer 3
// ─────────────────────────────────────────────

func (s *journalService) GetRecentSnippets(ctx context.Context, userID string, limit int) ([]chatDto.RecentJournalSnippet, error) {
	journals, err := s.journalRepo.FindRecentSummarized(ctx, userID, limit)
	if err != nil {
		return nil, err
	}

	snippets := make([]chatDto.RecentJournalSnippet, 0, len(journals))
	for _, j := range journals {
		snippet := chatDto.RecentJournalSnippet{
			Date: j.Date.Format("2006-01-02"),
		}
		if j.Title != nil {
			snippet.Title = *j.Title
		}
		if j.KeyInsight != nil {
			snippet.KeyInsight = *j.KeyInsight
		}
		if j.PrimaryMood != nil {
			snippet.PrimaryMood = *j.PrimaryMood
		}
		snippets = append(snippets, snippet)
	}
	return snippets, nil
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

func (s *journalService) updateUserMemory(ctx context.Context, userID string, newJournalSummary string) {
	mem, _ := s.memoryRepo.FindByUserID(ctx, userID)
	current := ""
	if mem != nil {
		current = mem.Summary
	}
	updated, err := s.geminiMemory.UpdateUserMemory(ctx, current, newJournalSummary)
	if err != nil {
		return
	}
	_ = s.memoryRepo.Upsert(ctx, userID, updated)
}

func formatChatHistory(messages []chatEntity.ChatMessage) string {
	var sb strings.Builder
	for _, m := range messages {
		role := "User"
		if m.Role == "assistant" {
			role = "Mono"
		}
		sb.WriteString(fmt.Sprintf("%s: %s\n", role, m.Content))
	}
	return sb.String()
}

func toJournalResponse(j *entity.Journal) *dto.JournalResponse {
	var emotionTags, topicTags []string
	_ = json.Unmarshal([]byte(j.EmotionTags), &emotionTags)
	_ = json.Unmarshal([]byte(j.TopicTags), &topicTags)

	if emotionTags == nil {
		emotionTags = []string{}
	}
	if topicTags == nil {
		topicTags = []string{}
	}

	resp := &dto.JournalResponse{
		ID:                  j.ID.String(),
		UserID:              j.UserID.String(),
		Date:                j.Date.Format("2006-01-02"),
		Status:              j.Status,
		Title:               j.Title,
		Summary:             j.Summary,
		PrimaryMood:         j.PrimaryMood,
		MoodIntensity:       j.MoodIntensity,
		EmotionTags:         emotionTags,
		TopicTags:           topicTags,
		KeyInsight:          j.KeyInsight,
		SuggestedNextAction: j.SuggestedNextAction,
		Language:            j.Language,
		IsEdited:            j.IsEdited,
		SafetyFlag:          j.SafetyFlag,
		CreatedAt:           j.CreatedAt.Format(time.RFC3339),
		UpdatedAt:           j.UpdatedAt.Format(time.RFC3339),
	}

	if j.SummarizedAt != nil {
		t := j.SummarizedAt.Format(time.RFC3339)
		resp.SummarizedAt = &t
	}

	return resp
}

func moodToEmoji(mood string) string {
	m := map[string]string{
		"happy":    "😊",
		"calm":     "😌",
		"sad":      "😢",
		"angry":    "😠",
		"anxious":  "😟",
		"tired":    "😴",
		"confused": "😕",
		"unknown":  "😶",
	}
	if e, ok := m[mood]; ok {
		return e
	}
	return "😶"
}
