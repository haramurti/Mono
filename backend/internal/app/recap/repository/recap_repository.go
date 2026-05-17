package repository

import (
	"context"

	"gorm.io/gorm"

	"github.com/haramurti/Mono/internal/app/recap/contract"
	"github.com/haramurti/Mono/internal/app/recap/entity"
)

type recapRepository struct {
	db *gorm.DB
}

func NewRecapRepository(db *gorm.DB) contract.RecapRepository {
	return &recapRepository{db: db}
}

func (r *recapRepository) FindByMonth(ctx context.Context, userID string, month string) (*entity.MonthlyRecap, error) {
	var recap entity.MonthlyRecap
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND month = ?", userID, month).
		First(&recap).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &recap, nil
}

func (r *recapRepository) Create(ctx context.Context, recap *entity.MonthlyRecap) error {
	return r.db.WithContext(ctx).Create(recap).Error
}

func (r *recapRepository) Update(ctx context.Context, recap *entity.MonthlyRecap) error {
	return r.db.WithContext(ctx).Save(recap).Error
}
