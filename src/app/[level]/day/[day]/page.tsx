import { notFound } from "next/navigation";
import { getDayGroupForLevel, getDayGroupsForLevel } from "@/lib/kanji";
import { createClient } from "@/lib/supabase/server";
import { KanjiViewer } from "@/components/viewer/KanjiViewer";
import type { JLPTLevel } from "@/types/kanji";

interface Props {
  params: Promise<{ level: string; day: string }>;
}

const VALID_LEVELS = ["n5", "n4", "n3"] as const;

export async function generateStaticParams() {
  return VALID_LEVELS.flatMap((level) =>
    getDayGroupsForLevel(level).map((g) => ({
      level,
      day: String(g.day),
    }))
  );
}

export default async function LevelDayPage({ params }: Props) {
  const { level, day: dayStr } = await params;
  if (!VALID_LEVELS.includes(level as JLPTLevel)) notFound();

  const jlptLevel = level as JLPTLevel;
  const day = parseInt(dayStr, 10);
  if (isNaN(day) || day < 1) notFound();

  const group = getDayGroupForLevel(jlptLevel, day);
  if (!group) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let studiedIndices: number[] = [];
  let favoriteIndices: number[] = [];

  if (user) {
    const [{ data: progress }, { data: favorites }] = await Promise.all([
      supabase
        .from("user_progress")
        .select("kanji_index")
        .eq("user_id", user.id)
        .gte("kanji_index", group.start)
        .lt("kanji_index", group.end),
      supabase
        .from("user_favorites")
        .select("kanji_index")
        .eq("user_id", user.id)
        .gte("kanji_index", group.start)
        .lt("kanji_index", group.end),
    ]);
    studiedIndices = progress?.map((r) => r.kanji_index) ?? [];
    favoriteIndices = favorites?.map((r) => r.kanji_index) ?? [];
  }

  return (
    <KanjiViewer
      group={group}
      studiedIndices={studiedIndices}
      favoriteIndices={favoriteIndices}
      isLoggedIn={!!user}
      backHref={`/${level}`}
    />
  );
}
