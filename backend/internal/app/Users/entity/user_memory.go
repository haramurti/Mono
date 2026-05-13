package entity

import (
	"time"

	"github.com/google/uuid"
)

// UserMemory menyimpan rolling summary yang di-generate Gemini
// dari akumulasi journal user. Di-update tiap kali journal baru selesai.
// Ini adalah "layer 2" dari hybrid memory system.
type UserMemory struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;uniqueIndex"                 json:"userId"` // 1 user = 1 memory record
	Summary   string    `gorm:"type:text;not null"                             json:"summary"`
	UpdatedAt time.Time `                                                      json:"updatedAt"`

	// relations
	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
}
