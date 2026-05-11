import { subDays } from "date-fns";

import {
  formatDateKey,
  getCurrentMonthKey,
  getTodayDateKey,
} from "@/shared/lib/date";
import { getMoodEmoji } from "@/shared/lib/moods";
import type {
  CalendarDay,
  CalendarResponse,
  ChatActions,
  ChatMessage,
  EmotionTag,
  Journal,
  JournalLanguage,
  JournalState,
  MonthlyRecap,
  MonthlyRecapCard,
  Mood,
  SafetyFlag,
  TodayChatResponse,
  TopicTag,
  User,
} from "@/shared/types/mono";

type DemoStore = {
  user: User;
  journalsByDate: Record<string, Journal>;
  chatsByDate: Record<string, ChatMessage[]>;
  monthlyRecapsByMonth: Record<string, MonthlyRecap>;
};

declare global {
  var __MONO_DEMO_STORE__: DemoStore | undefined;
}

const TODAY = getTodayDateKey();
const CURRENT_MONTH = getCurrentMonthKey();

function createDemoUser(): User {
  return {
    id: "user_123",
    email: "alex@example.com",
    name: "Alex",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    createdAt: "2026-05-01T10:00:00Z",
    lastLoginAt: "2026-05-10T10:00:00Z",
  };
}

function detectLanguage(texts: string[]): JournalLanguage {
  const joined = texts.join(" ").toLowerCase();
  const idScore =
    Number(
      /\b(saya|aku|hari ini|capek|bingung|merasa|karena|banget|kerja)\b/.test(
        joined,
      ),
    ) + Number(/\b(dan|yang|lagi|tapi|untuk)\b/.test(joined));
  const enScore =
    Number(
      /\b(i|today|feel|because|work|tired|overwhelmed|and)\b/.test(joined),
    ) + Number(/\b(the|with|about|keep|heavy)\b/.test(joined));

  if (idScore > 0 && enScore > 0) {
    return "mixed";
  }

  if (idScore > enScore) {
    return "id";
  }

  if (enScore > 0) {
    return "en";
  }

  return "other";
}

function containsCrisisLanguage(text: string) {
  return /\b(kill myself|end my life|don't want to live|self harm|suicide|bunuh diri|mati saja|ingin mati|sakiti diri)\b/i.test(
    text,
  );
}

function buildAssistantReply({
  mood,
  language,
  safetyFlag,
  count,
}: {
  mood: Mood | null;
  language: JournalLanguage;
  safetyFlag: SafetyFlag;
  count: number;
}) {
  if (safetyFlag === "crisis") {
    return language === "id" || language === "mixed"
      ? "Aku ikut prihatin kamu lagi merasa seberat ini. Kalau ada kemungkinan kamu dalam bahaya sekarang, segera hubungi layanan darurat setempat atau orang yang kamu percaya dan minta mereka tetap menemani kamu."
      : "I’m really sorry you’re carrying something this heavy. If you might be in immediate danger, please contact local emergency services now or reach out to someone you trust and ask them to stay with you.";
  }

  if (count === 0) {
    return language === "id" || language === "mixed"
      ? `Terima kasih sudah mulai dari rasa ${mood ?? "itu"}. Bagian mana dari hari ini yang paling terasa di tubuh atau pikiranmu?`
      : `Thank you for starting from that feeling. What part of today has felt the most present in your body or mind?`;
  }

  if (count === 1) {
    return language === "id" || language === "mixed"
      ? "Itu terdengar cukup berat. Saat kamu memikirkan itu lagi, apa yang paling kamu butuhkan sebenarnya?"
      : "That sounds like a lot to carry. When you sit with it again, what do you feel you needed most in that moment?";
  }

  if (count === 2) {
    return language === "id" || language === "mixed"
      ? "Aku bisa lihat ada banyak yang kamu tahan sendiri. Dari semua yang terjadi, bagian mana yang ingin kamu lepaskan dulu?"
      : "I can see you’ve been holding a lot on your own. Out of everything that happened, what feels most important to let go of first?";
  }

  return language === "id" || language === "mixed"
    ? "Terima kasih sudah jujur sejauh ini. Kalau kamu mau, kita bisa berhenti dan merangkum ini kapan saja, atau lanjut sedikit lagi."
    : "Thank you for being this honest. If you want, we can pause and summarize here anytime, or keep going a little longer.";
}

