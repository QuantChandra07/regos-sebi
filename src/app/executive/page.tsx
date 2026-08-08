"use client";

import {
  AlertCircle,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Card } from "../../components/ui/Card";
import { EmptyBlock } from "../../components/ui/StateBlocks";

export default function ExecutivePage() {
  return (
    <Shell
      mode="demo"
      docName="Executive Command Center"
      docPages={419}
    >
      <div className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <p className="section-label">Leadership oversight</p>

            <h1 className="page-title mt-4">
              Executive Command Center
            </h1>

            <p className="page-subtitle max-w-3xl">
              A consolidated view for accountable leaders to assess
              organisational compliance posture, material risk, and
              execution health.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                Leadership View
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                Governed Reporting
              </span>
            </div>
          </div>

          <Card className="rounded-[28px] p-5 lg:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-500/10">
                <ShieldCheck
                  size={18}
                  className="text-emerald-300"
                />
              </div>

              <div>
                <p className="section-label">Reporting status</p>

                <p className="mt-2 text-lg font-semibold text-white">
                  No report configured
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Connect an approved executive reporting feed to
                  populate this view.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-500/15 bg-amber-500/[0.05] px-3 py-3 text-xs leading-5 text-amber-200/80">
              Operational dashboards remain available. This page
              intentionally does not duplicate their data.
            </div>
          </Card>
        </section>

        <Card className="rounded-[28px] p-6 sm:p-8">
          <div className="mx-auto max-w-xl py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <BarChart3
                size={23}
                className="text-cyan-300"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Executive reporting is not available
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Once reporting sources are enabled, this space will
              surface verified leadership-level insights without
              duplicating operational dashboards.
            </p>

            <div className="mt-6">
              <EmptyBlock label="No executive reporting data is available." />
            </div>

            <p className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-500">
              <AlertCircle size={13} />
              Contact the workspace administrator to configure
              reports.
            </p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}