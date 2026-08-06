"use client";

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