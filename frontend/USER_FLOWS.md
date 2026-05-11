# Mono — Possible User Flows

This document describes possible user flows for **Mono**, an AI-guided journaling web app.  
The flows are aligned with the current MVP product spec, including daily guided journaling, dashboard reflection, journal detail, monthly recap, and key edge cases.

---

## 1. Scope

Mono helps users:

- Start journaling through a mood picker and AI-guided conversation.
- Turn daily conversations into first-person journal summaries.
- Revisit past journal entries through a calendar dashboard.
- Understand broader emotional patterns through monthly recap.
- Build consistency through streaks.

Mono is positioned as a calm wellbeing companion and emotional logger, not as a clinical mental health product.

---

## 2. Core Entities Referenced in Flows

### Journal Status

A daily journal can have one of the following statuses:

| Status | Meaning |
|---|---|
| `empty` | No chat exists for the date |
| `in_progress` | Chat exists, but no summary has been generated |
| `summarized` | AI summary exists |
| `edited` | User manually edited title, summary, mood, or tags |

### Monthly Recap Status

A monthly recap can have one of the following statuses:

| Status | Meaning |
|---|---|
| `not_enough_data` | Fewer than 3 summarized/edited journals exist in the month |
| `ready_to_generate` | At least 3 summarized/edited journals exist, but recap has not been generated |
| `generated` | Monthly recap exists and can be viewed |

### Mood Options

| Mood | Emoji |
|---|---|
| `happy` | 😊 |
| `calm` | 😌 |
| `sad` | 😢 |
| `angry` | 😠 |
| `anxious` | 😟 |
| `tired` | 😴 |
| `confused` | 😕 |
| `unknown` | 🌫️ |

---

# 3. Primary Flow: First-Time User Starts Journaling

## Goal

A new user opens Mono, understands the product, logs in, and starts their first guided journal.

## Actors

- Guest user
- Mono system
- Google OAuth provider

## Preconditions

- User is not logged in.
- User has no active session.

## Flow

1. User opens the landing page.
2. Landing page shows:
   - Product name: Mono
   - Value proposition
   - Problem statement
   - How Mono helps
   - Key features
   - Safety note
   - CTA: `Journal Now`
3. User clicks `Journal Now`.
4. System checks auth state.
5. Since user is not logged in, system redirects user to Google OAuth.
6. User completes Google OAuth.
7. System creates or retrieves the user profile.
8. System redirects user to dashboard.
9. Dashboard shows:
   - Calendar
   - Streak
   - Monthly recap card
   - CTA: `Start Today’s Journal`
10. User clicks `Start Today’s Journal`.
11. System opens Chat Page.
12. Chat Page shows mood picker.
13. User selects a mood.
14. System stores selected mood as structured journal data for today.
15. Mono responds with empathetic validation and one follow-up question.
16. Journal status becomes `in_progress`.

## Expected Result

User successfully starts a guided journaling session without facing a blank page.

---

# 4. Primary Flow: Daily Guided Journaling and Summary

## Goal

User completes a daily journaling session and generates a structured journal summary.

## Actors

- Logged-in user
- Mono AI assistant
- Backend system

## Preconditions

- User is logged in.
- Today’s journal status is `empty` or `in_progress`.
- User is on Chat Page.

## Flow

1. User selects an initial mood from mood picker if not already selected.
2. User sends a free-text message.
3. Backend saves user message into today’s daily journal thread.
4. Backend sends relevant context to AI.
5. Mono returns:
   - Empathetic validation
   - One reflective follow-up question
6. Backend saves assistant message.
7. FE receives:
   - Assistant message
   - `canSummarize`
   - `shouldOfferSummary`
   - `safetyFlag`
   - journal state
8. User continues replying.
9. If user has sent fewer than 3 messages:
   - `End & Summarize` remains disabled.
10. Once user has sent at least 3 messages:
   - `End & Summarize` becomes enabled.
11. Once user has sent at least 5 messages:
   - FE shows a separate summary offer card:
     - `Summarize`
     - `Keep Journaling`
12. User clicks `End & Summarize` or `Summarize`.
13. Backend generates structured daily summary.
14. Backend saves summary data:
   - title
   - first-person summary
   - primary mood
   - mood intensity
   - emotion tags
   - topic tags
   - key insight
   - suggested next action
   - language
   - safety flag