function inferTopicTags(texts: string[]): TopicTag[] {
  const joined = texts.join(" ").toLowerCase();
  const matches: TopicTag[] = [];

  if (/\b(work|office|deadline|meeting|kerja|kantor)\b/.test(joined)) {
    matches.push("work");
  }
  if (/\b(school|class|campus|college|kuliah|kelas)\b/.test(joined)) {
    matches.push("school");
  }
  if (/\b(mom|dad|parent|family|ibu|ayah|keluarga)\b/.test(joined)) {
    matches.push("family");
  }
  if (/\b(partner|relationship|pacar|pasangan)\b/.test(joined)) {
    matches.push("relationship");
  }
  if (/\b(health|sleep|rest|tidur|sehat)\b/.test(joined)) {
    matches.push("health");
  }
  if (/\b(confidence|worth|esteem|enough|diri|percaya diri)\b/.test(joined)) {
    matches.push("self_esteem");
  }
  if (/\b(tomorrow|future|masa depan)\b/.test(joined)) {
    matches.push("future");
  }
  if (/\b(money|finance|uang|biaya)\b/.test(joined)) {
    matches.push("finance");
  }
  if (/\b(friend|friendship|teman)\b/.test(joined)) {
    matches.push("friendship");
  }
  if (/\b(grow|growth|learning|belajar|bertumbuh)\b/.test(joined)) {
    matches.push("personal_growth");
  }

  return matches.length > 0 ? matches.slice(0, 3) : ["personal_growth"];
}

function inferEmotionTags(mood: Mood | null, texts: string[]): EmotionTag[] {
  const joined = texts.join(" ").toLowerCase();
  const tags = new Set<EmotionTag>();

  const moodMap: Partial<Record<Mood, EmotionTag[]>> = {
    calm: ["relieved", "grateful"],
    anxious: ["overwhelmed", "uncertain"],
    tired: ["stressed", "overwhelmed"],
    confused: ["uncertain", "stressed"],
    happy: ["hopeful", "motivated"],
    sad: ["lonely", "uncertain"],
    angry: ["frustrated", "stressed"],
    unknown: ["uncertain"],
  };

  moodMap[mood ?? "unknown"]?.forEach((tag) => {
    tags.add(tag);
  });

  if (/\b(grateful|thankful|bersyukur)\b/.test(joined)) {
    tags.add("grateful");
  }
  if (/\b(proud|bangga)\b/.test(joined)) {
    tags.add("proud");
  }
  if (/\b(hope|hopeful|harap)\b/.test(joined)) {
    tags.add("hopeful");
  }
  if (/\b(relieved|lega)\b/.test(joined)) {
    tags.add("relieved");
  }
  if (/\b(motivated|semangat)\b/.test(joined)) {
    tags.add("motivated");
  }

  return Array.from(tags).slice(0, 3);
}

