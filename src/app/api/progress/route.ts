import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/progress   body: { kanji_index: number }
// Marks a kanji as studied (upsert)
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { kanji_index } = await req.json();
  if (typeof kanji_index !== "number") {
    return NextResponse.json({ error: "Invalid kanji_index" }, { status: 400 });
  }

  const { error } = await supabase.from("user_progress").upsert(
    { user_id: user.id, kanji_index, studied_at: new Date().toISOString() },
    { onConflict: "user_id,kanji_index" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// PATCH /api/progress  body: { kanji_index: number, correct: boolean }
// Updates quiz stats for a kanji
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { kanji_index, correct } = await req.json();

  // Use Supabase RPC to atomically increment quiz counters
  const { data: existing } = await supabase
    .from("user_progress")
    .select("quiz_correct, quiz_attempted")
    .eq("user_id", user.id)
    .eq("kanji_index", kanji_index)
    .single();

  const quiz_attempted = (existing?.quiz_attempted ?? 0) + 1;
  const quiz_correct = (existing?.quiz_correct ?? 0) + (correct ? 1 : 0);

  const { error } = await supabase.from("user_progress").upsert(
    { user_id: user.id, kanji_index, quiz_correct, quiz_attempted },
    { onConflict: "user_id,kanji_index" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