15. Journal status becomes `summarized`.
16. User is shown Journal Detail Page.

## Expected Result

User receives a reflective first-person journal entry generated from the chat.

---

# 5. Flow: User Wants to Keep Journaling Instead of Summarizing

## Goal

User continues the conversation after Mono suggests summarizing.

## Preconditions

- User has sent at least 5 messages.
- `shouldOfferSummary = true`.

## Flow

1. FE displays summary offer card.
2. User clicks `Keep Journaling`.
3. Summary card is dismissed.
4. Chat input remains active.
5. User sends another message.
6. Mono continues with validation and a follow-up question.
7. `End & Summarize` remains available.

## Expected Result

User is not forced to end the session and can continue journaling.

---

# 6. Flow: User Tries to Summarize Too Early

## Goal

Prevent low-quality explicit summary generation when there is not enough conversation.

## Preconditions

- User is in Chat Page.
- User has sent fewer than 3 messages.

## Flow

1. User sees `End & Summarize` button disabled.
2. User cannot click the button.
3. FE may show helper text:
   - “Write a little more before summarizing.”
4. Mono continues guiding the user through follow-up questions.

## Expected Result

User cannot manually summarize before enough context exists.

## Exception

End-of-day internal job may summarize even when fewer than 3 messages exist, but this is not user-triggered.

---

# 7. Flow: User Opens Dashboard with Seeded Past Journals

## Goal

Show that Mono supports reflection over time.

## Preconditions

- User is logged in.
- Seeded past journal data exists for demo user.

## Flow

1. User opens dashboard.
2. System fetches calendar data for selected month.
3. Dashboard displays:
   - Calendar
   - Mood emoji indicators on journaled dates
   - Short title per journaled date
   - Streak count
   - Monthly recap card
4. User sees past entries such as:
   - Calm day
   - Tired day
   - Anxious day
   - Confused day
5. User can click a past journaled date.

## Expected Result

Dashboard feels active and demonstrates that Mono helps users reflect on previous days.

---

# 8. Flow: User Opens a Past Journal Detail

## Goal

User reads a past reflection.

## Preconditions

- User is logged in.
- Selected past date has journal status `summarized` or `edited`.

## Flow

1. User clicks a journaled past date in calendar.
2. System routes user to Journal Detail Page for that date.
3. FE fetches journal by date.
4. Journal Detail displays:
   - title
   - date
   - summary
   - primary mood
   - mood intensity
   - emotion tags
   - topic tags
   - key insight
   - suggested next action
   - edited indicator if applicable
5. Raw chat messages are not displayed.

## Expected Result

User can revisit past reflections in a structured, calm format.

---

# 9. Flow: User Clicks a Date Without a Journal

## Goal

Handle empty calendar dates clearly.

## Preconditions

- User is on dashboard calendar.

## Variants

### 9.1 Past Date Without Journal

1. User attempts to click a past date without journal data.
2. Date is disabled or FE shows a toast:
   - “No journal entry for this date.”
3. User remains on dashboard.

### 9.2 Future Date

1. User attempts to click a future date.
2. Future date is disabled.
3. No navigation occurs.

### 9.3 Today Without Journal

1. User clicks today’s date.
2. Since today has no journal, system routes user to Chat Page.
3. Mood picker is shown.

## Expected Result

User always receives behavior appropriate to the selected date state.

---

# 10. Flow: Today’s Journal Is In Progress

## Goal

Allow user to continue an unfinished daily journal.

## Preconditions

- Today’s journal status is `in_progress`.
- User opens dashboard or tries to access today’s journal.

## Flow

1. Dashboard shows today as in progress, if represented visually.
2. User clicks today.
3. System routes user to Chat Page.
4. Chat Page allows user to continue journaling.
5. If previous chat messages are not shown in the MVP UI, user still continues in the same daily thread.
6. New user messages are appended to today’s journal.

## Expected Result

User continues today’s journal instead of creating a second daily thread.

---

# 11. Flow: Today’s Journal Already Summarized, User Journals Again

## Goal

Support multiple journaling moments in one day while keeping one daily journal.

## Preconditions

- Today’s journal status is `summarized` or `edited`.
- User chooses to continue journaling today.

## Flow

