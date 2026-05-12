package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID          uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name        string         `gorm:"type:varchar(100);not null"                     json:"name"`
	Email       string         `gorm:"type:varchar(255);uniqueIndex;not null"          json:"email"`
	Password    string         `gorm:"type:text"                                      json:"-"`         // nullable: google oauth user ga punya password
	AvatarURL   *string        `gorm:"type:varchar(255)"                              json:"avatarUrl"` // nullable
	IsOAuth     bool           `gorm:"default:false;not null"                         json:"-"`         // true = login via google
	LastLoginAt time.Time      `gorm:"not null"                                       json:"lastLoginAt"`
	CreatedAt   time.Time      `                                                      json:"createdAt"`
	UpdatedAt   time.Time      `                                                      json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index"                                          json:"-"`
}
