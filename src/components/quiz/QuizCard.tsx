"use client";

import type { QuizQuestion } from "@/types/kanji";
import type { Lang } from "@/components/layout/LanguageProvider";

interface Props {
  question: QuizQuestion;
  chosen: number | null;
  onAnswer: (index: number) => void;
  lang: Lang;
}

export function QuizCard({ question, chosen, onAnswer, lang }: Props) {
  const { kanji, options, options_ne, correctIndex } = question;
  const displayOptions = lang === "ne" ? options_ne : options;

  const getBorderColor = (i: number) => {
    if (chosen === null) return "var(--border-group)";
    if (i === correctIndex) return "#22c55e";
    if (i === chosen) return "#ef4444";
    return "var(--border-group)";
  };

  const getBg = (i: number) => {
    if (chosen === null) return "var(--bg-group)";
    if (i === correctIndex) return "rgba(34,197,94,0.12)";
    if (i === chosen) return "rgba(239,68,68,0.12)";
    return "var(--bg-group)";
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-card)" }}
    >
      {/* Header */}
      <div className="py-3 text-center text-xs font-bold tracking-widest uppercase text-white"
           style={{ background: "var(--accent)" }}>
        What does this kanji mean?
      </div>

      {/* Kanji display */}
      <div className="py-10 flex flex-col items-center gap-4">
        <div
          className="w-36 h-36 rounded-2xl flex items-center justify-center"
          style={{
            border: "2.5px solid var(--accent)",
            background: "var(--bg-kanji-box)",
            boxShadow: "var(--shadow-kanji)",
          }}
        >
          <span className="font-kanji leading-none" style={{ fontSize: "90px", color: "var(--text-main)" }}>
            {kanji.kanji}
          </span>
        </div>
        <div className="text-center">
          <p className="font-kanji text-sm" style={{ color: "var(--text-reading)" }}>
            {kanji.on}
            {kanji.kun ? ` · ${kanji.kun}` : ""}
          </p>
        </div>
      </div>

      {/* Answer options */}
      <div className="px-6 pb-8 grid grid-cols-2 gap-3">
        {displayOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            disabled={chosen !== null}
            className="rounded-xl py-3 px-4 text-sm font-semibold text-left transition-all duration-200 cursor-pointer disabled:cursor-default"
            style={{
              background: getBg(i),
              border: `2px solid ${getBorderColor(i)}`,
              color: "var(--text-main)",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
