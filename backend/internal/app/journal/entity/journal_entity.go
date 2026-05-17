package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Journal struct {
	ID                 uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID             uuid.UUID      `gorm:"type:uuid;not null;index"                       json:"userId"`
	ChatSessionID      uuid.UUID      `gorm:"type:uuid;not null;uniqueIndex"                 json:"chatSessionId"` // 1 session → 1 journal
	Date               time.Time      `gorm:"type:date;not null;index"                       json:"date"`
	Status             string         `gorm:"type:varchar(20);not null;default:'in_progress'" json:"status"` // empty | in_progress | summarized | edited
	Title              *string        `gorm:"type:varchar(255)"                              json:"title"`
	Summary            *string        `gorm:"type:text"                                      json:"summary"`
	PrimaryMood        *string        `gorm:"type:varchar(20)"                               json:"primaryMood"`
	MoodIntensity      *int           `gorm:"type:smallint"                                  json:"moodIntensity"`
	EmotionTags        string         `gorm:"type:text;default:'[]'"                         json:"emotionTags"`  // JSON array string
	TopicTags          string         `gorm:"type:text;default:'[]'"                         json:"topicTags"`    // JSON array string
	KeyInsight         *string        `gorm:"type:text"                                      json:"keyInsight"`
	SuggestedNextAction *string       `gorm:"type:text"                                      json:"suggestedNextAction"`
	Language           string         `gorm:"type:varchar(10);not null;default:'en'"         json:"language"` // en | id | mixed | other
	IsEdited           bool           `gorm:"default:false;not null"                         json:"isEdited"`
	SafetyFlag         string         `gorm:"type:varchar(10);not null;default:'none'"       json:"safetyFlag"` // none | crisis
	SummarizedAt       *time.Time     `                                                      json:"summarizedAt"`
	CreatedAt          time.Time      `                                                      json:"createdAt"`
	UpdatedAt          time.Time      `                                                      json:"updatedAt"`
	DeletedAt          gorm.DeletedAt `gorm:"index"                                          json:"-"`
}
