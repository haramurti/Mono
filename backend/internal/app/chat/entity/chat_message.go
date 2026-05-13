package entity

import (
	"time"

	"github.com/google/uuid"
)

type ChatMessage struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	SessionID uuid.UUID `gorm:"type:uuid;not null;index"                       json:"sessionId"`
	Role      string    `gorm:"type:varchar(10);not null"                      json:"role"` // "user" | "assistant"
	Content   string    `gorm:"type:text;not null"                             json:"content"`
	CreatedAt time.Time `                                                      json:"createdAt"`

	// relations
	Session ChatSession `gorm:"foreignKey:SessionID;constraint:OnDelete:CASCADE" json:"-"`
}
