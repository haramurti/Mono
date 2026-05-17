package database

import (
	"fmt"
	"log"

	"github.com/haramurti/Mono/internal/app/Users/entity"
	recapEntity "github.com/haramurti/Mono/internal/app/recap/entity"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&entity.User{},
		&entity.RefreshToken{},
		&recapEntity.MonthlyRecap{},
	); err != nil {
		return fmt.Errorf("failed to auto migrate: %w", err) //fatalf dosent return anything
	}

	log.Println("Migration completed")
	return nil
}