1. User opens today’s Journal Detail Page.
2. User clicks `Continue Journaling`.
3. System routes user to Chat Page.
4. User sends new messages.
5. Backend appends new messages to today’s existing daily thread.
6. Journal may temporarily be treated as needing regeneration.
7. User can trigger `End & Summarize` again for today.
8. Backend regenerates today’s summary.
9. Updated summary replaces previous AI-generated summary for today.

## Expected Result

There is still only one journal per date, and today’s summary can be refreshed when more reflections are added.

## Constraint

Past journal resummarization must not be user-triggered.

---

# 12. Flow: User Edits a Journal

## Goal

Allow user to personalize generated journal content.

## Preconditions

- User is on Journal Detail Page.
- Journal status is `summarized` or `edited`.

## Flow

1. User clicks `Edit`.
2. Editable fields appear:
   - title
   - summary
   - primary mood
   - emotion tags
   - topic tags
3. User changes one or more fields.
4. User clicks `Save`.
5. System updates the journal.
6. Journal status becomes `edited`.
7. `isEdited` becomes `true`.
8. Journal Detail displays an `Edited` indicator.
9. Summary is not automatically regenerated.

## Expected Result

User can correct or personalize journal output while preserving the generated structure.

---

# 13. Flow: Monthly Recap Not Enough Data

## Goal

Prevent monthly recap generation when there is not enough data.

## Preconditions

- User is logged in.
- Selected month has fewer than 3 journals with status `summarized` or `edited`.

## Flow

1. User opens dashboard.
2. System fetches monthly recap status.
3. Monthly recap card shows:
   - Status: `not_enough_data`
   - Current journal count
   - Minimum required count: 3
4. CTA is disabled or hidden.
5. Card displays:
   - “You need at least 3 journal entries this month to generate a monthly recap.”

## Expected Result

User understands why recap is unavailable.

---

# 14. Flow: Generate Monthly Recap

## Goal

Generate a monthly emotional reflection from daily journals.

## Preconditions

- User is logged in.
- Selected month has at least 3 journals with status `summarized` or `edited`.
- Monthly recap status is `ready_to_generate`.

## Flow

1. User opens dashboard.
2. Monthly recap card shows:
   - month name
   - journal count
   - CTA: `Generate Monthly Recap`
3. User clicks `Generate Monthly Recap`.
4. Backend collects all summarized/edited journals for that month.
5. Backend sends daily summaries and structured metadata to AI.
6. AI generates:
   - title
   - monthly summary
   - most frequent mood
   - mood distribution
   - top emotion tags
   - top topic tags
   - recurring pattern
   - monthly insight
   - suggested focus for next month
7. Backend saves monthly recap.
8. Monthly recap status becomes `generated`.
9. User is routed to Monthly Recap Page or card updates with `View Recap`.

## Expected Result

User receives a gentle monthly reflection based on journal history.

---

# 15. Flow: View Generated Monthly Recap

## Goal

User reviews emotional patterns across the month.

## Preconditions

- Monthly recap status is `generated`.

## Flow

1. User opens dashboard.
2. Monthly recap card shows:
   - recap title
   - most frequent mood emoji
   - short summary preview
   - CTA: `View Recap`
3. User clicks `View Recap`.
4. System opens Monthly Recap Page.
5. Page displays:
   - month
   - title
   - summary
   - most frequent mood
   - mood distribution
   - top emotion tags
   - top topic tags
   - recurring pattern
   - monthly insight
   - suggested focus for next month
   - journal count

## Expected Result

User can reflect on recurring patterns and emotional themes across the month.

---

# 16. Flow: Monthly Recap Generation Fails

## Goal

Handle AI or backend failure safely without data loss.

## Preconditions

- User triggers monthly recap generation.
- AI or backend fails.

## Flow

1. User clicks `Generate Monthly Recap`.
2. Generation fails.
3. FE shows an error message.
4. FE shows retry button.
5. Existing journals remain unchanged.
6. Existing recap, if any, is not overwritten unless a new generation succeeds.

## Expected Result

User can retry without losing journal data.

---

# 17. Flow: Daily Summary Generation Fails

## Goal

Handle daily summary failure without losing chat history.

## Preconditions

- User clicks `End & Summarize`.
- AI or backend fails.

## Flow

