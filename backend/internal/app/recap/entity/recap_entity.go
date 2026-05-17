package entity

import (
	"time"

	"github.com/haramurti/Mono/internal/app/Users/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MonthlyRecap struct {
	ID                      uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID                  uuid.UUID      `gorm:"type:uuid;not null;index"                       json:"userId"`
	Month                   string         `gorm:"type:varchar(7);not null;index"                 json:"month"` // YYYY-MM, unique per user
	Status                  string         `gorm:"type:varchar(20);not null;default:'generated'"  json:"status"`
	Title                   string         `gorm:"type:varchar(255);not null"                     json:"title"`
	Summary                 string         `gorm:"type:text;not null"                             json:"summary"`
	MostFrequentMood        string         `gorm:"type:varchar(20);not null"                      json:"mostFrequentMood"`
	MoodDistribution        string         `gorm:"type:text;not null;default:'{}'"                json:"moodDistribution"` // JSON map[string]int
	TopEmotionTags          string         `gorm:"type:text;not null;default:'[]'"                json:"topEmotionTags"`   // JSON []string
	TopTopicTags            string         `gorm:"type:text;not null;default:'[]'"                json:"topTopicTags"`     // JSON []string
	RecurringPattern        string         `gorm:"type:text;not null"                             json:"recurringPattern"`
	MonthlyInsight          string         `gorm:"type:text;not null"                             json:"monthlyInsight"`
	SuggestedFocusNextMonth string         `gorm:"type:text;not null"                             json:"suggestedFocusNextMonth"`
	JournalCount            int            `gorm:"not null"                                       json:"journalCount"`
	GeneratedAt             time.Time      `gorm:"not null"                                       json:"generatedAt"`
	UpdatedAt               time.Time      `                                                      json:"updatedAt"`
	DeletedAt               gorm.DeletedAt `gorm:"index"                                          json:"-"`

	// relations
	User entity.User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
}
