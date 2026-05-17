package repository

import (
	"context"
	"time"

	"gorm.io/gorm"

	"github.com/google/uuid"
	"github.com/haramurti/Mono/internal/app/Users/contract"
	"github.com/haramurti/Mono/internal/app/Users/entity"
)

// ─────────────────────────────────────────────
// User Repository
// ─────────────────────────────────────────────

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) contract.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *entity.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByID(ctx context.Context, id string) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) UpdateLastLogin(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).
		Model(&entity.User{}).
		Where("id = ?", id).
		Update("last_login_at", time.Now()).Error
}

// ─────────────────────────────────────────────
// Refresh Token Repository
// ─────────────────────────────────────────────

type refreshTokenRepository struct {
	db  *gorm.DB
	ttl time.Duration
}

func NewRefreshTokenRepository(db *gorm.DB) contract.RefreshTokenRepository {
	return &refreshTokenRepository{
		db:  db,
		ttl: 7 * 24 * time.Hour,
	}
}

func (r *refreshTokenRepository) Save(ctx context.Context, userID string, token string) error {
	rt := entity.RefreshToken{
		Token:     token,
		UserID:    userID,
		ExpiresAt: time.Now().Add(r.ttl),
	}
	return r.db.WithContext(ctx).Create(&rt).Error
}

func (r *refreshTokenRepository) Find(ctx context.Context, token string) (string, error) {
	var rt entity.RefreshToken
	err := r.db.WithContext(ctx).
		Where("token = ? AND expires_at > ?", token, time.Now()).
		First(&rt).Error
	if err != nil {
		return "", err
	}
	return rt.UserID, nil
}

func (r *refreshTokenRepository) Delete(ctx context.Context, token string) error {
	return r.db.WithContext(ctx).
		Where("token = ?", token).
		Delete(&entity.RefreshToken{}).Error
}

func (r *refreshTokenRepository) DeleteAllByUserID(ctx context.Context, userID string) error {
	return r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Delete(&entity.RefreshToken{}).Error
}

// tambah di bawah refreshTokenRepository

type userMemoryRepository struct {
	db *gorm.DB
}

func NewUserMemoryRepository(db *gorm.DB) contract.UserMemoryRepository {
	return &userMemoryRepository{db: db}
}

func (r *userMemoryRepository) FindByUserID(ctx context.Context, userID string) (*entity.UserMemory, error) {
	var mem entity.UserMemory
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		First(&mem).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &mem, nil
}

func (r *userMemoryRepository) Upsert(ctx context.Context, userID string, summary string) error {
	parsedID, err := uuid.Parse(userID)
	if err != nil {
		return err
	}

	var mem entity.UserMemory
	return r.db.WithContext(ctx).
		Where(entity.UserMemory{UserID: parsedID}).
		Assign(entity.UserMemory{Summary: summary}).
		FirstOrCreate(&mem).Error
}
