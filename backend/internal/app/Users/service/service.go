package service

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/haramurti/Mono/internal/app/users/contract"
	"github.com/haramurti/Mono/internal/app/users/dto"
	"github.com/haramurti/Mono/internal/app/users/entity"
)

type authService struct {
	userRepo   contract.UserRepository
	tokenRepo  contract.RefreshTokenRepository
	jwtSecret  string
	accessTTL  time.Duration
	refreshTTL time.Duration
}

func NewAuthService(
	userRepo contract.UserRepository,
	tokenRepo contract.RefreshTokenRepository,
) contract.AuthService {
	return &authService{
		userRepo:   userRepo,
		tokenRepo:  tokenRepo,
		jwtSecret:  os.Getenv("JWT_SECRET"),
		accessTTL:  15 * time.Minute,
		refreshTTL: 7 * 24 * time.Hour,
	}
}

// ─────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────

func (s *authService) Register(ctx context.Context, req *dto.RegisterRequest) (*dto.AuthResponse, error) {
	// cek email sudah terdaftar
	existing, _ := s.userRepo.FindByEmail(ctx, req.Email)
	if existing != nil {
		return nil, errors.New("EMAIL_ALREADY_EXISTS")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	user := &entity.User{
		ID:          uuid.New(),
		Name:        req.Name,
		Email:       req.Email,
		Password:    string(hashed),
		IsOAuth:     false,
		LastLoginAt: now,
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	return s.buildAuthResponse(ctx, user)
}

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────

func (s *authService) Login(ctx context.Context, req *dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return nil, errors.New("INVALID_CREDENTIALS")
	}

	if user.IsOAuth {
		return nil, errors.New("INVALID_CREDENTIALS") // akun google, ga punya password
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("INVALID_CREDENTIALS")
	}

	if err := s.userRepo.UpdateLastLogin(ctx, user.ID.String()); err != nil {
		return nil, err
	}
	user.LastLoginAt = time.Now()

	return s.buildAuthResponse(ctx, user)
}

// ─────────────────────────────────────────────
// RefreshToken
// ─────────────────────────────────────────────

func (s *authService) RefreshToken(ctx context.Context, req *dto.RefreshTokenRequest) (*dto.RefreshTokenResponse, error) {
	userID, err := s.tokenRepo.Find(ctx, req.RefreshToken)
	if err != nil {
		return nil, errors.New("INVALID_REFRESH_TOKEN")
	}

	// rotate: hapus token lama
	if err := s.tokenRepo.Delete(ctx, req.RefreshToken); err != nil {
		return nil, err
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil || user == nil {
		return nil, errors.New("INVALID_REFRESH_TOKEN")
	}

	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateRefreshToken()
	if err != nil {
		return nil, err
	}

	if err := s.tokenRepo.Save(ctx, user.ID.String(), refreshToken); err != nil {
		return nil, err
	}

	return &dto.RefreshTokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

// ─────────────────────────────────────────────
// GetCurrentUser
// ─────────────────────────────────────────────

func (s *authService) GetCurrentUser(ctx context.Context, userID string) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil || user == nil {
		return nil, errors.New("USER_NOT_FOUND")
	}
	res := toUserResponse(user)
	return &res, nil
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

func (s *authService) buildAuthResponse(ctx context.Context, user *entity.User) (*dto.AuthResponse, error) {
	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateRefreshToken()
	if err != nil {
		return nil, err
	}

	if err := s.tokenRepo.Save(ctx, user.ID.String(), refreshToken); err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		User:         toUserResponse(user),
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *authService) generateAccessToken(user *entity.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":  user.ID.String(),
		"name": user.Name,
		"exp":  time.Now().Add(s.accessTTL).Unix(),
		"iat":  time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *authService) generateRefreshToken() (string, error) {
	// refresh token = random UUID, disimpan di DB
	return uuid.New().String(), nil
}

func toUserResponse(u *entity.User) dto.UserResponse {
	return dto.UserResponse{
		ID:          u.ID.String(),
		Email:       u.Email,
		Name:        u.Name,
		AvatarURL:   u.AvatarURL,
		CreatedAt:   u.CreatedAt.Format(time.RFC3339),
		LastLoginAt: u.LastLoginAt.Format(time.RFC3339),
	}
}
