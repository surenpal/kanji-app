import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getKanjiByIndices } from "@/lib/kanji";
import { FavoritesGrid } from "@/components/home/FavoritesGrid";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: favorites } = await supabase
    .from("user_favorites")
    .select("kanji_index, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const indices = favorites?.map((f) => f.kanji_index) ?? [];
  const kanjiList = getKanjiByIndices(indices);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-16">
      <h1 className="text-center font-extrabold text-xl tracking-widest mb-1"
          style={{ color: "var(--accent)" }}>
        ★ Favourite Kanji
      </h1>
      <p className="text-center text-sm mb-10" style={{ color: "var(--text-sub)" }}>
        {kanjiList.length} kanji saved
      </p>
      <FavoritesGrid kanjiList={kanjiList} globalIndices={indices} />
    </div>
  );
}
