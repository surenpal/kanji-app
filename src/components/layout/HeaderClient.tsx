"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  user: { email: string } | null;
}

export function HeaderClient({ user }: Props) {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [lang, setLang] = useState<"en" | "ne">("en");

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "ne" : "en"));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm"
      style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-group)" }}
    >
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.png" alt="The Japan Room" width={56} height={56} className="rounded-full" priority />
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-3">
        <Link href="/"
          className="text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
          style={{ color: "var(--text-sub)", border: "1.5px solid var(--border-group)" }}>
          Home
        </Link>

        <Link href="/quiz"
          className="text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
          style={{ color: theme === "dark" ? "#fff" : "var(--accent)", border: "1.5px solid var(--accent)" }}>
          Quiz
        </Link>

        {user ? (
          <>
            <Link href="/favorites"
              className="text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{ color: "var(--text-sub)", border: "1.5px solid var(--border-group)" }}>
              ★ Favs
            </Link>
            <button
              onClick={signOut}
              className="hidden text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors hover:opacity-80 cursor-pointer"
              style={{ color: "var(--text-sub)", border: "1.5px solid var(--border-group)" }}>
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth/login"
            className="hidden text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}>
            Sign In
          </Link>
        )}

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="text-xs font-bold tracking-wider px-3 py-1.5 rounded-lg transition-all hover:scale-105 cursor-pointer"
          style={{ border: "1.5px solid var(--border-group)", color: "var(--text-sub)", background: "var(--bg-card)" }}
          title="Toggle language"
        >
          {lang === "en" ? "EN" : "नेपाली"}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all hover:scale-110 cursor-pointer"
          style={{ border: "2px solid var(--accent)", background: "var(--bg-card)", color: "var(--accent)" }}
          title="Toggle theme"
        >
          {theme === "light" ? "☀️" : "🌙"}
        </button>
      </nav>
    </header>
  );
}
