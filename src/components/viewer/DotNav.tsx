"use client";

interface Props {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

export function DotNav({ total, current, onDotClick }: Props) {
  return (
    <div className="flex gap-1.5 mb-4 flex-wrap justify-center max-w-sm">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className="w-6 h-6 rounded-full text-[11px] font-bold text-white flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0"
          style={{
            background: i === current ? "var(--accent)" : "var(--dot-inactive)",
            transform: i === current ? "scale(1.2)" : "scale(1)",
          }}
          aria-label={`Go to kanji ${i + 1}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