function buildSummary(journal: Journal, userMessages: string[]) {
  const language = detectLanguage(userMessages);
  const crisis = journal.safetyFlag === "crisis";
  const primaryMood = journal.primaryMood ?? "unknown";
  const topicMatches = inferTopicTags(userMessages);
  const emotionMatches = inferEmotionTags(primaryMood, userMessages);
  const summarySource = userMessages.slice(-2).join(" ");

  if (language === "id" || language === "mixed") {
    return {
      title:
        primaryMood === "tired"
          ? "Hari yang Berat, Tapi Aku Tetap Hadir"
          : primaryMood === "anxious"
            ? "Aku Sedang Belajar Menenangkan Diri"
            : "Aku Mulai Mengerti Apa yang Kurasa",
      summary: crisis
        ? "Hari ini aku merasa sangat kewalahan, dan aku sadar aku tidak seharusnya menanggung rasa ini sendirian. Yang paling penting sekarang adalah mencari dukungan yang aman secepat mungkin."
        : `Hari ini aku mulai dari rasa ${primaryMood} dan perlahan melihat apa yang sebenarnya menumpuk di baliknya. Dari refleksi ini, aku menyadari bahwa ${summarySource ? `hal yang paling menempel di pikiranku adalah ${summarySource.toLowerCase()}.` : "aku butuh ruang yang lebih lembut untuk memahami diriku sendiri."}`,
      keyInsight: crisis
        ? "Aku perlu memprioritaskan keselamatan dan dukungan sekarang."
        : "Aku merasa lebih jernih ketika memberi nama pada rasa yang selama ini kupendam.",
      suggestedNextAction: crisis
        ? "Hubungi orang yang kamu percaya atau layanan darurat setempat sekarang juga."
        : "Besok, aku ingin memberi diriku satu langkah kecil yang realistis dan sedikit ruang untuk bernapas.",
      language,
      topicTags: topicMatches,
      emotionTags: emotionMatches,
    };
  }

  return {
    title:
      primaryMood === "tired"
        ? "A Heavy Day, But I Stayed With It"
        : primaryMood === "anxious"
          ? "I’m Learning How to Soften the Spiral"
          : "A Small Shift Toward Clarity",
    summary: crisis
      ? "Today felt deeply overwhelming, and I can see that I should not carry this alone. What matters most right now is getting immediate, safe support."
      : `Today I started from feeling ${primaryMood} and slowly noticed what was sitting underneath it. From this reflection, I realized that ${summarySource ? `what stayed with me most was ${summarySource.toLowerCase()}.` : "I need more room to meet myself with less pressure."}`,
    keyInsight: crisis
      ? "I need to treat my safety as the first priority right now."
      : "Naming what I feel makes the day easier to understand and less sharp to carry.",
    suggestedNextAction: crisis
      ? "Reach out to someone you trust or contact local emergency support now."
      : "Tomorrow, I want to begin with one manageable step and leave space for rest without guilt.",
    language,
    topicTags: topicMatches,
    emotionTags: emotionMatches,
  };
}

function createSeedJournal({
  date,
  mood,
  title,
  summary,
  keyInsight,
  suggestedNextAction,
  emotion,
  topic,
  status = "summarized",
}: {
  date: string;
  mood: Mood;
  title: string;
  summary: string;
  keyInsight: string;
  suggestedNextAction: string;
  emotion: EmotionTag[];
  topic: TopicTag[];
  status?: Journal["status"];
}): Journal {
  return {
    id: `journal_${date}`,
    userId: "user_123",
    date,
    status,
    title,
    summary,
    primaryMood: mood,
    moodIntensity: mood === "tired" || mood === "anxious" ? 4 : 3,
    emotionTags: emotion,
    topicTags: topic,
    keyInsight,
    suggestedNextAction,
    language: "en",
    isEdited: status === "edited",
    safetyFlag: "none",
    createdAt: `${date}T08:00:00Z`,
    updatedAt: `${date}T09:20:00Z`,
    summarizedAt: `${date}T09:20:00Z`,
  };
}

