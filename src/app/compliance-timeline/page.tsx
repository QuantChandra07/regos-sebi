// app/compliance-timeline/page.tsx
"use client";

import React from "react";
import { Activity, History, Sparkles } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { TimelineRail } from "../../components/compliance-timeline/TimelineRail";

const summaryCards = [
  {
    eyebrow: "Replay summary",
    title: "Historical compliance posture",
    body: "The workflow moves from intake to evidence review with the clearest change after control owner upload.",
  },
  {
    eyebrow: "Layout note",
    title: "Horizontal fit",
    body: "This page uses a wide workspace, side rail, and a single timeline canvas instead of stacked vertical sections.",
  },
];

const rightRailCards = [
  {
    title: "Department filtering",
    eyebrow: "Advanced controls",
    body: "Technology, compliance, operations, legal, and risk views are kept visible in a compact analyst panel.",
  },
  {
    title: "Risk evolution",
    eyebrow: "Trend watch",
    body: "Residual risk softens after evidence verification and workflow progression, showing a controlled posture shift.",
  },
  {
    title: "AI observations",
    eyebrow: "Workspace insights",
    body: "The system highlights historical replay points where evidence, obligations, and risk changed together.",
  },
];

const chronology = [
  {
    date: "08 Jul 2026",
    title: "Circular ingested into regulation feed",
    detail:
      "A new SEBI circular was captured, classified, and queued for downstream parsing across the compliance pipeline.",
    status: "INGESTED",
  },
  {
    date: "10 Jul 2026",
    title: "Clauses extracted and normalized",
    detail:
      "Clause intelligence converted legal prose into section-level machine fragments for obligation mapping.",
    status: "PARSED",
  },
  {
    date: "12 Jul 2026",
    title: "Obligations assigned to departments",
    detail:
      "Compliance, legal, and operations workflows were generated for impacted obligations and accountability routing.",
    status: "ASSIGNED",
  },
  {
    date: "17 Jul 2026",
    title: "Evidence submitted for first-pass review",
    detail:
      "Control owners uploaded initial support files and linked them to open tasks for review readiness.",
    status: "UPLOADED",
  },
  {
    date: "20 Jul 2026",
    title: "Risk engine updated department posture",
    detail:
      "Residual exposure was recalculated using workflow status, evidence presence, and department-level ownership signals.",
    status: "HIGH",
  },
];

export default function ComplianceTimelinePage() {
  return (
    <div className="space-y-4 overflow-hidden">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Governance chronology</p>
          <h1 className="page-title mt-4">Compliance Timeline</h1>
          <p className="page-subtitle max-w-3xl">
            Trace the lifecycle from circular intake to obligation assignment, evidence linkage,
            and risk scoring.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Timeline state
              </p>
              <p className="mt-2 text-lg font-semibold text-white">End-to-end compliance trail</p>
              <p className="mt-1 text-sm text-zinc-400">Cross-stage accountability history</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
              <History size={18} className="text-cyan-300" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid min-h-[760px] gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card className="rounded-[28px] p-5 lg:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Replay view
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Historical compliance playback
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  A compact horizontal timeline designed to fit the page without stacking everything
                  vertically.
                </p>
              </div>

              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-right md:block">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Selected date</p>
                <p className="mt-1 text-sm font-semibold text-white">Jul 20, 2026</p>
              </div>
            </div>
          </Card>

          <div className="flex-1 min-h-[520px]">
            <TimelineRail />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {summaryCards.map((card) => (
              <Card key={card.title} className="rounded-[28px] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {card.eyebrow}
                </p>
                <p className="mt-2 text-base font-semibold text-white">{card.title}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{card.body}</p>
              </Card>
            ))}
          </div>

          <Card className="rounded-[28px] p-5 lg:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Chronology strip
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Audit checkpoints
                </h2>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 md:block">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">View mode</p>
                <p className="mt-1 text-sm font-semibold text-white">Horizontal grid</p>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className="grid min-w-[980px] grid-cols-5 gap-4">
                {chronology.map((item, index) => {
                  const isEmphasized = index === 2;
                  return (
                    <div
                      key={`${item.date}-${item.title}`}
                      className={`rounded-[22px] border p-4 transition-all duration-300 ${
                        isEmphasized
                          ? "border-cyan-400/20 bg-cyan-500/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.045]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500">
                            {item.date}
                          </p>
                          <p className="mt-1 text-base font-semibold text-white">{item.title}</p>
                        </div>
                        <Badge label={item.status} />
                      </div>
                      <p className="mt-3 text-sm leading-7 text-zinc-300">{item.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Card className="rounded-[28px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Replay summary
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  Historical compliance posture
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  The workflow moves from intake to evidence review with the clearest change after
                  control owner upload.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                <Sparkles size={18} className="text-cyan-300" />
              </div>
            </div>
          </Card>

          {rightRailCards.map((card, index) => (
            <Card key={card.title} className="rounded-[28px] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {card.eyebrow}
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">{card.title}</p>
                </div>

                {index === 0 ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                    <Sparkles size={16} className="text-cyan-300" />
                  </div>
                ) : index === 1 ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-500/15 bg-rose-500/10">
                    <Activity size={16} className="text-rose-300" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-500/10">
                    <History size={16} className="text-emerald-300" />
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-300">{card.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}