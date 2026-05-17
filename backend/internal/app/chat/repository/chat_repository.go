package repository

import (
	"context"
	"time"

	"gorm.io/gorm"

	"github.com/google/uuid"
	"github.com/haramurti/Mono/internal/app/chat/contract"
	"github.com/haramurti/Mono/internal/app/chat/entity"
	chatEntity "github.com/haramurti/Mono/internal/app/chat/entity"
	userEntity "github.com/haramurti/Mono/internal/app/users/entity"
)

// ─────────────────────────────────────────────
// ChatSession Repository
// ─────────────────────────────────────────────

type chatSessionRepository struct {
	db *gorm.DB
}

func NewChatSessionRepository(db *gorm.DB) contract.ChatSessionRepository {
	return &chatSessionRepository{db: db}
}

func (r *chatSessionRepository) FindTodayByUserID(ctx context.Context, userID string) (*entity.ChatSession, error) {
	var session chatEntity.ChatSession
	today := todayStart()

	err := r.db.WithContext(ctx).
		Where("user_id = ? AND date = ?", userID, today).
		First(&session).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *chatSessionRepository) Create(ctx context.Context, session *entity.ChatSession) error {
	return r.db.WithContext(ctx).Create(session).Error
}

func (r *chatSessionRepository) MarkCompleted(ctx context.Context, sessionID string) error {
	return r.db.WithContext(ctx).
		Model(&chatEntity.ChatSession{}).
		Where("id = ?", sessionID).
		Update("is_completed", true).Error
}

// ─────────────────────────────────────────────
// ChatMessage Repository
// ─────────────────────────────────────────────

type chatMessageRepository struct {
	db *gorm.DB
}

func NewChatMessageRepository(db *gorm.DB) contract.ChatMessageRepository {
	return &chatMessageRepository{db: db}
}

func (r *chatMessageRepository) Save(ctx context.Context, message *entity.ChatMessage) error {
	return r.db.WithContext(ctx).Create(message).Error
}

func (r *chatMessageRepository) FindBySessionID(ctx context.Context, sessionID string) ([]chatEntity.ChatMessage, error) {
	var messages []chatEntity.ChatMessage
	err := r.db.WithContext(ctx).
		Where("session_id = ?", sessionID).
		Order("created_at ASC").
		Find(&messages).Error
	return messages, err
}

func (r *chatMessageRepository) CountUserMessages(ctx context.Context, sessionID string) (int, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&chatEntity.ChatMessage{}).
		Where("session_id = ? AND role = ?", sessionID, "user").
		Count(&count).Error
	return int(count), err
}

// ─────────────────────────────────────────────
// UserMemory Repository
// ─────────────────────────────────────────────

type userMemoryRepository struct {
	db *gorm.DB
}

func NewUserMemoryRepository(db *gorm.DB) contract.UserMemoryRepository {
	return &userMemoryRepository{db: db}
}

func (r *userMemoryRepository) FindByUserID(ctx context.Context, userID string) (*userEntity.UserMemory, error) {
	var mem userEntity.UserMemory
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

	var mem userEntity.UserMemory
	return r.db.WithContext(ctx).
		Where(userEntity.UserMemory{UserID: parsedID}).
		Assign(userEntity.UserMemory{Summary: summary}).
		FirstOrCreate(&mem).Error
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

func todayStart() time.Time {
	now := time.Now()
	return time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
}

//finish chat domain
