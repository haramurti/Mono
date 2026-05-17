package database

import (
	"fmt"
	"log"

	chatEntity "github.com/haramurti/Mono/internal/app/chat/entity"
	journalEntity "github.com/haramurti/Mono/internal/app/journal/entity"
	recapEntity "github.com/haramurti/Mono/internal/app/recap/entity"
	"github.com/haramurti/Mono/internal/app/users/entity"
	userEntity "github.com/haramurti/Mono/internal/app/users/entity"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&entity.User{},
		&entity.RefreshToken{},
		&recapEntity.MonthlyRecap{},
		&chatEntity.ChatSession{},
		&chatEntity.ChatMessage{},
		&userEntity.UserMemory{},
		&journalEntity.Journal{},
	); err != nil {
		return fmt.Errorf("failed to auto migrate: %w", err) //fatalf dosent return anything
	}

	log.Println("Migration completed")
	return nil
}
