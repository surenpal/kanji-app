import { createClient } from "@/lib/supabase/server";
import { getDayGroups, ALL_KANJI } from "@/lib/kanji";
import { QuizClient } from "@/components/quiz/QuizClient";

export default async function QuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const groups = getDayGroups();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-16">
      <h1 className="text-center font-extrabold text-xl tracking-widest mb-1"
          style={{ color: "var(--accent)" }}>
        Quiz Mode
      </h1>
      <p className="text-center text-sm mb-8" style={{ color: "var(--text-sub)" }}>
        Test your knowledge · choose a day and answer 10 questions
      </p>
      <QuizClient
        groups={groups}
        totalKanji={ALL_KANJI.length}
        isLoggedIn={!!user}
      />
    </div>
  );
}
