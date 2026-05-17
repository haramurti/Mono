package contract

import (
	"context"

	"github.com/haramurti/Mono/internal/app/users/dto"
	"github.com/haramurti/Mono/internal/app/users/entity"
)

// UserRepository — interface untuk semua DB operation User
type UserRepository interface {
	Create(ctx context.Context, user *entity.User) error
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
	FindByID(ctx context.Context, id string) (*entity.User, error)
	UpdateLastLogin(ctx context.Context, id string) error
}

// RefreshTokenRepository — interface untuk manage refresh token di DB
type RefreshTokenRepository interface {
	Save(ctx context.Context, userID string, token string) error
	Find(ctx context.Context, token string) (userID string, err error)
	Delete(ctx context.Context, token string) error
	DeleteAllByUserID(ctx context.Context, userID string) error
}

// AuthService — interface untuk semua auth use case
type AuthService interface {
	Register(ctx context.Context, req *dto.RegisterRequest) (*dto.AuthResponse, error)
	Login(ctx context.Context, req *dto.LoginRequest) (*dto.AuthResponse, error)
	RefreshToken(ctx context.Context, req *dto.RefreshTokenRequest) (*dto.RefreshTokenResponse, error)
	GetCurrentUser(ctx context.Context, userID string) (*dto.UserResponse, error)
}

// UserMemoryRepository — interface untuk manage rolling memory summary
type UserMemoryRepository interface {
	FindByUserID(ctx context.Context, userID string) (*entity.UserMemory, error)
	Upsert(ctx context.Context, userID string, summary string) error
}
