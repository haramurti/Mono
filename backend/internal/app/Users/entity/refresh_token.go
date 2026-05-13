package entity

import "time"

type RefreshToken struct {
	Token     string    `gorm:"primaryKey;type:varchar(255)"`
	UserID    string    `gorm:"type:uuid;not null;index"`
	ExpiresAt time.Time `gorm:"not null"`
	CreatedAt time.Time
}
