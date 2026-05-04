import { NextRequest, NextResponse } from "next/server";
import { getDayGroup, getDayGroups } from "@/lib/kanji";

// GET /api/kanji?day=1   → returns kanji for that day
// GET /api/kanji          → returns all day group metadata (no vocab, lighter payload)
export async function GET(req: NextRequest) {
  const day = req.nextUrl.searchParams.get("day");

  if (day) {
    const dayNum = parseInt(day, 10);
    const group = getDayGroup(dayNum);
    if (!group) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }
    return NextResponse.json(group);
  }

  // Return slim group metadata
  const groups = getDayGroups().map(({ day, label, start, end, kanji }) => ({
    day,
    label,
    start,
    end,
    count: kanji.length,
    preview: kanji.slice(0, 10).map((k) => k.kanji).join(""),
  }));

  return NextResponse.json(groups);
}
