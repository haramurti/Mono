package entity

import (
	"time"

	"github.com/google/uuid"
	userEntity "github.com/haramurti/Mono/internal/app/Users/entity"
	"gorm.io/gorm"
)

type ChatSession struct {
	ID          uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID      uuid.UUID      `gorm:"type:uuid;not null;index"                       json:"userId"`
	Date        time.Time      `gorm:"type:date;not null;index"                       json:"date"`        // tanggal journaling (1 session per hari)
	IsCompleted bool           `gorm:"default:false;not null"                         json:"isCompleted"` // true = udah di-summarize
	CreatedAt   time.Time      `                                                      json:"createdAt"`
	UpdatedAt   time.Time      `                                                      json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index"                                          json:"-"`

	// relations
	User     userEntity.User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
	Messages []ChatMessage   `gorm:"foreignKey:SessionID"                          json:"-"`
}
