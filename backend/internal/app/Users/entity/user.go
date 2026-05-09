package entity

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name             string
	Email            string     `gorm:"type:varchar(255);uniqueIndex;not null"         json:"email"`
	Password         string     `gorm:"type:text;not null"                             json:"-"`
	AvatarURL        string     `json:"avatar_url" gorm:"type:varchar(255)"`
	IsVerified       bool       `json:"is_verified" gorm:"type:boolean;default:false;not null"`
	IsPremium        bool       `gorm:"default:false" json:"is_premium"`
	PremiumExpiresAt *time.Time `gorm:"column:premium_expires_at" json:"premium_expires_at"`
}
