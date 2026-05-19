package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/haramurti/Mono/internal/app/chat/contract"
	"github.com/haramurti/Mono/internal/app/chat/dto"
	"github.com/haramurti/Mono/internal/app/chat/entity"
	"github.com/haramurti/Mono/internal/infra/gemini"
)

type chatService struct {
	sessionRepo contract.ChatSessionRepository
	messageRepo contract.ChatMessageRepository
	memoryRepo  contract.UserMemoryRepository
	gemini      contract.GeminiClient

	// journal repo untuk ambil recent journals (layer 3)
	// akan di-inject dari journal domain nanti
	getRecentJournals func(ctx context.Context, userID string, limit int) ([]dto.RecentJournalSnippet, error)
}

func NewChatService(
	sessionRepo contract.ChatSessionRepository,
	messageRepo contract.ChatMessageRepository,
	memoryRepo contract.UserMemoryRepository,
	geminiClient contract.GeminiClient,
	getRecentJournals func(ctx context.Context, userID string, limit int) ([]dto.RecentJournalSnippet, error),
) contract.ChatService {
	return &chatService{
		sessionRepo:       sessionRepo,
		messageRepo:       messageRepo,
		memoryRepo:        memoryRepo,
		gemini:            geminiClient,
		getRecentJournals: getRecentJournals,
	}
}

func (s *chatService) SendMessage(ctx context.Context, userID string, req *dto.SendMessageRequest) (*dto.SendMessageResponse, error) {
	// 1. get atau create session hari ini
	session, err := s.getOrCreateSession(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get session: %w", err)
	}

	// 2. simpan pesan user ke DB
	userMsg := &entity.ChatMessage{
		ID:        uuid.New(),
		SessionID: session.ID,
		Role:      "user",
		Content:   req.Content,
		CreatedAt: time.Now(),
	}
	if err := s.messageRepo.Save(ctx, userMsg); err != nil {
		return nil, fmt.Errorf("failed to save user message: %w", err)
	}

	// 3. safety check
	safetyFlag := gemini.DetectSafetyFlag(req.Content)

	// 4. build hybrid memory context
	geminiCtx, err := s.buildGeminiContext(ctx, userID, session.ID.String())
	if err != nil {
		return nil, fmt.Errorf("failed to build context: %w", err)
	}

	// 5. call Gemini — pesan user sudah ada di sessionMessages dari DB
	// jadi kita kirim pesan baru terpisah
	reply, err := s.gemini.Chat(ctx, geminiCtx, req.Content)
	if err != nil {
		return nil, fmt.Errorf("failed to get AI response: %w", err)
	}

	// 6. simpan reply Gemini ke DB
	assistantMsg := &entity.ChatMessage{
		ID:        uuid.New(),
		SessionID: session.ID,
		Role:      "assistant",
		Content:   reply,
		CreatedAt: time.Now(),
	}
	if err := s.messageRepo.Save(ctx, assistantMsg); err != nil {
		return nil, fmt.Errorf("failed to save assistant message: %w", err)
	}

	// 7. hitung user message count untuk actions
	userMsgCount, err := s.messageRepo.CountUserMessages(ctx, session.ID.String())
	if err != nil {
		return nil, err
	}

	return &dto.SendMessageResponse{
		Message: dto.ChatMessageResponse{
			ID:        assistantMsg.ID.String(),
			JournalID: session.ID.String(),
			Role:      "assistant",
			Content:   reply,
			CreatedAt: assistantMsg.CreatedAt.Format(time.RFC3339),
		},
		Actions: dto.ChatActionsResponse{
			CanSummarize:       userMsgCount >= 3,
			ShouldOfferSummary: userMsgCount >= 7,
			SafetyFlag:         safetyFlag,
		},
		JournalState: dto.JournalStateResponse{
			Date:             session.Date.Format("2006-01-02"),
			Status:           journalStatus(session.IsCompleted, userMsgCount),
			UserMessageCount: userMsgCount,
		},
	}, nil
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

func (s *chatService) getOrCreateSession(ctx context.Context, userID string) (*entity.ChatSession, error) {
	session, err := s.sessionRepo.FindTodayByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if session != nil {
		return session, nil
	}

	// belum ada sesi hari ini, buat baru
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid userID: %w", err)
	}

	newSession := &entity.ChatSession{
		ID:          uuid.New(),
		UserID:      userUUID,
		Date:        gemini.TodayDate(),
		IsCompleted: false,
	}
	if err := s.sessionRepo.Create(ctx, newSession); err != nil {
		return nil, err
	}
	return newSession, nil
}

func (s *chatService) buildGeminiContext(ctx context.Context, userID, sessionID string) (dto.GeminiContext, error) {
	var geminiCtx dto.GeminiContext

	// layer 2: user memory summary
	memory, err := s.memoryRepo.FindByUserID(ctx, userID)
	if err != nil {
		return geminiCtx, err
	}
	if memory != nil {
		geminiCtx.UserMemorySummary = memory.Summary
	}

	// layer 3: recent journal highlights (3 terakhir)
	if s.getRecentJournals != nil {
		snippets, err := s.getRecentJournals(ctx, userID, 3)
		if err == nil {
			geminiCtx.RecentJournals = snippets
		}
	}

	// layer 1: semua pesan sesi hari ini (sebelum pesan baru)
	messages, err := s.messageRepo.FindBySessionID(ctx, sessionID)
	if err != nil {
		return geminiCtx, err
	}
	geminiCtx.SessionMessages = messages

	return geminiCtx, nil
}

func journalStatus(isCompleted bool, userMsgCount int) string {
	if isCompleted {
		return "summarized"
	}
	if userMsgCount == 0 {
		return "empty"
	}
	return "in_progress"
}

func (s *chatService) GetTodayMessages(ctx context.Context, userID string) (*dto.GetChatMessagesResponse, error) {
	session, err := s.sessionRepo.FindTodayByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	// belum ada session hari ini — return empty
	if session == nil {
		return &dto.GetChatMessagesResponse{
			Messages: []dto.ChatMessageResponse{},
			JournalState: dto.JournalStateResponse{
				Date:             time.Now().Format("2006-01-02"),
				Status:           "empty",
				UserMessageCount: 0,
			},
		}, nil
	}

	messages, err := s.messageRepo.FindBySessionID(ctx, session.ID.String())
	if err != nil {
		return nil, err
	}

	msgResponses := make([]dto.ChatMessageResponse, 0, len(messages))
	for _, m := range messages {
		msgResponses = append(msgResponses, dto.ChatMessageResponse{
			ID:        m.ID.String(),
			JournalID: session.ID.String(),
			Role:      m.Role,
			Content:   m.Content,
			CreatedAt: m.CreatedAt.Format(time.RFC3339),
		})
	}

	userMsgCount, _ := s.messageRepo.CountUserMessages(ctx, session.ID.String())

	return &dto.GetChatMessagesResponse{
		Messages: msgResponses,
		JournalState: dto.JournalStateResponse{
			Date:             session.Date.Format("2006-01-02"),
			Status:           journalStatus(session.IsCompleted, userMsgCount),
			UserMessageCount: userMsgCount,
		},
	}, nil
}
