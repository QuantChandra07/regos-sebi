"use client";

import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ClipboardCheck, SearchCheck, ShieldAlert, FileSearch } from "lucide-react";

const inspectionChecks = [
  {
    title: "Circular implementation coverage",
    owner: "Compliance",
    status: "READY",
    detail: "Mapped obligations exist for most ingested circulars and active policy-linked items.",
  },
  {
    title: "Evidence completeness",
    owner: "Operations",
    status: "PARTIAL",
    detail: "Some workflow-linked controls still show pending file verification.",
  },
  {
    title: "Cybersecurity obligations",
    owner: "Technology",
    status: "REVIEW",
    detail: "High-priority items require refreshed evidence and closure commentary.",
  },
  {
    title: "Inspection narrative package",
    owner: "Legal",
    status: "READY",
    detail: "Executive summary and issue categorization available for synthetic audit review.",
  },
];

export default function SyntheticInspectionPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Inspection simulation</p>
          <h1 className="page-title mt-4">Synthetic Inspection</h1>
          <p className="page-subtitle">
            Simulate an inspection-ready review across obligations, workflows, evidence, and risk to
            identify control gaps before external scrutiny.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Inspection state
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Pre-audit simulation active</p>
              <p className="mt-1 text-sm text-zinc-400">Cross-functional readiness view</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
              <SearchCheck size={18} className="text-cyan-300" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Controls reviewed" value="24" icon={<ClipboardCheck size={18} className="text-cyan-300" />} />
        <SummaryCard title="Open gaps" value="5" icon={<ShieldAlert size={18} className="text-amber-400" />} />
        <SummaryCard title="Evidence pending" value="3" icon={<FileSearch size={18} className="text-indigo-300" />} />
        <SummaryCard title="Ready packs" value="8" icon={<ClipboardCheck size={18} className="text-emerald-400" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {inspectionChecks.map((item) => (
          <Card key={item.title} className="rounded-[24px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-400">Owner: {item.owner}</p>
              </div>
              <Badge label={item.status} />
            </div>

            <p className="mt-4 text-sm leading-7 text-zinc-300">{item.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-[24px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          {icon}
        </div>
      </div>
    </Card>
  );
}