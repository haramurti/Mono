# PRODUCT.md — Mono

## Product Name

**Mono**

## One-Line Description

Mono is an AI-guided journaling web app that helps users start journaling when they do not know what to write.

---

## 1. Product Overview

Mono is a calm AI wellbeing companion and emotional journal logger.

It helps users begin journaling through a mood picker and guided AI conversation, then turns the conversation into a structured daily journal entry. Over time, Mono helps users revisit past reflections through a calendar dashboard and understand broader emotional patterns through monthly recap.

Mono is designed for people who want to build a journaling habit, gain mind clarity, and reflect on their feelings over time without facing the friction of a blank page.

Mono is **not** a clinical mental health product and should not be positioned as a replacement for therapy, diagnosis, or professional mental health support.

---

## 2. Hackathon Context

### Theme

**Smart Digital Solution for Real World Problems**

### Selected Subtheme

**Health & Wellbeing Technology**

### Why Mono Fits

Many people want to journal for emotional clarity and self-reflection, but they struggle to start because they do not know what to write. Mono solves this with a smart, AI-guided journaling flow that lowers the barrier to reflection and helps users understand their emotions over time.

Mono is:

- **Smart**: Uses AI to guide reflection, generate summaries, and create monthly emotional recaps.
- **Functional**: Provides an end-to-end journaling flow from mood selection to saved journal entry.
- **Inclusive**: Supports users who feel unsure, confused, or unable to articulate their emotions.
- **Impactful**: Encourages self-reflection, emotional awareness, and journaling habit formation.
- **Sustainable**: Builds long-term value through calendar history, streaks, and monthly recaps.

---

## 3. Problem Statement

People often want to journal but do not know how to start.

Common pain points:

- A blank page feels intimidating.
- Users struggle to identify their emotions.
- Users may only know they feel “tired,” “bad,” or “confused,” but not why.
- Journaling feels like a task instead of a guided reflection.
- Users lose consistency because journaling apps often provide only an empty text box.
- Even after journaling, users may not notice emotional patterns across days or months.

Core problem:

> People want to journal and understand themselves better, but they do not know how to start or how to turn their reflections into meaningful insight.

---

## 4. Target Users

### Primary Target

General public, especially people in early adulthood who want to build a journaling habit and improve emotional awareness.

### Demo Persona

**Alex** is a university student or young professional.

Alex often feels mentally tired after a long day. They want to journal, but when they open a blank note, they do not know what to write. With Mono, Alex can choose a mood, answer guided questions, receive a daily reflection, and later review monthly emotional patterns.

---

## 5. Product Positioning

Mono should feel like:

- a calm companion
- a gentle reflection guide
- a personal emotional logger
- a journaling assistant

Mono should not feel like:

- a therapist
- a doctor
- a diagnosis tool
- a productivity pressure tool
- an overly cheerful chatbot

Tone principles:

- Warm
- Calm
- Minimal
- Non-judgmental
- Reflective
- Gentle
- Clear

---

## 6. Value Proposition

### Main Value Proposition

> Mono helps you start journaling when you do not know what to write.

### Extended Value Proposition

> Mono turns daily feelings into guided reflections, then turns past journals into meaningful emotional insight.

### Tagline Options

- Start with a feeling. Mono guides the rest.
- From blank thoughts to clear reflection.
- Understand today. Reflect on your month.
- Your thoughts, gently guided.
- When you do not know what to write, Mono asks the right questions.

---

## 7. Product Goals

### User Goals

Users should be able to:

1. Start journaling easily without facing a blank page.
2. Express how they feel, even when they are unsure.
3. Receive gentle AI follow-up questions.
4. Turn a short conversation into a structured journal entry.
5. Revisit past journal entries.
6. See mood indicators across a calendar.
7. Build consistency through streaks.
8. Understand monthly emotional patterns through recap.

### Business / Hackathon Goals

The product should:

1. Demonstrate a complete working MVP.
2. Show a clear real-world wellbeing problem.
3. Use AI in a meaningful and practical way.
4. Be easy to explain in a proposal and demo video.
5. Have a strong emotional story for judges.
6. Be realistic for a small team to build.

---

## 8. MVP Scope

### P0 — Core Daily Journaling Flow

These features are required for the main demo:

- Landing page
- Google OAuth or demo-auth equivalent
- Dashboard
- Mood picker
- AI-guided chat
- Daily summary generation
- Journal detail page
- Calendar update after summary

### P1 — Reflection History

These features strengthen the demo:

- Seeded past journals
- Calendar mood indicators
- Short title per journaled date
- Streak display
- Past journal detail

### P2 — Monthly Recap

This is the smart insight feature:

- Monthly recap card
- Monthly recap generation
- Monthly recap detail page
- Mood distribution
- Top emotion and topic tags
- Recurring pattern
- Monthly insight
- Suggested focus for next month

### P3 — Nice to Have

These are secondary:

- Edit journal title
- Edit journal summary
- Edit mood and tags
- Edited indicator
- Better loading states
- Retry states
- Crisis handling UI polish
- Language detection polish

---

## 9. Non-Goals / Out of Scope

The following are out of scope for the hackathon MVP:

- Mobile app
- Push notifications
- Export journal data
- Voice journaling
- Image journaling
- Community or social features
- Therapist dashboard
- Advanced clinical screening
- Complex onboarding
- Full privacy settings page
- Real-time streaming AI response
- Production-grade scheduling
- Auto-generated end-of-month recap
- Advanced AI memory system
- Advanced analytics beyond monthly recap

---

## 10. Core User Journey

### 10.1 New User Journey

1. User opens landing page.
2. User reads what Mono does.
3. User clicks `Journal Now`.
4. User logs in with Google or enters demo mode.
5. User lands on dashboard.
6. Dashboard shows seeded past journals for demo.
7. User clicks `Start Today’s Journal`.
8. User selects mood from mood picker.
9. Mono validates the user’s feeling.
10. Mono asks one reflective follow-up question.
11. User replies in free text.
12. Mono continues guiding the reflection.
13. User clicks `End & Summarize` after enough messages.
14. Mono generates a structured daily journal entry.
15. User views Journal Detail.
16. Dashboard updates with today’s mood indicator.

### 10.2 Returning User Journey

1. User opens dashboard.
2. User sees calendar with past mood indicators.
3. User sees current streak.
4. User can open a past journal.
5. User can start or continue today’s journal.
6. User can view or generate monthly recap.

---

## 11. Page Requirements

## 11.1 Landing Page

### Purpose

Introduce Mono and convert users into starting a journal.

### Required Sections

1. Hero
2. Problem statement
3. How Mono helps
4. Feature highlights
5. Safety note
6. Final CTA

### Hero Content

Should include:

- Product name: Mono
- Tagline
- Short value proposition
- CTA: `Journal Now`

### CTA Behavior

- Guest user: redirect to login.
- Logged-in user: redirect to dashboard or chat page.

For demo, redirecting to dashboard is preferred so seed data can be shown.

---

## 11.2 Dashboard

### Purpose

Give users a home base for reflection history.

### Required Components

- Calendar
- Mood emoji per journaled date
- Short title per journaled date
- Streak count
- Start or continue journal CTA
- Monthly recap card

### Calendar Date Behavior

| Date Type | Behavior |
|---|---|
| Past date with journal | Open Journal Detail |
| Past date without journal | Disabled or show toast |
| Future date | Disabled |
| Today empty | Open Chat Page |
| Today in progress | Open Chat Page |
| Today summarized or edited | Open Journal Detail |

### Empty State

If the user has no journals:

- Calendar is empty.
- Streak is `0`.
- CTA says `Start today’s journal`.
- Monthly recap card says more entries are needed.

---

## 11.3 Chat Page

### Purpose

Main guided journaling experience.

### Required Components

- Mood picker
- Chat area
- Free-text input
- `End & Summarize` button
- Summary offer card after enough messages

### Mood Picker Options

| Mood | Emoji |
|---|---|
| happy | 😊 |
| calm | 😌 |
| sad | 😢 |
| angry | 😠 |
| anxious | 😟 |
| tired | 😴 |
| confused | 😕 |
| unknown | 🌫️ |

### Chat Behavior

Mono must:

- Validate the user’s feeling first.
- Ask one follow-up question at a time.
- Keep responses short and gentle.
- Follow the user’s language.
- Avoid diagnosis.
- Avoid clinical claims.
- Help the user continue when they do not know what to write.

### Summary Rules

| Condition | Behavior |
|---|---|
| 0–2 user messages | `End & Summarize` disabled |
| 3+ user messages | `End & Summarize` enabled |
| 5+ user messages | Show summary offer card |
| User clicks summarize | Generate daily summary |

---

## 11.4 Journal Detail Page

### Purpose

Show the structured daily reflection.

### Required Fields

- Title
- Date
- Summary
- Primary mood
- Mood intensity
- Emotion tags
- Topic tags
- Key insight
- Suggested next action
- Edited indicator, if applicable

