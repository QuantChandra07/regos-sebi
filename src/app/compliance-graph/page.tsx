"use client";

import React, { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { motion } from "framer-motion";
import { Network, ShieldCheck, AlertTriangle, FileStack } from "lucide-react";

type DepartmentNode = {
  id: string;
  name: string;
  complianceScore: number;
  headUserId: string | null;
  openIssues?: number;
  pendingEvidence?: number;
  keyControls?: string[];
};

const mockDepartments: DepartmentNode[] = [
  {
    id: "dept-001",
    name: "Compliance",
    headUserId: "usr-001",
    complianceScore: 97,
    openIssues: 1,
    pendingEvidence: 0,
    keyControls: ["Reg reporting", "Policy attestations"],
  },
  {
    id: "dept-002",
    name: "Operations",
    headUserId: "usr-002",
    complianceScore: 93,
    openIssues: 2,
    pendingEvidence: 1,
    keyControls: ["KYC QA", "Fee trail retention"],
  },
  {
    id: "dept-003",
    name: "Technology",
    headUserId: "usr-003",
    complianceScore: 89,
    openIssues: 4,
    pendingEvidence: 2,
    keyControls: ["VAPT", "Patch governance", "Access reviews"],
  },
  {
    id: "dept-004",
    name: "Legal",
    headUserId: "usr-004",
    complianceScore: 95,
    openIssues: 1,
    pendingEvidence: 0,
    keyControls: ["Clause review", "Circular interpretation"],
  },
  {
    id: "dept-005",
    name: "Finance",
    headUserId: "usr-005",
    complianceScore: 84,
    openIssues: 3,
    pendingEvidence: 2,
    keyControls: ["Books retention", "Audit support"],
  },
];

function scoreColor(score: number) {
  if (score >= 90) return "#34D399";
  if (score >= 80) return "#F59E0B";
  return "#F87171";
}

export default function ComplianceGraphPage() {
  const departments = mockDepartments;
  const [selectedDept, setSelectedDept] = useState<DepartmentNode | null>(departments[0] ?? null);

  const positions = useMemo(() => {
    const radius = 200;

    return departments.map((d, i) => {
      const angle = (i / Math.max(departments.length, 1)) * 2 * Math.PI;
      return {
        ...d,
        x: 300 + radius * Math.cos(angle),
        y: 260 + radius * Math.sin(angle),
      };
    });
  }, [departments]);

  if (!selectedDept) {
    return (
      <div className="space-y-6">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Department graph</p>
          <h1 className="page-title mt-4">Compliance Digital Twin</h1>
          <p className="page-subtitle">Organization department and obligation graph workspace.</p>
        </div>

        <Card className="rounded-[24px]">
          <p className="text-sm text-zinc-400">No department data available.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Graph intelligence</p>
          <h1 className="page-title mt-4">Compliance Digital Twin</h1>
          <p className="page-subtitle">
            Visualize departments as a live compliance graph with issue load, evidence posture, and
            control ownership.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Active node
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{selectedDept.name}</p>
              <p className="mt-1 text-sm text-zinc-400">Focused department detail panel</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
              <Network size={18} className="text-cyan-300" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="relative h-[560px] overflow-hidden rounded-[28px] lg:col-span-8">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 520">
            {positions.map((d) => (
              <line
                key={d.id}
                x1={300}
                y1={260}
                x2={d.x}
                y2={d.y}
                stroke={selectedDept.id === d.id ? "#22D3EE" : "#374151"}
                strokeWidth={selectedDept.id === d.id ? 2.5 : 1.2}
                strokeDasharray={selectedDept.id === d.id ? "none" : "4 4"}
              />
            ))}

            <circle cx="300" cy="260" r="36" fill="#111827" stroke="#3B82F6" strokeWidth="2" />
            <text
              x="300"
              y="264"
              textAnchor="middle"
              fill="#93C5FD"
              fontSize="11"
              fontFamily="monospace"
            >
              ORG
            </text>

            {positions.map((d) => {
              const isSelected = selectedDept.id === d.id;
              const color = scoreColor(d.complianceScore);

              return (
                <g key={d.id} onClick={() => setSelectedDept(d)} className="cursor-pointer">
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r={isSelected ? 28 : 24}
                    fill="#111827"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 2}
                    style={{
                      filter: isSelected ? `drop-shadow(0 0 8px ${color})` : "none",
                    }}
                  />
                  <text
                    x={d.x}
                    y={d.y + 4}
                    textAnchor="middle"
                    fill="#E5E7EB"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {d.name.slice(0, 4).toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </Card>

        <Card className="rounded-[28px] lg:col-span-4">
          <motion.div
            key={selectedDept.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <h3 className="text-lg font-semibold text-white">{selectedDept.name}</h3>
            <p className="mb-5 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-500">
              Department node detail
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Compliance score
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      style={{ width: `${selectedDept.complianceScore}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm text-zinc-300">
                    {selectedDept.complianceScore}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="Open Issues"
                  value={selectedDept.openIssues ?? 0}
                  icon={<AlertTriangle size={14} className="text-amber-400" />}
                />
                <MetricCard
                  label="Pending Evidence"
                  value={selectedDept.pendingEvidence ?? 0}
                  icon={<FileStack size={14} className="text-indigo-300" />}
                />
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-cyan-300" />
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    Key controls
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(selectedDept.keyControls ?? []).map((control) => (
                    <span
                      key={control}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300"
                    >
                      {control}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Head user ID</p>
                <p className="mt-2 font-mono text-sm text-cyan-300">
                  {selectedDept.headUserId || "Not assigned"}
                </p>
              </div>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}