package gemini

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"google.golang.org/genai"

	"github.com/haramurti/Mono/internal/app/chat/contract"
	"github.com/haramurti/Mono/internal/app/chat/dto"
)

const model = "gemini-2.5-flash"

const systemPrompt = `You are Mono, a warm and empathetic AI journaling companion.
Your role is to help users reflect on their day through natural conversation.

Guidelines:
- Always respond with empathy and validation first, then ask ONE follow-up question
- Keep responses concise (2-4 sentences max)
- Ask open-ended, reflective questions — not yes/no questions
- Never diagnose, give medical advice, or be dismissive
- If user shows signs of crisis (self-harm, suicidal ideation), respond with care and suggest professional help
- Match the user's language (Indonesian or English)
- Feel like a friend who genuinely remembers and cares, not a therapist form

Remember: your goal is to help users articulate their feelings, not to solve their problems.`

type geminiClient struct {
	client *genai.Client
}

func NewGeminiClient() (contract.GeminiClient, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY is not set")
	}

	client, err := genai.NewClient(context.Background(), &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create gemini client: %w", err)
	}

	return &geminiClient{client: client}, nil
}

// ─────────────────────────────────────────────
// Chat — core method, inject hybrid memory context
// ─────────────────────────────────────────────

func (g *geminiClient) Chat(ctx context.Context, geminiCtx dto.GeminiContext, userMessage string) (string, error) {
	contents := buildContents(geminiCtx, userMessage)

	resp, err := g.client.Models.GenerateContent(ctx, model, contents, &genai.GenerateContentConfig{
		SystemInstruction: &genai.Content{
			Parts: []*genai.Part{
				{Text: buildSystemWithMemory(geminiCtx)},
			},
		},
		Temperature:     ptr(float32(0.8)),
		MaxOutputTokens: 300,
	})
	if err != nil {
		return "", fmt.Errorf("gemini generate failed: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("gemini returned empty response")
	}

	return resp.Candidates[0].Content.Parts[0].Text, nil
}

// ─────────────────────────────────────────────
// UpdateUserMemory — generate rolling summary baru
// ─────────────────────────────────────────────

func (g *geminiClient) UpdateUserMemory(ctx context.Context, currentSummary string, newJournalContent string) (string, error) {
	prompt := buildMemoryUpdatePrompt(currentSummary, newJournalContent)

	contents := []*genai.Content{
		{
			Role:  "user",
			Parts: []*genai.Part{{Text: prompt}},
		},
	}

	resp, err := g.client.Models.GenerateContent(ctx, model, contents, &genai.GenerateContentConfig{
		Temperature:     ptr(float32(0.3)), // lebih deterministik untuk summary
		MaxOutputTokens: 400,
	})
	if err != nil {
		return "", fmt.Errorf("gemini memory update failed: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return currentSummary, nil // fallback ke summary lama
	}

	return resp.Candidates[0].Content.Parts[0].Text, nil
}

// ─────────────────────────────────────────────
// Context Builders
// ─────────────────────────────────────────────

// buildSystemWithMemory inject layer 2 + layer 3 ke system instruction
func buildSystemWithMemory(geminiCtx dto.GeminiContext) string {
	var sb strings.Builder
	sb.WriteString(systemPrompt)

	// layer 2: user memory summary
	if geminiCtx.UserMemorySummary != "" {
		sb.WriteString("\n\n--- What you know about this user ---\n")
		sb.WriteString(geminiCtx.UserMemorySummary)
	}

	// layer 3: recent journal highlights
	if len(geminiCtx.RecentJournals) > 0 {
		sb.WriteString("\n\n--- Recent journal highlights ---\n")
		for _, j := range geminiCtx.RecentJournals {
			sb.WriteString(fmt.Sprintf(
				"[%s] %s — Mood: %s. Insight: %s\n",
				j.Date, j.Title, j.PrimaryMood, j.KeyInsight,
			))
		}
	}

	return sb.String()
}

// buildContents convert session messages + pesan baru ke format Gemini
// ini adalah layer 1: full chat history hari ini
func buildContents(geminiCtx dto.GeminiContext, userMessage string) []*genai.Content {
	contents := make([]*genai.Content, 0, len(geminiCtx.SessionMessages)+1)

	for _, msg := range geminiCtx.SessionMessages {
		role := geminiRole(msg.Role)
		contents = append(contents, &genai.Content{
			Role:  role,
			Parts: []*genai.Part{{Text: msg.Content}},
		})
	}

	// tambah pesan baru dari user
	contents = append(contents, &genai.Content{
		Role:  "user",
		Parts: []*genai.Part{{Text: userMessage}},
	})

	return contents
}

func buildMemoryUpdatePrompt(currentSummary, newJournalContent string) string {
	var sb strings.Builder
	sb.WriteString("You are updating a concise memory summary of a journaling user.\n\n")

	if currentSummary != "" {
		sb.WriteString("Current summary:\n")
		sb.WriteString(currentSummary)
		sb.WriteString("\n\n")
	}

	sb.WriteString("New journal entry to incorporate:\n")
	sb.WriteString(newJournalContent)
	sb.WriteString("\n\n")
	sb.WriteString(`Generate an updated summary (max 5 sentences) that captures:
- Recurring emotional patterns and themes
- Topics the user often talks about
- Key insights or growth the user has shown
- Communication style preferences

Write in second person ("You often...", "You tend to...").
Be specific but concise. Do not mention dates.`)

	return sb.String()
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

func geminiRole(role string) string {
	if role == "user" {
		return "user"
	}
	return "model" // Gemini pakai "model" bukan "assistant"
}

func ptr[T any](v T) *T {
	return &v
}

// DetectSafetyFlag cek apakah ada kata-kata crisis dalam pesan user
// simple keyword check — bisa diganti ML classifier nanti
func DetectSafetyFlag(message string) string {
	crisisKeywords := []string{
		"bunuh diri", "mau mati", "tidak mau hidup", "ingin mengakhiri",
		"suicide", "kill myself", "end my life", "don't want to live",
	}
	lower := strings.ToLower(message)
	for _, kw := range crisisKeywords {
		if strings.Contains(lower, kw) {
			return "crisis"
		}
	}
	return "none"
}

// TodayDate return tanggal hari ini dalam format YYYY-MM-DD di timezone Jakarta
func TodayDate() time.Time {
	loc, _ := time.LoadLocation("Asia/Jakarta")
	now := time.Now().In(loc)
	return time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
}