### Edit Behavior

Editable fields:

- Title
- Summary
- Primary mood
- Emotion tags
- Topic tags

On save:

- `status = edited`
- `isEdited = true`
- Show `Edited` indicator
- Do not automatically regenerate summary

Raw chat messages should not be shown in MVP Journal Detail.

---

## 11.5 Monthly Recap Card

### Purpose

Give users a quick overview of their monthly emotional patterns.

### Placement

Dashboard.

### States

| State | Condition | UI |
|---|---|---|
| `not_enough_data` | Fewer than 3 summarized/edited journals | Show message and disabled CTA |
| `ready_to_generate` | At least 3 journals, no recap yet | Show `Generate Monthly Recap` CTA |
| `generated` | Recap exists | Show title, mood emoji, preview, `View Recap` CTA |

---

## 11.6 Monthly Recap Page

### Purpose

Show a deeper reflection across one month.

### Required Fields

- Month
- Recap title
- Monthly summary
- Most frequent mood
- Mood distribution
- Top emotion tags
- Top topic tags
- Recurring pattern
- Monthly insight
- Suggested focus for next month
- Journal count

---

## 12. AI Behavior

## 12.1 AI Assistant Name

The assistant inside the app is called **Mono**.

## 12.2 Daily Chat Response Pattern

Every chat response should generally follow:

1. Empathetic validation
2. One reflective follow-up question

Example:

> That sounds overwhelming. What part of today has been staying on your mind the most?

Mono should avoid asking multiple questions in a single response.

---

## 12.3 Daily Summary Style

Daily summaries must be written in first person.

Example:

> Today I felt mentally tired because there were many things on my mind. I realized that I have been putting too much pressure on myself, and what I need most right now is to slow down and focus on one small step.

Daily summary should feel like something the user could have written after reflection.

---

## 12.4 Monthly Recap Style

Monthly recap should use gentle second-person reflective language.

Example:

> This month, you often moved between feeling tired and hopeful. Many of your reflections were about work, self-expectation, and learning to rest without guilt.

Monthly recap should not sound diagnostic or judgmental.

---

## 12.5 Language Behavior

Mono follows the user’s language.

- English input → English response
- Indonesian input → Indonesian response
- Mixed input → dominant language response

Daily summary and monthly recap should follow the dominant language of the journal content.

---

## 12.6 Past Context Behavior

Mono may reference past journal context only when useful.

Example:

> Yesterday, you wrote about feeling overwhelmed with work. Does today feel connected to that, or does it feel different?

Rules:

- Do not force past references.
- Do not mention old entries unless helpful.
- Keep language gentle.
- Avoid assumptions.

---

## 13. Safety Behavior

Mono must safely handle crisis-like content.

### Crisis-Like Input

Examples:

- User implies self-harm.
- User says they do not want to live.
- User expresses immediate danger.

### Required Response

Mono should:

1. Respond with empathy.
2. Avoid diagnosis.
3. Avoid harmful instructions.
4. Encourage contacting a trusted person, professional, or local emergency service.
5. Save the raw chat.
6. Set `safetyFlag = crisis`.
7. Ensure suggested next action is safety-oriented.

Example:

> I’m really sorry you’re feeling this way. You do not have to face this alone. If you might be in immediate danger, please contact local emergency services now. If possible, reach out to someone you trust and let them stay with you.

### Crisis Summary Rule

If `safetyFlag = crisis`, summary should not normalize or minimize the crisis.

Suggested next action should be support-oriented.

---

## 14. Data Model

## 14.1 User

```ts
type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  createdAt: string;
  lastLoginAt: string;
};
```

---

## 14.2 Journal Status

```ts
type JournalStatus =
  | "empty"
  | "in_progress"
  | "summarized"
  | "edited";
```

---

## 14.3 Journal

```ts
type Journal = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD

  status: JournalStatus;

  title: string | null;
  summary: string | null;

  primaryMood: PrimaryMood | null;
  moodIntensity: number | null; // 1-5

  emotionTags: EmotionTag[];
  topicTags: TopicTag[];

  keyInsight: string | null;
  suggestedNextAction: string | null;

  language: JournalLanguage;

  isEdited: boolean;
  safetyFlag: SafetyFlag;

  createdAt: string;
  updatedAt: string;
  summarizedAt: string | null;
};
```

---

## 14.4 Chat Message

```ts
type ChatMessage = {
  id: string;
  journalId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
```

Mood picker should be stored as structured journal data, not as a regular chat message.

---

## 14.5 Monthly Recap Status

