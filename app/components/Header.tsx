"use client";

import Link from "next/link";
import KenyaFlagImage from "./KenyaFlagImage";

export default function Header({ onFocusChat }: { onFocusChat?: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#121716]/95 backdrop-blur-xl">
      <div className="container-app flex h-16 items-center justify-between gap-2 sm:h-[70px] sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="h-9 w-11 shrink-0 overflow-hidden rounded-md border border-white/15 bg-white/5 shadow-[0_0_22px_rgba(14,165,233,0.18)] sm:h-10 sm:w-12">
            <KenyaFlagImage priority className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-sky-300">Kenya</p>
            <h1 className="font-tech truncate text-xs font-semibold text-white sm:text-base">Finance Bill Intelligence</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-xs font-semibold text-white/75 md:flex">
          <Link href="/" className="transition hover:text-sky-300">Home</Link>
          <Link href="/#analysis" className="transition hover:text-sky-300">Bill</Link>
          <Link href="/process" className="transition hover:text-sky-300">Process</Link>
          <Link href="/about" className="transition hover:text-sky-300">About</Link>
          <Link href="/faq" className="transition hover:text-sky-300">FAQ</Link>
        </nav>

        {onFocusChat ? (
          <button
            type="button"
            onClick={onFocusChat}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-red-500 px-3 font-tech text-[11px] font-semibold text-white shadow-[0_0_22px_rgba(239,68,68,0.25)] transition hover:bg-red-400 sm:h-11 sm:px-4 sm:text-xs"
          >
            Ask AI
          </button>
        ) : (
          <Link
            href="/"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-red-500 px-3 font-tech text-[11px] font-semibold text-white shadow-[0_0_22px_rgba(239,68,68,0.25)] transition hover:bg-red-400 sm:h-11 sm:px-4 sm:text-xs"
          >
            Ask AI
          </Link>
        )}
      </div>
    </header>
  );
}