1. Backend attempts to generate daily summary.
2. Summary generation fails.
3. FE shows an error state.
4. FE shows retry button.
5. Raw chat remains saved.
6. Journal remains `in_progress`.
7. Backend may retry summarization in background.

## Expected Result

User does not lose journaling content and can retry summary generation.

---

# 18. Flow: User Sends Empty or Very Short Message

## Goal

Keep conversation moving even with low-content input.

## Preconditions

- User is in Chat Page.

## Flow

1. User sends an empty, very short, or unclear message such as “.” or “idk”.
2. Backend saves message if valid under input rules.
3. Mono responds based on previous context.
4. Mono gives validation if possible and asks a simple follow-up.
5. Example:
   - “That’s okay. We can start small. What feels most present right now: your body, your thoughts, or your emotions?”

## Expected Result

Mono does not break the flow and helps user continue gently.

---

# 19. Flow: User Writes in Indonesian or Mixed Language

## Goal

Mono follows the user’s language.

## Preconditions

- User is in Chat Page.

## Flow

1. User sends a message in Indonesian, English, or mixed language.
2. Backend detects or asks AI to infer dominant language.
3. Mono responds in the same dominant language.
4. Daily summary follows the conversation’s dominant language.
5. Journal stores language as:
   - `id`
   - `en`
   - `mixed`
   - `other`

## Expected Result

User receives a natural journaling experience in their own language.

---

# 20. Flow: Crisis-Like Input

## Goal

Respond safely to crisis-like user content.

## Preconditions

- User sends content that may imply self-harm or immediate danger.

## Flow

1. User sends crisis-like message.
2. Backend or AI detects crisis-like content.
3. `safetyFlag` is set to `crisis`.
4. Mono responds with:
   - empathy
   - no diagnosis
   - no harmful instructions
   - encouragement to contact a trusted person, professional, or local emergency service
5. Raw chat is saved.
6. If daily summary is generated, suggested next action must be safety-oriented.
7. If monthly recap includes crisis-flagged entries, recap avoids detailed crisis descriptions and includes a gentle support note.

## Expected Result

Mono handles the situation safely while preserving the journal record.

## Example Response

> I’m really sorry you’re feeling this way. You do not have to face this alone. If you might be in immediate danger, please contact local emergency services now. If possible, reach out to someone you trust and let them stay with you.

---

# 21. Flow: Logout

## Goal

User ends session.

## Preconditions

- User is logged in.

## Flow

1. User clicks profile menu.
2. User clicks `Logout`.
3. System clears session.
4. User is redirected to landing page.

## Expected Result

User is logged out and cannot access private journal pages without logging in again.

---

# 22. Demo-Optimized Flow

This flow is optimized for the hackathon video demo.

## Flow

1. Show landing page.
2. Click `Journal Now`.
3. Login or enter demo user.
4. Show dashboard with:
   - seeded calendar
   - mood emojis
   - streak
   - monthly recap card
5. Click `Start Today’s Journal`.
6. Select mood: `confused` or `tired`.
7. User says:
   - “I want to journal but I don’t know what to write.”
8. Mono validates and asks a follow-up.
9. User answers with a short reflection.
10. Mono asks another follow-up.
11. User answers again.
12. User reaches minimum message count.
13. Click `End & Summarize`.
14. Show generated Journal Detail.
15. Return to dashboard.
16. Show today’s calendar cell updated with mood emoji and title.
17. Open a past journal.
18. Open Monthly Recap.
19. End with the message:
   - Mono helps users start with one feeling, reflect daily, and understand emotional patterns over time.

---

# 23. Flow Priority

## P0 — Must Work for Demo

- Landing page to login/demo user
- Dashboard with seed data
- Start today’s journal
- Mood picker
- Chat with Mono
- End & Summarize
- Journal Detail
- Calendar update

## P1 — Strong Demo Value

- Past journal detail
- Streak
- Monthly recap card
- Monthly recap page

## P2 — Secondary

- Edit journal
- Crisis handling
- Retry states
- Language detection

---

# 24. Flow Coverage Checklist

The flows above cover:

- Guest to logged-in transition
- Daily journaling
- Mood picker
- AI guided reflection
- Summary generation
- Summary restrictions
- Dashboard calendar
- Past journal access
- Today journal continuation
- Journal editing
- Monthly recap states
- Monthly recap generation
- Failure states
- Crisis-like input
- Language behavior
- Demo path

