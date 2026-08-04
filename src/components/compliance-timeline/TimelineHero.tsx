"use client";

import React from "react";
import { CalendarRange, Filter, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

type TimelineHeroProps = {
  title?: string;
  subtitle?: string;
};

export function TimelineHero({
  title = "Compliance Timeline",
  subtitle = "Replay the lifecycle of regulatory intake, clause parsing, obligation assignment, evidence submission, and risk posture changes across a single operational canvas.",
}: TimelineHeroProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="glass-panel rounded-[30px] border border-white/10 p-6 lg:p-7">
        <div className="flex flex-col gap-5">
          <div>
            <p className="section-label">Governance chronology</p>
            <h1 className="page-title mt-4">{title}</h1>
            <p className="page-subtitle max-w-3xl">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">
              <PlayCircle size={16} />
              Replay timeline
            </Button>

            <Button variant="secondary">
              <CalendarRange size={16} />
              Jul 08 - Jul 23, 2026
            </Button>

            <Button variant="ghost">
              <Filter size={16} />
              Filter events
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Active stage
              </p>
              <p className="mt-2 text-sm font-semibold text-white">Risk recalculation</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Current focus
              </p>
              <p className="mt-2 text-sm font-semibold text-white">Evidence-linked obligations</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Timeline mode
              </p>
              <p className="mt-2 text-sm font-semibold text-white">Historical replay</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="rounded-[30px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Timeline state
            </p>
            <p className="mt-2 text-lg font-semibold text-white">Analyst control panel</p>
            <p className="mt-1 text-sm text-zinc-400">
              Watch compliance progression, bottlenecks, and cross-stage dependencies.
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
            <Sparkles size={18} className="text-cyan-300" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Departments</p>
            <p className="mt-2 text-sm font-medium text-white">Compliance, Ops, Tech, Legal</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Risk posture</p>
            <p className="mt-2 text-sm font-medium text-white">Micro-risk improving after evidence review</p>
          </div>
        </div>
      </Card>
    </div>
  );
}