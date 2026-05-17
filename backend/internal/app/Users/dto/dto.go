package dto

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

type RegisterRequest struct {
	Name     string `json:"name"     validate:"required,min=1,max=100"`
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" validate:"required"`
}

type GoogleOAuthRequest struct {
	IDToken string `json:"idToken" validate:"required"`
}

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

type UserResponse struct {
	ID          string  `json:"id"`
	Email       string  `json:"email"`
	Name        string  `json:"name"`
	AvatarURL   *string `json:"avatarUrl"`
	CreatedAt   string  `json:"createdAt"`
	LastLoginAt string  `json:"lastLoginAt"`
}

type AuthResponse struct {
	User         UserResponse `json:"user"`
	AccessToken  string       `json:"accessToken"`
	RefreshToken string       `json:"refreshToken"`
}

type RefreshTokenResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}