```ts
type MonthlyRecapStatus =
  | "not_enough_data"
  | "ready_to_generate"
  | "generated";
```

---

## 14.6 Monthly Recap

```ts
type MonthlyRecap = {
  id: string;
  userId: string;
  month: string; // YYYY-MM

  status: MonthlyRecapStatus;

  title: string | null;
  summary: string | null;

  mostFrequentMood: PrimaryMood | null;
  moodDistribution: Partial<Record<PrimaryMood, number>>;

  topEmotionTags: EmotionTag[];
  topTopicTags: TopicTag[];

  recurringPattern: string | null;
  monthlyInsight: string | null;
  suggestedFocusNextMonth: string | null;

  journalCount: number;

  generatedAt: string | null;
  updatedAt: string;
};
```

---

## 14.7 Enums

```ts
type PrimaryMood =
  | "happy"
  | "calm"
  | "sad"
  | "angry"
  | "anxious"
  | "tired"
  | "confused"
  | "unknown";

type EmotionTag =
  | "overwhelmed"
  | "grateful"
  | "lonely"
  | "hopeful"
  | "frustrated"
  | "proud"
  | "uncertain"
  | "relieved"
  | "stressed"
  | "motivated";

type TopicTag =
  | "work"
  | "school"
  | "family"
  | "relationship"
  | "health"
  | "self_esteem"
  | "future"
  | "finance"
  | "friendship"
  | "personal_growth";

type JournalLanguage = "id" | "en" | "mixed" | "other";

type SafetyFlag = "none" | "crisis";
```

---

## 15. API Contract Draft

## 15.1 Get Current User

```http
GET /me
```

Returns current authenticated user.

---

## 15.2 Google OAuth Callback

```http
POST /auth/google/callback
```

Handles Google OAuth callback or token exchange.

Implementation details may be deferred.

---

## 15.3 Send Chat Message

```http
POST /chat/messages
```

### Request

```json
{
  "content": "I feel tired today.",
  "initialMood": "tired"
}
```

### Response

```json
{
  "message": {
    "id": "msg_456",
    "role": "assistant",
    "content": "That sounds really tiring. What part of today felt the heaviest?",
    "createdAt": "2026-05-10T12:00:00Z"
  },
  "actions": {
    "canSummarize": true,
    "shouldOfferSummary": false,
    "safetyFlag": "none"
  },
  "journalState": {
    "date": "2026-05-10",
    "status": "in_progress",
    "userMessageCount": 3
  }
}
```

---

## 15.4 Summarize Today’s Journal

```http
POST /journals/today/summarize
```

Generates a daily summary for today’s journal.

---

## 15.5 Get Calendar Journals

```http
GET /journals/calendar?month=2026-05
```

Returns calendar data, streak, and monthly recap card state.

---

## 15.6 Get Journal by Date

```http
GET /journals/{date}
```

Example:

```http
GET /journals/2026-05-10
```

Returns journal detail for a specific date.

---

## 15.7 Update Journal by Date

```http
PATCH /journals/{date}
```

Updates user-editable journal fields.

---

## 15.8 Get Monthly Recap

```http
GET /recaps/monthly?month=2026-05
```

Returns monthly recap state or generated recap.

---

## 15.9 Generate Monthly Recap

```http
POST /recaps/monthly/generate
```

### Request

```json
{
  "month": "2026-05"
}
```

Generates monthly recap if the selected month has at least 3 summarized/edited journals.

---

## 16. Failure and Edge Cases

### Daily Summary Generation Fails

Expected behavior:

- Show error message.
- Show retry button.
- Keep raw chat saved.
- Keep journal status as `in_progress`.
- Backend may retry in background.

### Monthly Recap Generation Fails

Expected behavior:

- Show error message.
- Show retry button.
- Do not modify existing journals.
- Do not overwrite existing recap unless new generation succeeds.

### User Sends Empty or Very Short Message

Expected behavior:

- Mono continues from context if possible.
- Mono may ask a simple grounding question.
- The conversation should not break.

Example:

> That’s okay. We can start small. What feels most present right now: your body, your thoughts, or your emotions?

### User Opens Date Without Journal

Expected behavior:

- Past date without journal: disabled or toast.
- Future date: disabled.
- Today without journal: open Chat Page.

### Today Already Has Summary

Expected behavior:

- User can view Journal Detail.
- User may choose to continue journaling.
- New messages append to the same daily thread.
- Today’s summary can be regenerated.
- Past summaries cannot be regenerated by user action.

---

