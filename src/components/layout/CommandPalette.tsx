"use client";

import { useEffect, useMemo, useState } from "react";
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

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
  } = useUIStore();

  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = (
        document.activeElement?.tagName || ""
      ).toUpperCase();

      if (
        event.key === "/" &&
        activeTag !== "INPUT" &&
        activeTag !== "TEXTAREA" &&
        activeTag !== "SELECT"
      ) {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery("");
    }
  }, [commandPaletteOpen]);

  const results = useMemo<Result[]>(() => {
    const searchTerm = query.trim().toLowerCase();

    const circularResults: Result[] = mockCirculars
      .filter(
        (circular) =>
          !searchTerm ||
          circular.title
            .toLowerCase()
            .includes(searchTerm) ||
          circular.circularNumber
            .toLowerCase()
            .includes(searchTerm),
      )
      .map((circular) => ({
        type: "Circular",
        label: circular.title,
        sub: circular.circularNumber,
        route: "/regulation-feed",
      }));

    const clauseResults: Result[] = mockClauses
      .filter(
        (clause) =>
          !searchTerm ||
          clause.clauseNumber
            .toLowerCase()
            .includes(searchTerm) ||
          clause.content
            .toLowerCase()
            .includes(searchTerm),
      )
      .map((clause) => ({
        type: "Clause",
        label: clause.clauseNumber,
        sub:
          clause.content.length > 90
            ? `${clause.content.slice(0, 90)}...`
            : clause.content,
        route: "/clause-intelligence",
      }));

    const obligationResults: Result[] =
      mockObligations
        .filter(
          (obligation) =>
            !searchTerm ||
            obligation.title
              .toLowerCase()
              .includes(searchTerm) ||
            obligation.department
              .toLowerCase()
              .includes(searchTerm) ||
            obligation.owner
              .toLowerCase()
              .includes(searchTerm),
        )
        .map((obligation) => ({
          type: "Obligation",
          label: obligation.title,
          sub: `${obligation.department} • ${obligation.owner}`,
          route: "/obligation-cards",
        }));

    const userResults: Result[] = mockUsers
      .filter(
        (user) =>
          !searchTerm ||
          user.name.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm) ||
          user.department
            .toLowerCase()
            .includes(searchTerm),
      )
      .map((user) => ({
        type: "User",
        label: user.name,
        sub: `${user.role} • ${user.department}`,
        route: "/",
      }));

    return [
      ...circularResults,
      ...clauseResults,
      ...obligationResults,
      ...userResults,
    ].slice(0, 8);
  }, [query]);

  if (!commandPaletteOpen) {
    return null;
  }

  const closePalette = () => {
    setCommandPaletteOpen(false);
  };

  const navigateToResult = (route: string) => {
    router.push(route);
    closePalette();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={closePalette}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-800 bg-card shadow-glow"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center border-b border-gray-800 px-4">
          <Search
            size={16}
            className="text-gray-500"
          />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search circulars, clauses, obligations, users..."
            className="flex-1 bg-transparent px-3 py-3 font-mono text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
          />

          <button
            type="button"
            onClick={closePalette}
            className="rounded p-1 text-gray-500 transition-colors hover:text-gray-300"
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="p-4 font-mono text-xs text-gray-500">
              No results. Try &quot;cyber&quot;,
              &quot;operations&quot;, &quot;VAPT&quot;, or a
              circular number.
            </p>
          ) : (
            results.map((result, index) => (
              <button
                key={`${result.type}-${index}`}
                type="button"
                onClick={() =>
                  navigateToResult(result.route)
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-800/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-200">
                    {result.label}
                  </p>

                  <p className="truncate font-mono text-[11px] text-gray-500">
                    {result.sub}
                  </p>
                </div>

                <span className="ml-3 rounded border border-cyan-500/30 px-1.5 py-0.5 font-mono text-[10px] text-cyan-400">
                  {result.type}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}