function createInitialStore(): DemoStore {
  const today = new Date();
  const seedDates = [
    formatDateKey(subDays(today, 4)),
    formatDateKey(subDays(today, 3)),
    formatDateKey(subDays(today, 2)),
    formatDateKey(subDays(today, 1)),
  ];

  const journals = Object.fromEntries(
    [
      createSeedJournal({
        date: seedDates[0],
        mood: "calm",
        title: "A Quiet Day to Reset",
        summary:
          "Today I felt calmer after slowing down and giving myself less to juggle. The more I stopped rushing, the easier it became to hear what I actually needed.",
        keyInsight: "A slower pace helps me hear myself more clearly.",
        suggestedNextAction:
          "Tomorrow, I want to protect one quiet pocket of time before the day gets noisy.",
        emotion: ["relieved", "grateful"],
        topic: ["health", "personal_growth"],
      }),
      createSeedJournal({
        date: seedDates[1],
        mood: "anxious",
        title: "Trying to Understand My Worries",
        summary:
          "Today I felt anxious because work kept looping in my head even after it was over. Writing it out helped me notice that the pressure felt bigger than the task itself.",
        keyInsight:
          "Sometimes I’m reacting more to pressure than to the actual work in front of me.",
        suggestedNextAction:
          "I want to break tomorrow into smaller pieces instead of carrying the whole week at once.",
        emotion: ["overwhelmed", "uncertain"],
        topic: ["work", "self_esteem"],
        status: "edited",
      }),
      createSeedJournal({
        date: seedDates[2],
        mood: "tired",
        title: "Still Caring While Running Low",
        summary:
          "Today I felt tired in a way that touched both my body and my focus. I kept showing up, but I also noticed that I’ve been asking for more from myself than I can reasonably give.",
        keyInsight:
          "Exhaustion feels sharper when I treat rest like something I need to earn.",
        suggestedNextAction:
          "Tomorrow, I want to begin with one essential task and allow myself a gentler pace.",
        emotion: ["stressed", "overwhelmed"],
        topic: ["work", "health"],
      }),
      createSeedJournal({
        date: seedDates[3],
        mood: "confused",
        title: "I’m Still Untangling It",
        summary:
          "Today I couldn’t name everything clearly, but I knew something felt unsettled. Letting the confusion exist without forcing an answer made me feel a little less stuck.",
        keyInsight:
          "Clarity sometimes arrives after I stop demanding it immediately.",
        suggestedNextAction:
          "I want to keep noticing what returns to my mind instead of pushing for a perfect explanation.",
        emotion: ["uncertain", "relieved"],
        topic: ["personal_growth", "future"],
      }),
    ].map((journal) => [journal.date, journal]),
  );

  return {
    user: createDemoUser(),
    journalsByDate: journals,
    chatsByDate: {
      [TODAY]: [],
    },
    monthlyRecapsByMonth: {
      [CURRENT_MONTH]: {
        id: `recap_${CURRENT_MONTH}`,
        userId: "user_123",
        month: CURRENT_MONTH,
        status: "generated",
        title: "A Month of Easing the Pressure",
        summary:
          "This month, you often moved between feeling tired, anxious, and quietly hopeful. Many of your reflections pointed back to work pressure, self-expectation, and the relief that comes when you let the day soften.",
        mostFrequentMood: "tired",
        moodDistribution: {
          tired: 2,
          anxious: 1,
          calm: 1,
          confused: 1,
        },
        topEmotionTags: ["overwhelmed", "uncertain", "relieved"],
        topTopicTags: ["work", "personal_growth", "health"],
        recurringPattern:
          "Your hardest days often happen when you try to carry the entire week at once.",
        monthlyInsight:
          "You seem steadier when you let rest become part of the plan instead of a reward at the end of it.",
        suggestedFocusNextMonth:
          "Try noticing one place each day where you can choose a smaller, kinder pace.",
        journalCount: 4,
        generatedAt: `${CURRENT_MONTH}-01T23:00:00Z`,
        updatedAt: `${CURRENT_MONTH}-01T23:00:00Z`,
      },
    },
  };
}

function getStore() {
  if (!globalThis.__MONO_DEMO_STORE__) {
    globalThis.__MONO_DEMO_STORE__ = createInitialStore();
  }

  return globalThis.__MONO_DEMO_STORE__;
}

