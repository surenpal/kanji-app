import { LevelCard } from "@/components/home/LevelCard";
import { N5_KANJI, N4_KANJI, N3_KANJI, getDayGroupsForLevel } from "@/lib/kanji";
import type { JLPTLevel } from "@/types/kanji";

const LEVEL_META: { id: JLPTLevel; label: string; kanjiPreview: string; href: string }[] = [
  { id: "n5", label: "JLPT N5", kanjiPreview: "一二三四五", href: "/n5" },
  { id: "n4", label: "JLPT N4", kanjiPreview: "仕事大学友", href: "/n4" },
  { id: "n3", label: "JLPT N3", kanjiPreview: "感情映画旅", href: "/n3" },
];

const DIFFICULTY: Record<JLPTLevel, string> = {
  n5: "Beginner",
  n4: "Elementary",
  n3: "Intermediate",
};

const KANJI_DATA: Record<JLPTLevel, unknown[]> = {
  n5: N5_KANJI,
  n4: N4_KANJI,
  n3: N3_KANJI,
};

export default function HomePage() {
  const levels = LEVEL_META.map((meta) => {
    const count = KANJI_DATA[meta.id].length;
    const days = getDayGroupsForLevel(meta.id).length;
    return {
      ...meta,
      description: `${DIFFICULTY[meta.id]} · ${count} kanji · ${days} day groups`,
    };
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-16">
      <h1
        className="text-center font-extrabold text-xl tracking-widest mb-1"
        style={{ color: "var(--accent)" }}
      >
        Dinuprastha <span className="font-kanji text-2xl">漢字</span> Challenge
      </h1>
      <p className="text-center text-sm mb-10" style={{ color: "var(--text-sub)" }}>
        Choose a JLPT level to start studying
      </p>

      <div className="flex flex-col gap-5">
        {levels.map((level) => (
          <LevelCard key={level.id} {...level} />
        ))}
      </div>
    </div>
  );
}
