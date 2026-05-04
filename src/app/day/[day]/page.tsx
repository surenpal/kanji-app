import { notFound } from "next/navigation";
import { getDayGroup } from "@/lib/kanji";
import { createClient } from "@/lib/supabase/server";
import { KanjiViewer } from "@/components/viewer/KanjiViewer";

interface Props {
  params: Promise<{ day: string }>;
}

export default async function DayPage({ params }: Props) {
  const { day: dayStr } = await params;
  const day = parseInt(dayStr, 10);

  if (isNaN(day) || day < 1 || day > 31) notFound();

  const group = getDayGroup(day);
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
    />
  );
}

export async function generateStaticParams() {
  return Array.from({ length: 31 }, (_, i) => ({ day: String(i + 1) }));
}
