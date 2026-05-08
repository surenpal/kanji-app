import { LevelCard } from "@/components/home/LevelCard";

const LEVELS = [
  {
    id: "n5",
    label: "JLPT N5",
    description: "Beginner · 66 kanji · 3 day groups",
    kanjiPreview: "一二三四五",
    href: "/n5",
  },
  {
    id: "n4",
    label: "JLPT N4",
    description: "Elementary · 116 kanji · 4 day groups",
    kanjiPreview: "仕事大学友",
    href: "/n4",
  },
  {
    id: "n3",
    label: "JLPT N3",
    description: "Intermediate · 144 kanji · 5 day groups",
    kanjiPreview: "感情映画旅",
    href: "/n3",
  },
];

export default function HomePage() {
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
        {LEVELS.map((level) => (
          <LevelCard key={level.id} {...level} />
        ))}
      </div>
    </div>
  );
}
