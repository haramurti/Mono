package repository

import (
	"context"
	"fmt"
	"time"

	"gorm.io/gorm"

	"github.com/haramurti/Mono/internal/app/journal/contract"
	"github.com/haramurti/Mono/internal/app/journal/entity"
)

type journalRepository struct {
	db *gorm.DB
}

func NewJournalRepository(db *gorm.DB) contract.JournalRepository {
	return &journalRepository{db: db}
}

func (r *journalRepository) FindByDate(ctx context.Context, userID string, date string) (*entity.Journal, error) {
	var journal entity.Journal
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND date = ?", userID, date).
		First(&journal).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &journal, nil
}

func (r *journalRepository) FindByMonth(ctx context.Context, userID string, month string) ([]entity.Journal, error) {
	// month format: YYYY-MM
	start, end, err := monthRange(month)
	if err != nil {
		return nil, err
	}

	var journals []entity.Journal
	err = r.db.WithContext(ctx).
		Where("user_id = ? AND date >= ? AND date < ?", userID, start, end).
		Where("status IN ?", []string{"summarized", "edited"}).
		Order("date ASC").
		Find(&journals).Error
	return journals, err
}

func (r *journalRepository) FindRecentSummarized(ctx context.Context, userID string, limit int) ([]entity.Journal, error) {
	var journals []entity.Journal
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND status IN ?", userID, []string{"summarized", "edited"}).
		Order("date DESC").
		Limit(limit).
		Find(&journals).Error
	return journals, err
}

func (r *journalRepository) Create(ctx context.Context, journal *entity.Journal) error {
	return r.db.WithContext(ctx).Create(journal).Error
}

func (r *journalRepository) Update(ctx context.Context, journal *entity.Journal) error {
	return r.db.WithContext(ctx).Save(journal).Error
}

func (r *journalRepository) FindByChatSessionID(ctx context.Context, sessionID string) (*entity.Journal, error) {
	var journal entity.Journal
	err := r.db.WithContext(ctx).
		Where("chat_session_id = ?", sessionID).
		First(&journal).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &journal, nil
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

func monthRange(month string) (time.Time, time.Time, error) {
	start, err := time.Parse("2006-01", month)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("invalid month format, expected YYYY-MM: %w", err)
	}
	end := start.AddDate(0, 1, 0)
	return start, end, nil
}
