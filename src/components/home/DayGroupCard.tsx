"use client";

import Link from "next/link";
import type { DayGroup } from "@/types/kanji";

interface Props {
  group: DayGroup;
  studiedCount: number;
  isLoggedIn: boolean;
}

export function DayGroupCard({ group, studiedCount, isLoggedIn }: Props) {
  const total = group.kanji.length;
  const pct = total > 0 ? Math.round((studiedCount / total) * 100) : 0;
  const done = studiedCount === total && total > 0;

  return (
    <Link href={`/day/${group.day}`} className="block group">
      <div
        className="rounded-2xl p-5 cursor-pointer transition-all duration-200 group-hover:-translate-y-1"
        style={{
          background: "var(--bg-group)",
          border: `1.5px solid ${done ? "var(--accent)" : "var(--border-group)"}`,
          boxShadow: "var(--shadow-group)",
        }}
      >
        <div className="text-[11px] font-bold tracking-widest uppercase mb-1.5"
             style={{ color: "var(--accent)" }}>
          {group.label}
        </div>
        <div className="text-lg font-extrabold mb-2.5" style={{ color: "var(--text-main)" }}>
          #{group.start + 1} – #{group.end}
        </div>
        <div className="font-kanji text-lg tracking-widest leading-relaxed break-all mb-2"
             style={{ color: "var(--text-sub)" }}>
          {group.kanji.slice(0, 10).map((k) => k.kanji).join(" ")}
        </div>

        {/* Progress bar */}
        {isLoggedIn && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] mb-1"
                 style={{ color: "var(--dot-inactive)" }}>
              <span>{studiedCount}/{total} studied</span>
              <span>{pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: "var(--dot-inactive)" }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${pct}%`, background: "var(--accent)" }}
              />
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="text-[11px] mt-1" style={{ color: "var(--dot-inactive)" }}>
            {total} kanji
          </div>
        )}
      </div>
    </Link>
  );
}
