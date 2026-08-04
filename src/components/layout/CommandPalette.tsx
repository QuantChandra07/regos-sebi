"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useUIStore } from "@/lib/store";
import {
  mockCirculars,
  mockClauses,
  mockObligations,
  mockUsers,
} from "@/lib/seed-data";

interface Result {
  type: string;
  label: string;
  sub: string;
  route: string;
}

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toUpperCase();

      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery("");
    }
  }, [commandPaletteOpen]);

  const results: Result[] = useMemo(() => {
    const lower = query.trim().toLowerCase();

    const circularResults = mockCirculars
      .filter(
        (c) =>
          !lower ||
          c.title.toLowerCase().includes(lower) ||
          c.circularNumber.toLowerCase().includes(lower)
      )
      .map((c) => ({
        type: "Circular",
        label: c.title,
        sub: c.circularNumber,
        route: "/regulation-feed",
      }));

    const clauseResults = mockClauses
      .filter(
        (c) =>
          !lower ||
          c.clauseNumber.toLowerCase().includes(lower) ||
          c.content.toLowerCase().includes(lower)
      )
      .map((c) => ({
        type: "Clause",
        label: c.clauseNumber,
        sub:
          c.content.length > 90
            ? `${c.content.slice(0, 90)}...`
            : c.content,
        route: "/clause-intelligence",
      }));

    const obligationResults = mockObligations
      .filter(
        (o) =>
          !lower ||
          o.title.toLowerCase().includes(lower) ||
          o.department.toLowerCase().includes(lower) ||
          o.owner.toLowerCase().includes(lower)
      )
      .map((o) => ({
        type: "Obligation",
        label: o.title,
        sub: `${o.department} • ${o.owner}`,
        route: "/obligation-cards",
      }));

    const userResults = mockUsers
      .filter(
        (u) =>
          !lower ||
          u.name.toLowerCase().includes(lower) ||
          u.role.toLowerCase().includes(lower) ||
          u.department.toLowerCase().includes(lower)
      )
      .map((u) => ({
        type: "User",
        label: u.name,
        sub: `${u.role} • ${u.department}`,
        route: "/",
      }));

    return [
      ...circularResults,
      ...clauseResults,
      ...obligationResults,
      ...userResults,
    ].slice(0, 8);
  }, [query]);

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-800 bg-card shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-gray-800 px-4">
          <Search size={16} className="text-gray-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search circulars, clauses, obligations, users..."
            className="flex-1 bg-transparent px-3 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none font-mono"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="rounded p-1 text-gray-500 transition-colors hover:text-gray-300"
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className='p-4 font-mono text-xs text-gray-500'>
              No results. Try "cyber", "operations", "VAPT", or a circular number.
            </p>
          ) : (
            results.map((r, idx) => (
              <button
                key={`${r.type}-${idx}`}
                onClick={() => {
                  router.push(r.route);
                  setCommandPaletteOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-800/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-200">{r.label}</p>
                  <p className="truncate font-mono text-[11px] text-gray-500">
                    {r.sub}
                  </p>
                </div>
                <span className="ml-3 rounded border border-cyan-500/30 px-1.5 py-0.5 font-mono text-[10px] text-cyan-400">
                  {r.type}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};