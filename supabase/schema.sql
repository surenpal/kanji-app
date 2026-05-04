-- ══════════════════════════════════════════════
--  Kanji App — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════

-- 1. User progress — tracks which kanji have been studied + quiz stats
CREATE TABLE IF NOT EXISTS public.user_progress (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kanji_index     INT NOT NULL CHECK (kanji_index >= 0 AND kanji_index < 928),
  studied_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  quiz_correct    INT DEFAULT 0 NOT NULL,
  quiz_attempted  INT DEFAULT 0 NOT NULL,

  CONSTRAINT user_progress_unique UNIQUE (user_id, kanji_index)
);

-- 2. User favourites — bookmarked kanji
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kanji_index   INT NOT NULL CHECK (kanji_index >= 0 AND kanji_index < 928),
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,

  CONSTRAINT user_favorites_unique UNIQUE (user_id, kanji_index)
);

-- ══════════════════════════════════════════════
--  Row Level Security (RLS)
--  Each user can only read/write their own rows
-- ══════════════════════════════════════════════

ALTER TABLE public.user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- user_progress policies
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- user_favorites policies
CREATE POLICY "Users can view own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════
--  Indexes for fast lookups
-- ══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_progress_user_id  ON public.user_progress  (user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.user_favorites (user_id);
