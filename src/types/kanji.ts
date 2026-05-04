export interface VocabEntry {
  word: string;
  reading: string;
  meaning: string;
}

export interface Kanji {
  kanji: string;
  on: string;
  kun: string;
  meaning: string;
  vocab: VocabEntry[];
}

export interface DayGroup {
  day: number;          // 1–31
  label: string;        // "Day 1"
  start: number;        // 0-based index into ALL_KANJI
  end: number;          // exclusive
  kanji: Kanji[];
}

// Supabase DB row shapes
export interface UserProgress {
  id: string;
  user_id: string;
  kanji_index: number;  // global index in ALL_KANJI (0-based)
  studied_at: string;
  quiz_correct: number;
  quiz_attempted: number;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  kanji_index: number;
  created_at: string;
}

// Enriched kanji with user data (used on client)
export interface KanjiWithUserData extends Kanji {
  globalIndex: number;
  isFavorite: boolean;
  isStudied: boolean;
  quizCorrect: number;
  quizAttempted: number;
}

// Quiz answer state
export type QuizResult = "correct" | "incorrect" | "unanswered";

export interface QuizQuestion {
  kanji: Kanji;
  globalIndex: number;
  options: string[];      // 4 meaning choices
  correctIndex: number;
}
