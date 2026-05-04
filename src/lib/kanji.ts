import type { Kanji, DayGroup } from "@/types/kanji";
import kanjiData from "@/data/kanji.json";

export const ALL_KANJI: Kanji[] = kanjiData as Kanji[];

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
