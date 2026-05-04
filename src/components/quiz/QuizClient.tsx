"use client";

import { useState } from "react";
import type { DayGroup, Kanji, QuizQuestion } from "@/types/kanji";
import { shuffle } from "@/lib/utils";
import { ALL_KANJI } from "@/lib/kanji";
import { QuizCard } from "./QuizCard";

interface Props {
  groups: DayGroup[];
  totalKanji: number;
  isLoggedIn: boolean;
}

const QUIZ_LENGTH = 10;

function buildQuiz(group: DayGroup): QuizQuestion[] {
  const shuffled = shuffle([...group.kanji]);
  const selected = shuffled.slice(0, QUIZ_LENGTH);

  return selected.map((kanji, i) => {
    const globalIndex = group.start + group.kanji.indexOf(kanji);
    // Pick 3 wrong answers from the full pool
    const distractors = shuffle(
      ALL_KANJI.filter((k) => k.kanji !== kanji.kanji)
    ).slice(0, 3);
    const options = shuffle([kanji.meaning, ...distractors.map((d) => d.meaning)]);
    const correctIndex = options.indexOf(kanji.meaning);
    return { kanji, globalIndex, options, correctIndex };
  });
}

export function QuizClient({ groups, isLoggedIn }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const startQuiz = (day: number) => {
    const group = groups.find((g) => g.day === day);
    if (!group) return;
    setSelectedDay(day);
    setQuestions(buildQuiz(group));
    setQuestionIndex(0);
    setScore(0);
    setChosen(null);
    setFinished(false);
  };

  const handleAnswer = (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    const q = questions[questionIndex];
    const correct = idx === q.correctIndex;
    if (correct) setScore((s) => s + 1);

    if (isLoggedIn) {
      fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanji_index: q.globalIndex, correct }),
      });
    }

    setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        setFinished(true);
      } else {
        setQuestionIndex((i) => i + 1);
        setChosen(null);
      }
    }, 1000);
  };

  const reset = () => {
    setSelectedDay(null);
    setFinished(false);
    setChosen(null);
  };

  // Day selector
  if (selectedDay === null) {
    return (
      <div>
        <p className="text-center text-sm mb-6" style={{ color: "var(--text-sub)" }}>
          Select a day to quiz yourself on
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
          {groups.map((g) => (
            <button
              key={g.day}
              onClick={() => startQuiz(g.day)}
              className="rounded-xl py-3 text-sm font-bold tracking-wide transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              style={{
                background: "var(--bg-group)",
                border: "1.5px solid var(--border-group)",
                color: "var(--text-main)",
                boxShadow: "var(--shadow-group)",
              }}
            >
              Day {g.day}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Finished screen
  if (finished) {
    const pct = Math.round((score / QUIZ_LENGTH) * 100);
    return (
      <div className="text-center py-10">
        <p className="font-kanji text-6xl mb-4" style={{ color: "var(--accent)" }}>
          {score >= 8 ? "🎉" : score >= 5 ? "👍" : "💪"}
        </p>
        <h2 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text-main)" }}>
          {score} / {QUIZ_LENGTH}
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-sub)" }}>
          {pct}% correct · Day {selectedDay}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => startQuiz(selectedDay)}
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Retry
          </button>
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 cursor-pointer"
            style={{ border: "1.5px solid var(--accent)", color: "var(--accent)" }}
          >
            Change Day
          </button>
        </div>
      </div>
    );
  }

  const q = questions[questionIndex];

  return (
    <div>
      {/* Progress */}
      <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-sub)" }}>
        <span>Question {questionIndex + 1} / {QUIZ_LENGTH}</span>
        <span>Score: {score}</span>
      </div>
      <div className="w-full h-1.5 rounded-full mb-6" style={{ background: "var(--dot-inactive)" }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${((questionIndex) / QUIZ_LENGTH) * 100}%`, background: "var(--accent)" }}
        />
      </div>

      <QuizCard
        question={q}
        chosen={chosen}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
