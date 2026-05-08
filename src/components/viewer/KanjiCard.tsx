import type { Kanji } from "@/types/kanji";
import type { Lang } from "@/components/layout/LanguageProvider";

interface Props {
  kanji: Kanji;
  globalIndex: number;
  position: number;
  total: number;
  isFavorite: boolean;
  isStudied: boolean;
  isLoggedIn: boolean;
  onToggleFavorite: () => void;
  lang: Lang;
}

export function KanjiCard({
  kanji, position, total, isFavorite, isLoggedIn, onToggleFavorite, lang,
}: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-card)" }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: "var(--accent)" }}
      >
        <span className="text-xs font-bold tracking-widest uppercase text-white">
          Kanji Study
        </span>
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <button
              onClick={onToggleFavorite}
              className="text-lg transition-transform hover:scale-125 cursor-pointer"
              title={isFavorite ? "Remove from favourites" : "Add to favourites"}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          )}
          <span className="text-[11px] text-white/75 tracking-wide">
            {position} / {total}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-8 py-7">
        {/* Kanji character */}
        <div
          className="w-40 h-40 mx-auto mb-7 rounded-xl flex items-center justify-center"
          style={{
            border: "2.5px solid var(--accent)",
            background: "var(--bg-kanji-box)",
            boxShadow: "var(--shadow-kanji)",
          }}
        >
          <span
            className="font-kanji leading-none select-none"
            style={{ fontSize: "100px", color: "var(--text-main)" }}
          >
            {kanji.kanji}
          </span>
        </div>

        {/* Info table */}
        <table className="w-full mb-5">
          <tbody>
            <tr>
              <td className="text-[10px] font-bold tracking-widest uppercase w-20 py-1.5"
                  style={{ color: "var(--accent)" }}>On</td>
              <td className="font-kanji text-base py-1.5" style={{ color: "var(--text-main)" }}>
                {kanji.on || "—"}
              </td>
            </tr>
            <tr>
              <td className="text-[10px] font-bold tracking-widest uppercase w-20 py-1.5"
                  style={{ color: "var(--accent)" }}>Kun</td>
              <td className="font-kanji text-base py-1.5" style={{ color: "var(--text-main)" }}>
                {kanji.kun || "—"}
              </td>
            </tr>
            <tr>
              <td className="text-[10px] font-bold tracking-widest uppercase w-20 py-1.5"
                  style={{ color: "var(--accent)" }}>Meaning</td>
              <td className="text-[15px] py-1.5" style={{ color: "var(--text-main)" }}>
                {lang === "ne" && kanji.meaning_ne && (
                  <span className="block text-sm" style={{ color: "var(--accent)" }}>
                    {kanji.meaning_ne}
                  </span>
                )}
                {kanji.meaning}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Divider */}
        <hr className="mb-5 opacity-40" style={{ borderColor: "var(--accent)" }} />

        {/* Vocabulary */}
        <p className="text-xs font-bold tracking-widest uppercase mb-3"
           style={{ color: "var(--accent)" }}>
          Vocabulary
        </p>
        <div className="flex flex-col gap-2.5">
          {kanji.vocab.map((v, i) => (
            <div
              key={i}
              className="flex items-baseline gap-2.5 rounded-lg px-3.5 py-2.5"
              style={{ background: "var(--bg-vocab-row)", boxShadow: "var(--shadow-vocab)" }}
            >
              <span className="font-kanji text-lg min-w-12" style={{ color: "var(--text-main)" }}>
                {v.word}
              </span>
              <span className="font-kanji text-xs shrink-0" style={{ color: "var(--text-reading)" }}>
                {v.reading}
              </span>
              {lang === "ne" && v.meaning_ne && (
                <span className="text-xs shrink-0" style={{ color: "var(--accent)" }}>
                  {v.meaning_ne}
                </span>
              )}
              <span className="text-xs ml-auto text-right" style={{ color: "var(--text-meaning)" }}>
                {v.meaning}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card footer */}
      <div
        className="py-2.5 text-center text-[10px] tracking-widest uppercase text-white"
        style={{ background: "var(--accent)" }}
      >
        Dinuprastha · 漢字 Challenge
      </div>
    </div>
  );
}
