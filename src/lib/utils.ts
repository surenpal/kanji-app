/** Merge class names (simple utility — no clsx dependency needed) */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Shuffle an array in place (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Given a day number (1-31) return the 0-based start index into ALL_KANJI */
export function dayToStartIndex(day: number): number {
  return (day - 1) * 30;
}
