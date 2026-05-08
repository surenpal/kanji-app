import type { Kanji, DayGroup, JLPTLevel } from "@/types/kanji";
import n5Data from "@/data/n5kanji.json";
import n4Data from "@/data/n4kanji.json";
import n3Data from "@/data/n3kanji.json";

export const N5_KANJI: Kanji[] = n5Data as Kanji[];
export const N4_KANJI: Kanji[] = n4Data as Kanji[];
export const N3_KANJI: Kanji[] = n3Data as Kanji[];

export const ALL_KANJI: Kanji[] = [...N5_KANJI, ...N4_KANJI, ...N3_KANJI];

export function getKanjiForLevel(level: JLPTLevel): Kanji[] {
  if (level === "n5") return N5_KANJI;
  if (level === "n4") return N4_KANJI;
  return N3_KANJI;
}

export function getLevelOffset(level: JLPTLevel): number {
  if (level === "n5") return 0;
  if (level === "n4") return N5_KANJI.length;
  return N5_KANJI.length + N4_KANJI.length;
}

export function getDayGroupsForLevel(level: JLPTLevel): DayGroup[] {
  const kanji = getKanjiForLevel(level);
  const offset = getLevelOffset(level);
  const groups: DayGroup[] = [];
  for (let i = 0; i < kanji.length; i += GROUP_SIZE) {
    const day = Math.floor(i / GROUP_SIZE) + 1;
    const start = offset + i;
    const end = offset + Math.min(i + GROUP_SIZE, kanji.length);
    groups.push({
      day,
      label: `Day ${day}`,
      start,
      end,
      kanji: kanji.slice(i, i + GROUP_SIZE),
    });
  }
  return groups;
}

export function getDayGroupForLevel(level: JLPTLevel, day: number): DayGroup | null {
  const groups = getDayGroupsForLevel(level);
  return groups.find((g) => g.day === day) ?? null;
}

const GROUP_SIZE = 30;

export function getDayGroups(): DayGroup[] {
  const groups: DayGroup[] = [];
  for (let i = 0; i < ALL_KANJI.length; i += GROUP_SIZE) {
    const day = Math.floor(i / GROUP_SIZE) + 1;
    const start = i;
    const end = Math.min(i + GROUP_SIZE, ALL_KANJI.length);
    groups.push({
      day,
      label: `Day ${day}`,
      start,
      end,
      kanji: ALL_KANJI.slice(start, end),
    });
  }
  return groups;
}

export function getDayGroup(day: number): DayGroup | null {
  const groups = getDayGroups();
  return groups.find((g) => g.day === day) ?? null;
}

export function getKanjiByIndex(index: number): Kanji | null {
  return ALL_KANJI[index] ?? null;
}

export function getKanjiByIndices(indices: number[]): Kanji[] {
  return indices
    .map((i) => ALL_KANJI[i])
    .filter((k): k is Kanji => k !== undefined);
}

/** Returns a random subset of kanji (used for quiz distractors) */
export function getRandomKanji(
  count: number,
  excludeIndex: number
): Kanji[] {
  const pool = ALL_KANJI.filter((_, i) => i !== excludeIndex);
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
