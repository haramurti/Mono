package gemini

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"google.golang.org/genai"

	"github.com/haramurti/Mono/internal/app/journal/contract"
	"github.com/haramurti/Mono/internal/app/journal/dto"
)

const summarizePrompt = `You are a journaling assistant. Based on the following conversation between a user and their AI journaling companion, generate a structured daily journal entry.

Respond ONLY with a valid JSON object, no markdown, no explanation. Use this exact structure:
{
  "title": "string (max 60 chars, first-person, reflective)",
  "summary": "string (2-4 sentences, first-person, what the user felt and realized today)",
  "primaryMood": "one of: happy|calm|sad|angry|anxious|tired|confused|unknown",
  "moodIntensity": number (1-5),
  "emotionTags": ["array of: overwhelmed|grateful|lonely|hopeful|frustrated|proud|uncertain|relieved|stressed|motivated"],
  "topicTags": ["array of: work|school|family|relationship|health|self_esteem|future|finance|friendship|personal_growth"],
  "keyInsight": "string (one sentence, the main thing the user realized)",
  "suggestedNextAction": "string (one actionable suggestion for tomorrow)",
  "language": "id|en|mixed|other",
  "safetyFlag": "none|crisis"
}

Rules:
- Write summary and keyInsight in the same language the user used
- safetyFlag = "crisis" only if user expressed self-harm or suicidal ideation
- Keep emotionTags and topicTags to max 3 each
- moodIntensity: 1 = very mild, 5 = very intense

Conversation:
`

type journalSummarizer struct {
	client *genai.Client
}

func NewJournalSummarizer(client *genai.Client) contract.JournalSummarizer {
	return &journalSummarizer{client: client}
}

func (s *journalSummarizer) Summarize(ctx context.Context, chatHistory string) (*dto.SummarizeResult, error) {
	prompt := summarizePrompt + chatHistory

	contents := []*genai.Content{
		{
			Role:  "user",
			Parts: []*genai.Part{{Text: prompt}},
		},
	}

	resp, err := s.client.Models.GenerateContent(ctx, "gemini-2.5-flash", contents, &genai.GenerateContentConfig{
		Temperature:     ptr(float32(0.3)), // deterministik untuk structured output
		MaxOutputTokens: 600,
	})
	if err != nil {
		return nil, fmt.Errorf("gemini summarize failed: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("gemini returned empty response")
	}

	raw := resp.Candidates[0].Content.Parts[0].Text

	// strip markdown fences kalau ada
	raw = strings.TrimSpace(raw)
	raw = strings.TrimPrefix(raw, "```json")
	raw = strings.TrimPrefix(raw, "```")
	raw = strings.TrimSuffix(raw, "```")
	raw = strings.TrimSpace(raw)

	var result dto.SummarizeResult
	if err := json.Unmarshal([]byte(raw), &result); err != nil {
		return nil, fmt.Errorf("failed to parse gemini response: %w (raw: %s)", err, raw)
	}

	return &result, nil
}
