"use client";

import React from "react";

interface AdvancedControlsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DEPARTMENTS = [
  { name: "Technology", value: 42, color: "#22d3ee" },
  { name: "Finance", value: 26, color: "#a78bfa" },
  { name: "Legal", value: 18, color: "#f59e0b" },
  { name: "Operations", value: 14, color: "#34d399" },
];

const RISK_TREND = [30, 34, 28, 40, 45, 38, 52, 48, 60];

const AI_OBSERVATIONS = [
  "Technology department risk trending upward for 3 consecutive cycles.",
  "Evidence upload latency improved by 18% after workflow automation.",
  "Two obligations are approaching their remediation deadline this week.",
];

function DonutChart({ data }: { data: typeof DEPARTMENTS }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0">
      <g transform="translate(50,50) rotate(-90)">
        {data.map((d) => {
          const fraction = d.value / total;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const offset = -(cumulative / total) * circumference;
          cumulative += d.value;

          return (
            <circle
              key={d.name}
              r={radius}
              cx="0"
              cy="0"
              fill="none"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </g>
    </svg>
  );
}

function TrendChart({ values }: { values: number[] }) {
  const width = 280;
  const height = 96;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdvancedControlsDrawer({ open, onClose }: AdvancedControlsDrawerProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto border-l border-white/10 bg-[#0a1119] p-5 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Advanced controls</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-cyan-400/50 hover:text-cyan-300"
            aria-label="Close advanced controls"
          >
            ✕
          </button>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-sm font-medium text-white/80">Department filtering</p>
          <div className="flex items-center gap-4">
            <DonutChart data={DEPARTMENTS} />
            <ul className="flex flex-1 flex-col gap-2 text-xs text-zinc-400">
              {DEPARTMENTS.map((d) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name} · {d.value}%
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-sm font-medium text-white/80">Risk evolution trend</p>
          <TrendChart values={RISK_TREND} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-sm font-medium text-white/80">AI observations</p>
          <ul className="flex flex-col gap-3">
            {AI_OBSERVATIONS.map((obs, i) => (
              <li
                key={i}
                className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-zinc-300"
              >
                {obs}
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </>
  );
}