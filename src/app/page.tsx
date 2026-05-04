import { getDayGroups } from "@/lib/kanji";
import { createClient } from "@/lib/supabase/server";
import { DayGroupCard } from "@/components/home/DayGroupCard";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch which days the user has studied at least one kanji in
  let studiedIndices: Set<number> = new Set();
  if (user) {
    const { data } = await supabase
      .from("user_progress")
      .select("kanji_index")
      .eq("user_id", user.id);
    if (data) studiedIndices = new Set(data.map((r) => r.kanji_index));
  }

  const groups = getDayGroups();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-16">
      <h1 className="text-center font-extrabold text-xl tracking-widest mb-1"
          style={{ color: "var(--accent)" }}>
        Dinuprastha <span className="font-kanji text-2xl">漢字</span> / 31 Day Challenge
      </h1>
      <p className="text-center text-sm mb-10" style={{ color: "var(--text-sub)" }}>
        Choose a group to start studying · 928 kanji · 31 groups
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
            />
          );
        })}
      </div>
    </div>
  );
}
