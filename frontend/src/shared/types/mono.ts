export const moods = [
  "happy",
  "calm",
  "sad",
  "angry",
  "anxious",
  "tired",
  "confused",
  "unknown",
] as const;

export const emotionTags = [
  "overwhelmed",
  "grateful",
  "lonely",
  "hopeful",
  "frustrated",
  "proud",
  "uncertain",
  "relieved",
  "stressed",
  "motivated",
] as const;

export const topicTags = [
  "work",
  "school",
  "family",
  "relationship",
  "health",
  "self_esteem",
  "future",
  "finance",
  "friendship",
  "personal_growth",
] as const;

export type Mood = (typeof moods)[number];
export type EmotionTag = (typeof emotionTags)[number];
export type TopicTag = (typeof topicTags)[number];
export type JournalStatus = "empty" | "in_progress" | "summarized" | "edited";
export type SafetyFlag = "none" | "crisis";
export type JournalLanguage = "id" | "en" | "mixed" | "other";
export type MonthlyRecapStatus =
  | "not_enough_data"
  | "ready_to_generate"
  | "generated";
export type ChatRole = "user" | "assistant";

export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  createdAt: string;
  lastLoginAt: string;
};

export type ChatMessage = {
  id: string;
  journalId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatActions = {
  canSummarize: boolean;
  shouldOfferSummary: boolean;
  safetyFlag: SafetyFlag;
};

export type JournalState = {
  date: string;
  status: JournalStatus;
  userMessageCount: number;
};

export type SendChatMessageRequest = {
  content: string;
  initialMood?: Mood | null;
};

export type SendChatMessageResponse = {
  message: ChatMessage;
  actions: ChatActions;
  journalState: JournalState;
};

export type Journal = {
  id: string;
  userId: string;
  date: string;
  status: JournalStatus;
  title: string | null;
  summary: string | null;
  primaryMood: Mood | null;
  moodIntensity: number | null;
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

export type CalendarDay = {
  date: string;
  status: JournalStatus;
  primaryMood: Mood;
  moodEmoji: string;
  title: string;
  isEdited: boolean;
};

export type MonthlyRecapCard = {
  status: MonthlyRecapStatus;
  month: string;
  title: string | null;
  summaryPreview: string | null;
  mostFrequentMood: Mood | null;
  moodEmoji: string | null;
  journalCount: number;
  minimumRequired: number | null;
};

export type MonthlyRecap = {
  id: string;
  userId: string;
  month: string;
  status: "generated";
  title: string;
  summary: string;
  mostFrequentMood: Mood;
  moodDistribution: Partial<Record<Mood, number>>;
  topEmotionTags: EmotionTag[];
  topTopicTags: TopicTag[];
  recurringPattern: string;
  monthlyInsight: string;
  suggestedFocusNextMonth: string;
  journalCount: number;
  generatedAt: string;
  updatedAt: string;
};

export type CalendarResponse = {
  month: string;
  streak: number;
  days: CalendarDay[];
  monthlyRecap: MonthlyRecapCard;
};

export type TodayChatResponse = {
  date: string;
  initialMood: Mood | null;
  messages: ChatMessage[];
  actions: ChatActions;
  journalState: JournalState;
};
