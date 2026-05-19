package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	journalContract "github.com/haramurti/Mono/internal/app/journal/contract"
	journalEntity "github.com/haramurti/Mono/internal/app/journal/entity"

	"github.com/haramurti/Mono/internal/app/recap/contract"
	"github.com/haramurti/Mono/internal/app/recap/dto"
	"github.com/haramurti/Mono/internal/app/recap/entity"
)

const minimumJournals = 3

type recapService struct {
	recapRepo   contract.RecapRepository
	journalRepo journalContract.JournalRepository
	generator   contract.RecapGenerator
}

func NewRecapService(
	recapRepo contract.RecapRepository,
	journalRepo journalContract.JournalRepository,
	generator contract.RecapGenerator,
) contract.RecapService {
	return &recapService{
		recapRepo:   recapRepo,
		journalRepo: journalRepo,
		generator:   generator,
	}
}

// ─────────────────────────────────────────────
// GetMonthlyRecap
// ─────────────────────────────────────────────

func (s *recapService) GetMonthlyRecap(ctx context.Context, userID string, month string) (interface{}, error) {
	// cek apakah recap sudah ada
	existing, err := s.recapRepo.FindByMonth(ctx, userID, month)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return toRecapResponse(existing), nil
	}

	// belum ada — cek jumlah journal bulan ini
	journals, err := s.journalRepo.FindByMonth(ctx, userID, month)
	if err != nil {
		return nil, err
	}

	count := len(journals)
	if count < minimumJournals {
		return dto.MonthlyRecapNotEnoughData{
			Month:           month,
			Status:          "not_enough_data",
			JournalCount:    count,
			MinimumRequired: minimumJournals,
			Message:         fmt.Sprintf("You need at least %d journal entries this month to generate a monthly recap.", minimumJournals),
		}, nil
	}

	return dto.MonthlyRecapReadyToGenerate{
		Month:           month,
		Status:          "ready_to_generate",
		JournalCount:    count,
		MinimumRequired: minimumJournals,
	}, nil
}

// ─────────────────────────────────────────────
// GenerateMonthlyRecap
// ─────────────────────────────────────────────

func (s *recapService) GenerateMonthlyRecap(ctx context.Context, userID string, req *dto.GenerateMonthlyRecapRequest) (*dto.MonthlyRecapResponse, error) {
	journals, err := s.journalRepo.FindByMonth(ctx, userID, req.Month)
	if err != nil {
		return nil, err
	}

	if len(journals) < minimumJournals {
		return nil, errors.New("NOT_ENOUGH_MONTHLY_DATA")
	}

	// format semua journal summary untuk Gemini
	journalSummaries := formatJournalSummaries(journals)

	// call Gemini
	result, err := s.generator.Generate(ctx, journalSummaries)
	if err != nil {
		return nil, fmt.Errorf("MONTHLY_RECAP_GENERATION_FAILED: %w", err)
	}

	moodDistJSON, _ := json.Marshal(result.MoodDistribution)
	emotionTagsJSON, _ := json.Marshal(result.TopEmotionTags)
	topicTagsJSON, _ := json.Marshal(result.TopTopicTags)

	userUUID, _ := uuid.Parse(userID)
	now := time.Now()

	// cek apakah sudah ada recap bulan ini (re-generate case)
	existing, _ := s.recapRepo.FindByMonth(ctx, userID, req.Month)

	if existing != nil {
		existing.Title = result.Title
		existing.Summary = result.Summary
		existing.MostFrequentMood = result.MostFrequentMood
		existing.MoodDistribution = string(moodDistJSON)
		existing.TopEmotionTags = string(emotionTagsJSON)
		existing.TopTopicTags = string(topicTagsJSON)
		existing.RecurringPattern = result.RecurringPattern
		existing.MonthlyInsight = result.MonthlyInsight
		existing.SuggestedFocusNextMonth = result.SuggestedFocusNextMonth
		existing.JournalCount = len(journals)
		existing.GeneratedAt = now
		existing.UpdatedAt = now

		if err := s.recapRepo.Update(ctx, existing); err != nil {
			return nil, err
		}
		return toRecapResponse(existing), nil
	}

	recap := &entity.MonthlyRecap{
		ID:                      uuid.New(),
		UserID:                  userUUID,
		Month:                   req.Month,
		Status:                  "generated",
		Title:                   result.Title,
		Summary:                 result.Summary,
		MostFrequentMood:        result.MostFrequentMood,
		MoodDistribution:        string(moodDistJSON),
		TopEmotionTags:          string(emotionTagsJSON),
		TopTopicTags:            string(topicTagsJSON),
		RecurringPattern:        result.RecurringPattern,
		MonthlyInsight:          result.MonthlyInsight,
		SuggestedFocusNextMonth: result.SuggestedFocusNextMonth,
		JournalCount:            len(journals),
		GeneratedAt:             now,
	}

	if err := s.recapRepo.Create(ctx, recap); err != nil {
		return nil, err
	}

	return toRecapResponse(recap), nil
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

func formatJournalSummaries(journals []journalEntity.Journal) string {
	var sb strings.Builder
	for i, j := range journals {
		title := ""
		if j.Title != nil {
			title = *j.Title
		}
		summary := ""
		if j.Summary != nil {
			summary = *j.Summary
		}
		mood := ""
		if j.PrimaryMood != nil {
			mood = *j.PrimaryMood
		}
		sb.WriteString(fmt.Sprintf(
			"[%d] Date: %s | Mood: %s | Title: %s\nSummary: %s\n\n",
			i+1, j.Date.Format("2006-01-02"), mood, title, summary,
		))
	}
	return sb.String()
}

func toRecapResponse(r *entity.MonthlyRecap) *dto.MonthlyRecapResponse {
	var moodDist map[string]int
	var emotionTags, topicTags []string

	_ = json.Unmarshal([]byte(r.MoodDistribution), &moodDist)
	_ = json.Unmarshal([]byte(r.TopEmotionTags), &emotionTags)
	_ = json.Unmarshal([]byte(r.TopTopicTags), &topicTags)

	if moodDist == nil {
		moodDist = map[string]int{}
	}
	if emotionTags == nil {
		emotionTags = []string{}
	}
	if topicTags == nil {
		topicTags = []string{}
	}

	return &dto.MonthlyRecapResponse{
		ID:                      r.ID.String(),
		UserID:                  r.UserID.String(),
		Month:                   r.Month,
		Status:                  r.Status,
		Title:                   r.Title,
		Summary:                 r.Summary,
		MostFrequentMood:        r.MostFrequentMood,
		MoodDistribution:        moodDist,
		TopEmotionTags:          emotionTags,
		TopTopicTags:            topicTags,
		RecurringPattern:        r.RecurringPattern,
		MonthlyInsight:          r.MonthlyInsight,
		SuggestedFocusNextMonth: r.SuggestedFocusNextMonth,
		JournalCount:            r.JournalCount,
		GeneratedAt:             r.GeneratedAt.Format(time.RFC3339),
		UpdatedAt:               r.UpdatedAt.Format(time.RFC3339),
	}
}
