"use client";

import { Bell, Search, Sparkles, SlidersHorizontal } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#08111d]/78 backdrop-blur-xl">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            RegOS-SEBI
          </p>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight text-white">
            AI-Native Compliance Workspace
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden min-w-[320px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-400 lg:flex">
            <Search size={15} className="text-zinc-500" />
            <span className="whitespace-nowrap">Search circulars, obligations, risks...</span>
          </div>

          <button
            type="button"
            className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-zinc-400 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white md:inline-flex"
          >
            <SlidersHorizontal size={16} />
            <span className="text-sm">Filters</span>
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 transition-all hover:bg-cyan-500/15"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">AI Assist</span>
          </button>
        </div>
      </div>
    </header>
  );
}