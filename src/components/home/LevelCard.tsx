import Link from "next/link";

interface Props {
  id: string;
  label: string;
  description: string;
  kanjiPreview: string;
  href: string;
}

export function LevelCard({ label, description, kanjiPreview, href }: Props) {
  return (
    <Link href={href} className="block group">
      <div
        className="rounded-2xl p-7 cursor-pointer transition-all duration-200 group-hover:-translate-y-1 flex flex-col gap-3"
        style={{
          background: "var(--bg-group)",
          border: "1.5px solid var(--border-group)",
          boxShadow: "var(--shadow-group)",
        }}
      >
        <div
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "var(--accent)" }}
        >
          {label}
        </div>
        <div
          className="font-kanji text-3xl tracking-widest leading-relaxed"
          style={{ color: "var(--text-main)" }}
        >
          {kanjiPreview}
        </div>
        <div className="text-sm" style={{ color: "var(--text-sub)" }}>
          {description}
        </div>
        <div
          className="text-xs font-bold tracking-wide mt-1 group-hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Start studying →
        </div>
      </div>
    </Link>
  );
}
