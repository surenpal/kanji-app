import { notFound } from "next/navigation";
import Link from "next/link";
import { getDayGroupsForLevel, getKanjiForLevel } from "@/lib/kanji";
import { createClient } from "@/lib/supabase/server";
import { DayGroupCard } from "@/components/home/DayGroupCard";
import type { JLPTLevel } from "@/types/kanji";

interface Props {
  params: Promise<{ level: string }>;
}

const VALID_LEVELS = ["n5", "n4", "n3"] as const;

export async function generateStaticParams() {
  return VALID_LEVELS.map((level) => ({ level }));
}

export default async function LevelPage({ params }: Props) {
  const { level } = await params;
  if (!VALID_LEVELS.includes(level as JLPTLevel)) notFound();

  const jlptLevel = level as JLPTLevel;
  const groups = getDayGroupsForLevel(jlptLevel);
  const totalKanji = getKanjiForLevel(jlptLevel).length;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let studiedIndices: Set<number> = new Set();
  if (user && groups.length > 0) {
    const minIndex = groups[0].start;
    const maxIndex = groups[groups.length - 1].end;
    const { data } = await supabase
      .from("user_progress")
      .select("kanji_index")
      .eq("user_id", user.id)
      .gte("kanji_index", minIndex)
      .lt("kanji_index", maxIndex);
    if (data) studiedIndices = new Set(data.map((r) => r.kanji_index));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-16">
      <Link
        href="/"
        className="inline-block mb-6 px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide transition-colors hover:opacity-80"
        style={{ border: "2px solid var(--accent)", color: "var(--accent)" }}
      >
        ← Back to Levels
      </Link>

      <h1
        className="text-center font-extrabold text-xl tracking-widest mb-1"
        style={{ color: "var(--accent)" }}
      >
        JLPT {level.toUpperCase()}
      </h1>
      <p className="text-center text-sm mb-10" style={{ color: "var(--text-sub)" }}>
        {totalKanji} kanji · {groups.length} day groups
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {groups.map((group) => {
          const studiedCount = group.kanji.reduce((acc, _, i) => {
            return studiedIndices.has(group.start + i) ? acc + 1 : acc;
          }, 0);
          return (
            <DayGroupCard
              key={group.day}
              group={group}
              studiedCount={studiedCount}
              isLoggedIn={!!user}
              basePath={`/${level}`}
            />
          );
        })}
      </div>
    </div>
  );
}
