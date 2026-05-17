package gemini

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"google.golang.org/genai"

	"github.com/haramurti/Mono/internal/app/recap/contract"
	"github.com/haramurti/Mono/internal/app/recap/dto"
)

const recapPrompt = `You are a journaling assistant generating a monthly reflection recap.

Based on the following daily journal summaries from this month, generate a structured monthly recap.

Respond ONLY with a valid JSON object, no markdown, no explanation:
{
  "title": "string (max 60 chars, warm and reflective, e.g. 'A Month of Finding Balance')",
  "summary": "string (3-5 sentences, second-person, overall narrative of the month)",
  "mostFrequentMood": "one of: happy|calm|sad|angry|anxious|tired|confused|unknown",
  "moodDistribution": {"mood": count, ...},
  "topEmotionTags": ["max 3 from: overwhelmed|grateful|lonely|hopeful|frustrated|proud|uncertain|relieved|stressed|motivated"],
  "topTopicTags": ["max 3 from: work|school|family|relationship|health|self_esteem|future|finance|friendship|personal_growth"],
  "recurringPattern": "string (one sentence about a recurring emotional pattern)",
  "monthlyInsight": "string (one sentence of a meaningful insight about the user's growth)",
  "suggestedFocusNextMonth": "string (one actionable focus for next month)"
}

Rules:
- Write in the same language the user journaled in (check the summaries)
- moodDistribution must only include moods that actually appeared
- Be warm, specific, and encouraging — not clinical
- recurringPattern should be observational, not judgmental

Journal summaries:
`

type recapGenerator struct {
	client *genai.Client
}

func NewRecapGenerator(client *genai.Client) contract.RecapGenerator {
	return &recapGenerator{client: client}
}

func (g *recapGenerator) Generate(ctx context.Context, journalSummaries string) (*dto.RecapGenerateResult, error) {
	prompt := recapPrompt + journalSummaries

	contents := []*genai.Content{
		{
			Role:  "user",
			Parts: []*genai.Part{{Text: prompt}},
		},
	}

	resp, err := g.client.Models.GenerateContent(ctx, "gemini-2.5-flash", contents, &genai.GenerateContentConfig{
		Temperature:     ptr(float32(0.4)),
		MaxOutputTokens: 800,
	})
	if err != nil {
		return nil, fmt.Errorf("gemini recap generation failed: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("gemini returned empty response")
	}

	raw := strings.TrimSpace(resp.Candidates[0].Content.Parts[0].Text)
	raw = strings.TrimPrefix(raw, "```json")
	raw = strings.TrimPrefix(raw, "```")
	raw = strings.TrimSuffix(raw, "```")
	raw = strings.TrimSpace(raw)

	var result dto.RecapGenerateResult
	if err := json.Unmarshal([]byte(raw), &result); err != nil {
		return nil, fmt.Errorf("failed to parse gemini recap response: %w (raw: %s)", err, raw)
	}

	return &result, nil
}
