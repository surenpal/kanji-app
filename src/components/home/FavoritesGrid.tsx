"use client";

import Link from "next/link";
import type { Kanji } from "@/types/kanji";

interface Props {
  kanjiList: Kanji[];
  globalIndices: number[];
}

export function FavoritesGrid({ kanjiList, globalIndices }: Props) {
  if (kanjiList.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: "var(--text-sub)" }}>
        <p className="font-kanji text-5xl mb-4">空</p>
        <p className="text-sm">No favourites yet — star a kanji while studying to save it here.</p>
        <Link href="/" className="inline-block mt-6 px-6 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{ background: "var(--accent)", color: "#fff" }}>
          Start Studying
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
      {kanjiList.map((k, i) => {
        const globalIdx = globalIndices[i];
        const day = Math.floor(globalIdx / 30) + 1;

        return (
          <Link href={`/day/${day}`} key={globalIdx} className="block group">
            <div
              className="rounded-xl p-4 text-center transition-all duration-200 group-hover:-translate-y-1 cursor-pointer"
              style={{
                background: "var(--bg-group)",
                border: "1.5px solid var(--border-group)",
                boxShadow: "var(--shadow-group)",
              }}
            >
              <div className="font-kanji text-5xl mb-2" style={{ color: "var(--text-main)" }}>
                {k.kanji}
              </div>
              <div className="text-xs font-bold mb-1" style={{ color: "var(--accent)" }}>
                {k.meaning.split(";")[0]}
              </div>
              <div className="text-[10px]" style={{ color: "var(--text-reading)" }}>
                Day {day}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
