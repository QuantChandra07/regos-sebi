"use client";

import React, { useMemo } from "react";
import { Card } from "../../components/ui/Card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { AlertOctagon } from "lucide-react";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/ui/StateBlocks";
import { useRisks } from "../../lib/hooks";

type RiskLevelLabel = "Critical" | "High" | "Medium" | "Low";

type RiskLike = {
  id?: string;
  risklevel?: string | null;
  overallscore?: number | null;
  departmentname?: string | null;
  ownerdepartment?: string | null;
  department?: string | null;
  updatedat?: string | null;
  createdat?: string | null;
  detectedat?: string | null;
  category?: string | null;
  title?: string | null;
};

const RISK_LEVELS: RiskLevelLabel[] = ["Critical", "High", "Medium", "Low"];
const COLORS: Record<RiskLevelLabel, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
};

function normalizeRiskLevel(level?: string | null): RiskLevelLabel {
  const value = level?.toUpperCase();
  if (value === "CRITICAL") return "Critical";
  if (value === "HIGH") return "High";
  if (value === "MEDIUM") return "Medium";
  if (value === "LOW") return "Low";
  return "Medium";
}

function getDepartment(item: RiskLike): string {
  return item.departmentname || item.ownerdepartment || item.department || "Unassigned";
}

function getRiskLabel(item: RiskLike, index: number): string {
  return item.category || item.title || `Risk ${index + 1}`;
}

function getRiskTime(item: RiskLike): number {
  const raw = item.updatedat || item.createdat || item.detectedat;
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getRiskScore(item: RiskLike): number {
  return item.overallscore ?? 0;
}

export default function RiskIntelligencePage() {
  const { data, error, isLoading } = useRisks();
  const items: RiskLike[] = data?.items ?? [];

  const distribution = useMemo(() => {
    return RISK_LEVELS.map((level) => ({
      name: level,
      value: items.filter((item) => normalizeRiskLevel(item.risklevel) === level).length,
    }));
  }, [items]);

  const topRisks = useMemo(() => {
    return [...items].sort((a, b) => getRiskScore(b) - getRiskScore(a)).slice(0, 8);
  }, [items]);

  const departmentRiskData = useMemo(() => {
    const grouped = new Map<string, { total: number; count: number }>();

    for (const item of items) {
      const dept = getDepartment(item);
      const current = grouped.get(dept) ?? { total: 0, count: 0 };
      current.total += getRiskScore(item);
      current.count += 1;
      grouped.set(dept, current);
    }

    return Array.from(grouped.entries()).map(([department, value]) => ({
      department,
      score: value.count ? Math.round(value.total / value.count) : 0,
    }));
  }, [items]);

  const trendData = useMemo(() => {
    return [...items]
      .sort((a, b) => getRiskTime(a) - getRiskTime(b))
      .slice(-6)
      .map((item, index) => ({
        label: getRiskLabel(item, index),
        score: getRiskScore(item),
      }));
  }, [items]);

  const radarData = useMemo(() => {
    return departmentRiskData.slice(0, 6).map((item) => ({
      dept: item.department,
      score: item.score,
    }));
  }, [departmentRiskData]);

  const inspectionFailureProbability = useMemo(() => {
    if (!items.length) return 0;
    const highWeight = items.filter((item) => {
      const level = normalizeRiskLevel(item.risklevel);
      return level === "Critical" || level === "High";
    }).length;
    return Math.round((highWeight / items.length) * 100);
  }, [items]);

  if (isLoading) return <LoadingBlock label="Loading risk intelligence..." />;
  if (error) return <ErrorBlock message={error.message} />;
  if (!items.length) return <EmptyBlock label="No risk data found." />;

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
        <p className="section-label">Governance intelligence</p>
        <h1 className="page-title mt-4">Risk Intelligence</h1>
        <p className="page-subtitle">
          AI-powered risk scoring across departments, obligations, and governance signals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="flex flex-col items-center justify-center rounded-[24px] text-center lg:col-span-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400">
            Inspection Failure Probability
          </p>
          <p className="mt-3 text-5xl font-bold text-amber-400">{inspectionFailureProbability}%</p>
          <p className="mt-2 text-xs text-zinc-500">Based on {items.length} active risk records</p>
        </Card>

        <Card className="rounded-[24px] lg:col-span-8">
          <h3 className="text-sm font-semibold text-gray-200">Compliance Risk by Department</h3>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3D" />
                <XAxis dataKey="department" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#374151" }} />
                <Bar dataKey="score" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="rounded-[24px] lg:col-span-6">
          <h3 className="text-sm font-semibold text-gray-200">Risk Trend</h3>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3D" />
                <XAxis dataKey="label" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#374151" }} />
                <Line type="monotone" dataKey="score" stroke="#F87171" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[24px] lg:col-span-6">
          <h3 className="text-sm font-semibold text-gray-200">Departmental Risk Radar</h3>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid gridType="circle" stroke="#1E2A3D" />
                <PolarAngleAxis dataKey="dept" stroke="#6B7280" fontSize={9} />
                <PolarRadiusAxis stroke="#374151" fontSize={9} domain={[0, 100]} />
                <Radar dataKey="score" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[24px]">
          <h2 className="mb-4 text-lg font-semibold text-white">Risk distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={110}>
                  {distribution.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name as RiskLevelLabel]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[24px]">
          <div className="mb-4 flex items-center gap-2">
            <AlertOctagon size={16} className="text-red-400" />
            <h3 className="text-sm font-semibold text-gray-200">Top High-Risk Obligations</h3>
          </div>

          <div className="space-y-2">
            {topRisks.map((risk, index) => {
              const score = getRiskScore(risk);

              return (
                <div
                  key={risk.id ?? `${getRiskLabel(risk, index)}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-xs font-mono text-zinc-500">{index + 1}</span>
                    <div>
                      <p className="text-sm text-gray-200">{getRiskLabel(risk, index)}</p>
                      <p className="text-[11px] text-zinc-500">{getDepartment(risk)}</p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-mono font-bold ${
                      score >= 75 ? "text-red-400" : score >= 45 ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}