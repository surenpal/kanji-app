# 漢字 31-Day Challenge — Full-Stack Next.js App

A fully-managed kanji study app built with **Next.js 15**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**.

## Features

- 📖 **928 kanji** across 31 day groups — flashcard viewer with swipe & keyboard navigation
- ✅ **Progress tracking** — kanji auto-marked as studied per user, with progress bars per day
- ★ **Favourites** — star any kanji to save it to your favourites list
- 🧠 **Quiz mode** — 10-question multiple-choice quiz per day, with score tracking
- 🌙 **Dark / Light theme** — persisted in localStorage
- 🔐 **Auth** — Google & GitHub OAuth via Supabase (no passwords)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Auth + DB | Supabase (Postgres + OAuth) |
| Deployment | Vercel (recommended) |

---

## Setup Guide

### 1. Clone & install

```bash
git clone <your-repo-url>
cd kanji-app
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In your project dashboard, go to **SQL Editor**
3. Paste and run the contents of `supabase/schema.sql`

### 3. Configure OAuth providers in Supabase

In Supabase Dashboard → **Authentication** → **Providers**:

**Google:**
1. Enable Google provider
2. Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
3. Set Authorized Redirect URI to: `https://<your-project>.supabase.co/auth/v1/callback`
4. Paste Client ID and Secret into Supabase

**GitHub:**
1. Enable GitHub provider
2. Create OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
3. Set Authorization callback URL to: `https://<your-project>.supabase.co/auth/v1/callback`
4. Paste Client ID and Secret into Supabase

### 4. Add environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your values from Supabase Dashboard → **Settings** → **API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout with Header + ThemeProvider
│   ├── page.tsx                 # Home — 31 day group grid
│   ├── day/[day]/page.tsx       # Flashcard viewer for a day
│   ├── quiz/page.tsx            # Quiz mode
│   ├── favorites/page.tsx       # Saved favourite kanji
│   ├── auth/
│   │   ├── login/page.tsx       # Sign in page (Google / GitHub)
│   │   └── callback/route.ts   # OAuth callback handler
│   └── api/
│       ├── kanji/route.ts       # GET kanji data
│       ├── progress/route.ts    # POST/PATCH study progress
│       └── favorites/route.ts   # POST/DELETE favourites
├── components/
│   ├── layout/                  # Header, HeaderClient, ThemeProvider
│   ├── home/                    # DayGroupCard, FavoritesGrid
│   ├── viewer/                  # KanjiViewer, KanjiCard, DotNav
│   └── quiz/                    # QuizClient, QuizCard
├── lib/
│   ├── supabase/client.ts       # Browser Supabase client
│   ├── supabase/server.ts       # Server Supabase client
│   ├── kanji.ts                 # Data helpers (getDayGroup, etc.)
│   └── utils.ts                 # cn(), shuffle(), etc.
├── types/
│   ├── kanji.ts                 # Kanji, DayGroup, QuizQuestion types
│   └── database.ts             # Supabase DB types
├── data/
│   └── kanji.json              # 928 kanji entries
├── middleware.ts                # Supabase session refresh
└── app/globals.css             # Tailwind v4 + CSS theme variables
supabase/
└── schema.sql                  # DB tables, RLS policies, indexes
```

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add these environment variables in Vercel Dashboard → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then update your Supabase OAuth redirect URIs to include your Vercel production URL.

---

## Adding More Kanji

Edit `src/data/kanji.json`. Each entry follows this shape:

```json
{
  "kanji": "会",
  "on": "カイ・エ",
  "kun": "あう",
  "meaning": "to meet",
  "vocab": [
    { "word": "会う", "reading": "あう", "meaning": "to meet" }
  ]
}
```
