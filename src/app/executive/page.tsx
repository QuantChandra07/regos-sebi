"use client";

import {
  AlertCircle,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Card } from "../../components/ui/Card";
import { EmptyBlock } from "../../components/ui/StateBlocks";
import React from "react";
import { Card } from "@/components/ui/Card";
import { mockDepartments, mockCirculars } from "@/lib/seed-data";
import { FileDown, Mail } from "lucide-react";

export default function ExecutiveDashboardPage() {
  const highRisk = mockDepartments
    .filter((d) => d.complianceScore < 88)
    .map((d) => d.name);

  const circularsThisMonth = mockCirculars.filter((c) =>
    c.issuedDate.startsWith("2026-07")
  ).length;

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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Executive Dashboard</h1>
        <p className="mt-0.5 font-mono text-xs text-gray-400">
          C-level compliance posture summary
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <p className="text-[10px] font-mono uppercase text-gray-400">
            Overall Compliance
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">96%</p>
        </Card>

        <Card>
          <p className="text-[10px] font-mono uppercase text-gray-400">
            Inspection Readiness
          </p>
          <p className="mt-1 text-2xl font-bold text-cyan-400">92%</p>
        </Card>

        <Card>
          <p className="text-[10px] font-mono uppercase text-gray-400">
            Pending Evidence
          </p>
          <p className="mt-1 text-2xl font-bold text-indigo-400">5</p>
        </Card>

        <Card>
          <p className="text-[10px] font-mono uppercase text-gray-400">
            Circulars This Month
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-400">
            {circularsThisMonth}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 text-sm font-semibold text-gray-200">
          High-Risk Departments
        </h3>
        <div className="flex flex-wrap gap-2">
          {highRisk.length > 0 ? (
            highRisk.map((d) => (
              <span
                key={d}
                className="rounded-full border border-amber-800/60 bg-amber-950/40 px-2.5 py-1 text-xs text-amber-400"
              >
                {d}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-500">No departments currently flagged as high risk.</p>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-2 text-sm font-semibold text-gray-200">AI Summary</h3>
        <p className="text-xs leading-relaxed text-gray-400">
          Overall compliance posture remains stable. Technology and other lower-scoring
          departments should be monitored closely, while recent circular activity remains limited
          in the current month based on available seed data.
        </p>

        <div className="mt-4 flex gap-2">
          <button className="flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-cyan-400">
            <FileDown size={13} />
            Generate Board Report
          </button>

          <button className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700">
            <Mail size={13} />
            Email Summary
          </button>
        </div>
      </Card>
    </div>
  );
}