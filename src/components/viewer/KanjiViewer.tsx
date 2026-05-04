"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { DayGroup } from "@/types/kanji";
import { KanjiCard } from "./KanjiCard";
import { DotNav } from "./DotNav";

interface Props {
  group: DayGroup;
  studiedIndices: number[];
  favoriteIndices: number[];
  isLoggedIn: boolean;
}

type SlideDir = "left" | "right" | "none";

export function KanjiViewer({ group, studiedIndices, favoriteIndices, isLoggedIn }: Props) {
  const [current, setCurrent] = useState(0);
  const [slideDir, setSlideDir] = useState<SlideDir>("none");
  const [studied, setStudied] = useState<Set<number>>(new Set(studiedIndices));
  const [favorites, setFavorites] = useState<Set<number>>(new Set(favoriteIndices));

  const touchStartX = useRef<number | null>(null);
  const total = group.kanji.length;
  const kanji = group.kanji[current];
  const globalIndex = group.start + current;

  // Mark as studied on view
  useEffect(() => {
    if (!isLoggedIn || studied.has(globalIndex)) return;
    setStudied((prev) => new Set([...prev, globalIndex]));
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kanji_index: globalIndex }),
    });
  }, [globalIndex, isLoggedIn, studied]);

  const navigate = useCallback((dir: 1 | -1) => {
    const next = current + dir;
    if (next < 0 || next >= total) return;
    setSlideDir(dir === 1 ? "left" : "right");
    setTimeout(() => {
      setCurrent(next);
      setSlideDir("none");
    }, 280);
  }, [current, total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const toggleFavorite = async () => {
    if (!isLoggedIn) return;
    const isFav = favorites.has(globalIndex);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(globalIndex);
      else next.add(globalIndex);
      return next;
    });
    fetch("/api/favorites", {
      method: isFav ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kanji_index: globalIndex }),
    });
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-60px)] px-4 py-6 pb-10">
      {/* Back */}
      <Link
        href="/"
        className="self-start mb-5 px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide transition-colors hover:opacity-80"
        style={{ border: "2px solid var(--accent)", color: "var(--accent)" }}
      >
        ← Back to Days
      </Link>

      {/* Heading */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-sub)" }}>
        {group.label} · {group.start + 1}–{group.end}
      </p>

      {/* Dots */}
      <DotNav total={total} current={current} onDotClick={(i) => {
        if (i === current) return;
        setSlideDir(i > current ? "left" : "right");
        setTimeout(() => { setCurrent(i); setSlideDir("none"); }, 280);
      }} />

      {/* Card */}
      <div
        className="relative w-full max-w-md overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={
          slideDir === "left" ? "slide-out-left" :
          slideDir === "right" ? "slide-out-right" : ""
        }>
          <KanjiCard
            kanji={kanji}
            globalIndex={globalIndex}
            position={current + 1}
            total={total}
            isFavorite={favorites.has(globalIndex)}
            isStudied={studied.has(globalIndex)}
            isLoggedIn={isLoggedIn}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 mt-5">
        <button
          onClick={() => navigate(-1)}
          disabled={current === 0}
          className="px-8 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all active:scale-95 disabled:opacity-40 disabled:cursor-default cursor-pointer"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          ← Prev
        </button>
        <button
          onClick={() => navigate(1)}
          disabled={current === total - 1}
          className="px-8 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all active:scale-95 disabled:opacity-40 disabled:cursor-default cursor-pointer"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Next →
        </button>
      </div>

      <p className="text-[11px] mt-3 tracking-wide" style={{ color: "var(--hint-color)" }}>
        ✦ swipe left / right or use arrow keys ✦
      </p>
    </div>
  );
}