## 17. Demo Strategy

### Demo Narrative

Alex wants to journal but does not know what to write. Mono helps Alex start with a mood, guides the reflection through short AI questions, and turns the conversation into a structured journal entry. Later, Alex can revisit past journal entries and view a monthly recap to understand emotional patterns.

### Recommended Demo Flow

1. Show landing page.
2. Click `Journal Now`.
3. Login or use demo user.
4. Show dashboard with seeded calendar, streak, and monthly recap card.
5. Start today’s journal.
6. Select `confused` or `tired`.
7. User says:
   > I want to journal but I don’t know what to write.
8. Mono validates and asks a follow-up.
9. User replies.
10. Mono asks another follow-up.
11. User clicks `End & Summarize`.
12. Show generated Journal Detail.
13. Return to dashboard.
14. Show today’s date updated.
15. Open a past journal.
16. Open Monthly Recap.
17. End with Mono’s value:
   > Start with one feeling. Mono guides the rest.

---

## 18. Seed Data

Seed data should be created for demo purposes.

### Suggested Past Journals

| Mood | Emoji | Title |
|---|---|---|
| calm | 😌 | A Quiet Day to Reset |
| anxious | 😟 | Trying to Understand My Worries |
| tired | 😴 | Feeling Drained but Still Moving |
| happy | 😊 | A Small Win That Made My Day |
| confused | 😕 | Still Figuring Things Out |
| tired | 😴 | Learning to Rest Without Guilt |
| calm | 😌 | Not Everything Needed to Be Solved Today |

### Suggested Seed Monthly Recap

Title:

> A Month of Learning to Slow Down

Summary:

> This month, you often moved between feeling tired, anxious, and calm. Many of your reflections were about work, self-expectation, and learning to rest without guilt. A recurring pattern was that you felt most overwhelmed when trying to handle everything at once.

Most frequent mood:

> tired 😴

Top emotion tags:

> overwhelmed, uncertain, relieved

Top topic tags:

> work, self_esteem, personal_growth

---

## 19. Acceptance Criteria

### Core MVP

- User can access landing page.
- User can start journaling from CTA.
- User can login with Google or demo-auth equivalent.
- User can view dashboard.
- Dashboard shows seeded past journals.
- Dashboard shows streak.
- Dashboard shows monthly recap card.
- User can start today’s journal.
- User can select mood from mood picker.
- User can chat with Mono.
- Mono validates and asks one follow-up question.
- User cannot manually summarize before 3 user messages.
- User can summarize after 3 user messages.
- Summary offer card appears after 5 user messages.
- Daily summary is generated and saved.
- Journal detail displays structured reflection.
- Dashboard calendar updates after summary.
- User can open past journal detail.
- User can generate or view monthly recap.
- Monthly recap requires at least 3 summarized/edited journals.
- Monthly recap displays emotional patterns and suggested focus.

### Secondary

- User can edit journal title.
- User can edit journal summary.
- User can edit mood and tags.
- Edited journal shows indicator.
- Crisis-like input receives safe response.
- Retry states exist for daily summary and monthly recap failures.

---

## 20. Success Metrics

For hackathon evaluation, success can be demonstrated qualitatively through:

- User can complete a full journaling flow.
- User can start without needing to write from a blank page.
- AI provides relevant follow-up questions.
- Daily summary feels reflective and personal.
- Calendar makes past reflection visible.
- Monthly recap shows meaningful patterns.
- Product clearly fits Health & Wellbeing Technology.

Potential future metrics:

- Daily journal completion rate
- Weekly active journaling users
- Average journal sessions per user
- Monthly recap generation rate
- Streak retention
- User satisfaction after summary generation

---

## 21. Technical Assumptions

Technical details are intentionally lightweight for the product spec.

Known assumptions:

- Frontend uses Next.js.
- Backend uses Golang.
- FE and BE use contract-driven development.
- Google OAuth is used for authentication.
- AI calls are handled through backend.
- Journal data is persisted.
- Calendar and monthly recap data are generated from persisted journals.

Deferred decisions:

- Deployment platform
- Database choice
- Auth session strategy
- AI provider
- Cron/job implementation
- Logging and observability
- Rate limiting
- Production-grade security hardening

---

## 22. Final Product Summary

Mono is a guided journaling platform for people who want to reflect but do not know where to start.

The product transforms a simple mood selection and short conversation into a structured daily journal. Over time, Mono helps users revisit past reflections and understand broader emotional patterns through monthly recap.

The core product promise is:

> Start with a feeling. Mono guides the rest.
