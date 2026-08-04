"use client";

import React from "react";
import { BrainCircuit, ShieldAlert, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card";

export function TimelineInsightsPanel() {
  return (
    <div className="space-y-4">
      <Card className="rounded-[24px] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Advanced controls
            </p>
            <p className="mt-2 text-base font-semibold text-white">Department filtering</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <SlidersHorizontal size={16} className="text-zinc-300" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center">
          <div className="relative h-40 w-40 rounded-full bg-[conic-gradient(from_0deg,_rgba(34,211,238,0.95)_0_70deg,_rgba(52,211,153,0.92)_70deg_150deg,_rgba(168,85,247,0.92)_150deg_225deg,_rgba(251,146,60,0.92)_225deg_295deg,_rgba(244,114,182,0.92)_295deg_360deg)] p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <div className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-[#07101c] text-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Coverage</p>
                <p className="mt-1 text-lg font-semibold text-white">5 Depts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-zinc-400">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">Technology</div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">Compliance</div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">Operations</div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">Legal</div>
        </div>
      </Card>

      <Card className="rounded-[24px] p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Risk evolution
            </p>
            <p className="mt-2 text-base font-semibold text-white">Residual trend</p>
          </div>
          <TrendingUp size={16} className="mt-1 text-cyan-300" />
        </div>

        <div className="mt-5 h-32 rounded-[20px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-3">
          <svg viewBox="0 0 280 100" className="h-full w-full">
            <defs>
              <linearGradient id="timeline-risk-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(244,114,182,0.35)" />
                <stop offset="100%" stopColor="rgba(244,114,182,0.02)" />
              </linearGradient>
            </defs>
            <path
              d="M0,72 C22,58 44,46 70,50 C98,54 118,70 142,62 C170,52 180,24 208,22 C232,20 248,42 280,46 L280,100 L0,100 Z"
              fill="url(#timeline-risk-fill)"
            />
            <path
              d="M0,72 C22,58 44,46 70,50 C98,54 118,70 142,62 C170,52 180,24 208,22 C232,20 248,42 280,46"
              fill="none"
              stroke="rgba(251,113,133,0.9)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {[0, 70, 140, 210, 280].map((x) => (
              <line
                key={x}
                x1={x}
                y1="10"
                x2={x}
                y2="100"
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 6"
              />
            ))}
          </svg>
        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Elevated exposure peaked before evidence verification and softened after review closure.
        </p>
      </Card>

      <Card className="rounded-[24px] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
            <BrainCircuit size={16} className="text-cyan-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              AI observations
            </p>
            <p className="mt-2 text-base font-semibold text-white">Historical replay insights</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[
            "Clause-to-obligation mapping accelerated once legal fragments were normalized.",
            "Evidence upload reduced residual risk for the impacted obligation cluster.",
            "Workflow status transition suggests compliance ownership stabilized after Jul 22.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-sm leading-6 text-zinc-300">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[24px] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-rose-500/15 bg-rose-500/10">
            <ShieldAlert size={16} className="text-rose-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Watchpoint
            </p>
            <p className="mt-2 text-sm font-semibold text-white">Pending evidence linkage remains the main source of timeline volatility.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}