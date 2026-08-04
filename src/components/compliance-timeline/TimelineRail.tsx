// components/compliance-timeline/TimelineRail.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { TimelineMiniCalendar } from "./TimelineMiniCalendar";
import { AdvancedControlsDrawer } from "./AdvancedControlsDrawer";

type NodePosition = "top" | "bottom";

interface TimelineNode {
  id: string;
  day: number;
  label: string;
  title: string;
  description: string;
  position: NodePosition;
  accent: "cyan" | "violet" | "amber" | "emerald";
  active?: boolean;
  sparkline?: number[];
}

const NODES: TimelineNode[] = [
  {
    id: "regulatory-change",
    day: 18,
    label: "Regulatory Change",
    title: "Bi-Annual VAPT Audit obligation created",
    description: "New obligation registered from regulator feed update.",
    position: "top",
    accent: "cyan",
  },
  {
    id: "risk-recalculated",
    day: 20,
    label: "Risk Recalculated",
    title: "Risk Recalculated",
    description: "Technology department risk score recalculated.",
    position: "bottom",
    accent: "violet",
    active: true,
    sparkline: [12, 18, 14, 22, 30, 26, 34, 40],
  },
  {
    id: "evidence-uploaded",
    day: 23,
    label: "Evidence Uploaded",
    title: "Evidence Uploaded",
    description: "Control owner attached audit evidence packet.",
    position: "top",
    accent: "emerald",
  },
  {
    id: "status-transition",
    day: 26,
    label: "Status Transition",
    title: "Status Transition",
    description: "Case moved from Under Review to Remediation.",
    position: "bottom",
    accent: "amber",
  },
  {
    id: "workflow-history",
    day: 29,
    label: "Workflow History",
    title: "Workflow History",
    description: "Approval chain updated with two new sign-offs.",
    position: "top",
    accent: "cyan",
  },
];

const ACCENT_STYLES: Record<
  TimelineNode["accent"],
  { border: string; bg: string; text: string; glow: string; dot: string }
> = {
  cyan: {
    border: "border-cyan-500/25",
    bg: "bg-cyan-950/35",
    text: "text-cyan-300",
    glow: "shadow-[0_0_30px_-10px_rgba(34,211,238,0.55)]",
    dot: "bg-cyan-400",
  },
  violet: {
    border: "border-violet-500/25",
    bg: "bg-violet-950/35",
    text: "text-violet-300",
    glow: "shadow-[0_0_30px_-10px_rgba(167,139,250,0.55)]",
    dot: "bg-violet-400",
  },
  amber: {
    border: "border-amber-500/25",
    bg: "bg-amber-950/35",
    text: "text-amber-300",
    glow: "shadow-[0_0_30px_-10px_rgba(251,191,36,0.55)]",
    dot: "bg-amber-400",
  },
  emerald: {
    border: "border-emerald-500/25",
    bg: "bg-emerald-950/35",
    text: "text-emerald-300",
    glow: "shadow-[0_0_30px_-10px_rgba(52,211,153,0.55)]",
    dot: "bg-emerald-400",
  },
};

function Sparkline({ values }: { values: number[] }) {
  const width = 220;
  const height = 44;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-11 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="rgb(167,139,250)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TimelineRail() {
  const [scrubValue, setScrubValue] = useState(50);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedIndex = useMemo(() => {
    const raw = Math.round((scrubValue / 100) * (NODES.length - 1));
    return Math.min(NODES.length - 1, Math.max(0, raw));
  }, [scrubValue]);

  const nodeXPositions = useMemo(() => {
    return NODES.map((_, i) => 10 + (i * 80) / (NODES.length - 1));
  }, []);

  const connectorPath = (xPercent: number, position: NodePosition) => {
    const startY = 50;
    const endY = position === "top" ? 22 : 78;
    const midY = (startY + endY) / 2;
    return `M ${xPercent} ${startY} C ${xPercent} ${midY}, ${xPercent} ${midY}, ${xPercent} ${endY}`;
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden rounded-[30px] border border-white/10 bg-[#070e17] p-5 lg:p-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
            <History size={18} className="text-cyan-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Compliance Timeline
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              Horizontal replay workspace
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <button
              type="button"
              onClick={() => setScrubValue((v) => Math.max(0, v - 10))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-cyan-400/50 hover:text-cyan-300"
              aria-label="Scrub backward"
            >
              <ChevronLeft size={16} />
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={scrubValue}
              onChange={(e) => setScrubValue(Number(e.target.value))}
              className="w-52 accent-cyan-400"
              aria-label="Timeline scrubber"
            />

            <button
              type="button"
              onClick={() => setScrubValue((v) => Math.min(100, v + 10))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-cyan-400/50 hover:text-cyan-300"
              aria-label="Scrub forward"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-cyan-400/40 hover:text-white"
          >
            Advanced controls
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-[#070e17]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <line
            x1="10"
            y1="50"
            x2="90"
            y2="50"
            stroke="rgba(34,211,238,0.28)"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />
          {NODES.map((node, i) => (
            <path
              key={node.id}
              d={connectorPath(nodeXPositions[i], node.position)}
              fill="none"
              stroke={node.active ? "rgba(167,139,250,0.75)" : "rgba(34,211,238,0.34)"}
              strokeWidth="0.32"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full min-w-[1120px] items-center justify-between gap-6 px-8 py-10">
            {NODES.map((node, i) => {
              const accent = ACCENT_STYLES[node.accent];
              const isTop = node.position === "top";
              const isSelected = i === selectedIndex;

              const marker = (
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-white transition-all ${
                    node.active
                      ? "border-violet-400 bg-violet-500/30"
                      : "border-cyan-400 bg-cyan-500/20"
                  } ${isSelected ? "scale-110" : ""}`}
                >
                  {node.day}
                </div>
              );

              const card = (
                <div
                  className={`w-60 rounded-2xl border p-4 backdrop-blur-md transition-all duration-300 ${
                    node.active
                      ? `border-white/20 bg-zinc-900/90 ${accent.glow}`
                      : `${accent.border} ${accent.bg}`
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-xs font-semibold ${node.active ? "text-white" : accent.text}`}>
                      {node.label}
                    </p>
                    <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} />
                  </div>

                  <p className="mt-2 text-sm font-semibold leading-6 text-white">{node.title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{node.description}</p>

                  {node.sparkline ? <Sparkline values={node.sparkline} /> : null}
                </div>
              );

              return (
                <div
                  key={node.id}
                  className={`flex flex-col items-center gap-5 transition-transform ${
                    node.active ? "-translate-y-3" : ""
                  }`}
                >
                  {isTop ? (
                    <>
                      {card}
                      {marker}
                    </>
                  ) : (
                    <>
                      {marker}
                      {card}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-20 w-[280px]">
          <TimelineMiniCalendar selectedDay={NODES[selectedIndex].day} />
        </div>

        <div className="absolute right-6 top-6 z-20 hidden w-[320px] xl:block">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Current focus
            </p>
            <p className="mt-2 text-lg font-semibold text-white">{NODES[selectedIndex].title}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{NODES[selectedIndex].description}</p>
          </div>
        </div>
      </div>

      <AdvancedControlsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}