function buildJournalState(date: string, journal?: Journal): JournalState {
  return {
    date,
    status: journal?.status ?? "empty",
    userMessageCount: (getStore().chatsByDate[date] ?? []).filter(
      (message) => message.role === "user",
    ).length,
  };
}

function buildActions(date: string, journal?: Journal): ChatActions {
  const messageCount = buildJournalState(date, journal).userMessageCount;
  const safetyFlag = journal?.safetyFlag ?? "none";

  return {
    canSummarize: messageCount >= 3,
    shouldOfferSummary: messageCount >= 5,
    safetyFlag,
  };
}

function createDraftJournal(date: string, mood: Mood | null = null): Journal {
  return {
    id: `journal_${date}`,
    userId: "user_123",
    date,
    status: "in_progress",
    title: null,
    summary: null,
    primaryMood: mood,
    moodIntensity: mood ? 3 : null,
    emotionTags: [],
    topicTags: [],
    keyInsight: null,
    suggestedNextAction: null,
    language: "en",
    isEdited: false,
    safetyFlag: "none",
    createdAt: `${date}T08:00:00Z`,
    updatedAt: `${date}T08:00:00Z`,
    summarizedAt: null,
  };
}

function upsertTodayJournal(mood: Mood | null = null) {
  const store = getStore();
  const existing = store.journalsByDate[TODAY];

  if (existing) {
    if (mood && !existing.primaryMood) {
      existing.primaryMood = mood;
    }
    if (existing.status === "empty") {
      existing.status = "in_progress";
    }
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  const journal = createDraftJournal(TODAY, mood);
  store.journalsByDate[TODAY] = journal;
  store.chatsByDate[TODAY] = store.chatsByDate[TODAY] ?? [];
  return journal;
}

export function getCurrentUser() {
  return getStore().user;
}

export function getTodayChat(): TodayChatResponse {
  const store = getStore();
  const journal = store.journalsByDate[TODAY];

  return {
    date: TODAY,
    initialMood: journal?.primaryMood ?? null,
    messages: store.chatsByDate[TODAY] ?? [],
    actions: buildActions(TODAY, journal),
    journalState: buildJournalState(TODAY, journal),
  };
}

export function sendChatMessage({
  content,
  initialMood,
}: {
  content: string;
  initialMood?: Mood | null;
}) {
  const store = getStore();
  const journal = upsertTodayJournal(initialMood ?? null);
  if (!store.chatsByDate[TODAY]) {
    store.chatsByDate[TODAY] = [];
  }

  const messages = store.chatsByDate[TODAY];
  const isMoodBootstrap =
    Boolean(initialMood) &&
    messages.length === 0 &&
    !messages.some((message) => message.role === "user");

  const language = detectLanguage([
    ...messages
      .filter((message) => message.role === "user")
      .map((message) => message.content),
    content,
  ]);

  if (!isMoodBootstrap) {
    messages.push({
      id: `msg_${crypto.randomUUID()}`,
      journalId: journal.id,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    });
  }

  if (initialMood) {
    journal.primaryMood = initialMood;
    journal.moodIntensity = journal.moodIntensity ?? 3;
  }

  journal.language = language;
  journal.safetyFlag = containsCrisisLanguage(content) ? "crisis" : "none";
  journal.updatedAt = new Date().toISOString();

  const userCount = messages.filter(
    (message) => message.role === "user",
  ).length;
  const assistantMessage: ChatMessage = {
    id: `msg_${crypto.randomUUID()}`,
    journalId: journal.id,
    role: "assistant",
    content: buildAssistantReply({
      mood: journal.primaryMood,
      language,
      safetyFlag: journal.safetyFlag,
      count: userCount,
    }),
    createdAt: new Date().toISOString(),
  };

  messages.push(assistantMessage);
  journal.status = "in_progress";

  return {
    message: assistantMessage,
    actions: buildActions(TODAY, journal),
    journalState: buildJournalState(TODAY, journal),
  };
}

export function summarizeTodayJournal() {
  const store = getStore();
  const journal = store.journalsByDate[TODAY];
  const messages = store.chatsByDate[TODAY] ?? [];
  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content);

  if (!journal || userMessages.length < 3) {
    return null;
  }

  const summary = buildSummary(journal, userMessages);

  journal.title = summary.title;
  journal.summary = summary.summary;
  journal.keyInsight = summary.keyInsight;
  journal.suggestedNextAction = summary.suggestedNextAction;
  journal.language = summary.language;
  journal.topicTags = summary.topicTags;
  journal.emotionTags = summary.emotionTags;
  journal.status = "summarized";
  journal.summarizedAt = new Date().toISOString();
  journal.updatedAt = journal.summarizedAt;
  journal.moodIntensity = journal.moodIntensity ?? 3;

  const recap = store.monthlyRecapsByMonth[CURRENT_MONTH];
  if (recap) {
    recap.journalCount = countCompletedJournalsForMonth(CURRENT_MONTH);
    recap.updatedAt = new Date().toISOString();
  }

  return journal;
}

export function getJournalByDate(date: string) {
  return getStore().journalsByDate[date] ?? null;
}

function countCompletedJournalsForMonth(monthKey: string) {
  return Object.values(getStore().journalsByDate).filter(
    (journal) =>
      journal.date.startsWith(monthKey) &&
      (journal.status === "summarized" || journal.status === "edited"),
  ).length;
}

function computeStreak() {
  let streak = 0;
  let cursor = new Date();

  const current = getStore().journalsByDate[TODAY];
  if (!current || !["summarized", "edited"].includes(current.status)) {
    cursor = subDays(cursor, 1);
  }

  while (true) {
    const key = formatDateKey(cursor);
    const journal = getStore().journalsByDate[key];

    if (!journal || !["summarized", "edited"].includes(journal.status)) {
      break;
    }

    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

function toCalendarDay(journal: Journal): CalendarDay {
  return {
    date: journal.date,
    status: journal.status,
    primaryMood: journal.primaryMood ?? "unknown",
    moodEmoji: getMoodEmoji(journal.primaryMood ?? "unknown"),
    title:
      journal.title ??
      (journal.status === "in_progress" ? "Still reflecting" : "Journal entry"),
    isEdited: journal.isEdited,
  };
}

function buildMonthlyRecapCard(monthKey: string): MonthlyRecapCard {
  const recap = getStore().monthlyRecapsByMonth[monthKey];
  const journalCount = countCompletedJournalsForMonth(monthKey);

  if (recap) {
    return {
      status: "generated",
      month: monthKey,
      title: recap.title,
      summaryPreview: recap.summary,
      mostFrequentMood: recap.mostFrequentMood,
      moodEmoji: getMoodEmoji(recap.mostFrequentMood),
      journalCount,
      minimumRequired: 3,
    };
  }

  if (journalCount >= 3) {
    return {
      status: "ready_to_generate",
      month: monthKey,
      title: null,
      summaryPreview: null,
      mostFrequentMood: null,
      moodEmoji: null,
      journalCount,
      minimumRequired: 3,
    };
  }

  return {
    status: "not_enough_data",
    month: monthKey,
    title: null,
    summaryPreview: null,
    mostFrequentMood: null,
    moodEmoji: null,
    journalCount,
    minimumRequired: 3,
  };
}

export function getCalendarForMonth(monthKey: string): CalendarResponse {
  const days = Object.values(getStore().journalsByDate)
    .filter((journal) => journal.date.startsWith(monthKey))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(toCalendarDay);

  return {
    month: monthKey,
    streak: computeStreak(),
    days,
    monthlyRecap: buildMonthlyRecapCard(monthKey),
  };
}
