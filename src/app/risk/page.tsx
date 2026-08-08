"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Folder,
  Info,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Shell from "../../components/layout/Shell";
import { Card } from "../../components/ui/Card";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "../../components/ui/StateBlocks";
import { useRisks } from "../../lib/hooks";

type RiskLevelLabel = "Critical" | "High" | "Medium" | "Low";

type RiskLike = {
  id?: string;
  obligation_id?: string | null;
  risklevel?: string | null;
  risk_level?: string | null;
  overallscore?: number | null;
  overall_score?: number | null;
  impact_score?: number | null;
  likelihood_score?: number | null;
  rationale?: string | null;
  departmentname?: string | null;
  ownerdepartment?: string | null;
  department?: string | null;
  updatedat?: string | null;
  createdat?: string | null;
  detectedat?: string | null;
  category?: string | null;
  title?: string | null;
};

const RISK_LEVELS: RiskLevelLabel[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
];

const COLORS: Record<RiskLevelLabel, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
};

const LEVEL_COLOR: Record<RiskLevelLabel, string> = {
  Critical: "#ef4444",
  High: "#f59e0b",
  Medium: "#06b6d4",
  Low: "#64748b",
};

const LEVEL_BG: Record<RiskLevelLabel, string> = {
  Critical: "rgba(239,68,68,0.1)",
  High: "rgba(245,158,11,0.1)",
  Medium: "rgba(6,182,212,0.1)",
  Low: "rgba(100,116,139,0.1)",
};

const LEVEL_BORDER: Record<RiskLevelLabel, string> = {
  Critical: "rgba(239,68,68,0.22)",
  High: "rgba(245,158,11,0.22)",
  Medium: "rgba(6,182,212,0.22)",
  Low: "rgba(100,116,139,0.2)",
};

function normalizeRiskLevel(
  level?: string | null,
): RiskLevelLabel {
  const value = level?.toUpperCase();

  if (value === "CRITICAL") return "Critical";
  if (value === "HIGH") return "High";
  if (value === "MEDIUM") return "Medium";
  if (value === "LOW") return "Low";

  return "Medium";
}

function getDepartment(item: RiskLike): string {
  return (
    item.departmentname ||
    item.ownerdepartment ||
    item.department ||
    "Unassigned"
  );
}

function getRiskLabel(item: RiskLike, index: number): string {
  return item.category || item.title || `Risk ${index + 1}`;
}

function getRiskTime(item: RiskLike): number {
  const raw =
    item.updatedat || item.createdat || item.detectedat;

  if (!raw) return 0;

  const time = new Date(raw).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function getRiskScore(item: RiskLike): number {
  return item.overallscore ?? item.overall_score ?? 0;
}

function getImpactScore(item: RiskLike): number | null {
  return item.impact_score ?? null;
}

function getLikelihoodScore(item: RiskLike): number | null {
  return item.likelihood_score ?? null;
}

function RiskBadge({ level }: { level: RiskLevelLabel }) {
  const Icon =
    level === "Critical"
      ? ShieldAlert
      : level === "High"
        ? AlertTriangle
        : level === "Medium"
          ? Activity
          : ShieldCheck;

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide"
      style={{
        background: LEVEL_BG[level],
        border: `1px solid ${LEVEL_BORDER[level]}`,
        color: LEVEL_COLOR[level],
      }}
    >
      <Icon size={9} />
      {level}
    </div>
  );
}

function ScoreBar({
  value,
  max = 10,
  color,
}: {
  value: number;
  max?: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 6px ${color}80`,
          }}
        />
      </div>

      <span
        className="min-w-7 text-right text-xs font-bold"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

function RiskCard({
  risk,
  index,
  isSelected,
  onClick,
}: {
  risk: RiskLike;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const level = normalizeRiskLevel(
    risk.risklevel ?? risk.risk_level,
  );

  const score = getRiskScore(risk);
  const impact = getImpactScore(risk);
  const likelihood = getLikelihoodScore(risk);
  const label = getRiskLabel(risk, index);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl p-4 transition-all"
      style={{
        background: isSelected
          ? "rgba(56,189,248,0.06)"
          : "rgba(10,16,32,0.65)",
        border: `1px solid ${
          isSelected
            ? "rgba(56,189,248,0.32)"
            : LEVEL_BORDER[level]
        }`,
        boxShadow: isSelected
          ? "0 0 24px rgba(56,189,248,0.08)"
          : "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-[3px] opacity-70"
        style={{ background: LEVEL_COLOR[level] }}
      />

      <div className="pl-2.5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <RiskBadge level={level} />

            <span className="badge badge-gray text-[9px]">
              {risk.category || "Uncategorized"}
            </span>

            <span className="badge badge-gray text-[9px]">
              {getDepartment(risk)}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div
              className="rounded-lg px-2.5 py-1 text-[13px] font-extrabold"
              style={{
                background:
                  score >= 85
                    ? "rgba(239,68,68,0.12)"
                    : score >= 65
                      ? "rgba(245,158,11,0.12)"
                      : "rgba(56,189,248,0.12)",
                border: `1px solid ${
                  score >= 85
                    ? "rgba(239,68,68,0.25)"
                    : score >= 65
                      ? "rgba(245,158,11,0.25)"
                      : "rgba(56,189,248,0.25)"
                }`,
                color:
                  score >= 85
                    ? "#ef4444"
                    : score >= 65
                      ? "#f59e0b"
                      : "#38bdf8",
              }}
            >
              {score}
            </div>

            <ChevronRight
              size={14}
              className="text-zinc-500"
            />
          </div>
        </div>

        <p className="mb-1.5 text-sm font-bold leading-snug text-[var(--c-text)]">
          {label}
        </p>

        {risk.rationale ? (
          <p className="mb-3 line-clamp-2 text-[12.5px] leading-6 text-[var(--c-text-dim)]">
            {risk.rationale}
          </p>
        ) : null}

        {impact !== null || likelihood !== null ? (
          <div className="mb-3 grid grid-cols-2 gap-2.5">
            {impact !== null ? (
              <div>
                <p className="mb-1 text-[9.5px] font-semibold uppercase tracking-wide text-zinc-500">
                  Impact
                </p>

                <ScoreBar
                  value={impact}
                  color={LEVEL_COLOR[level]}
                />
              </div>
            ) : null}

            {likelihood !== null ? (
              <div>
                <p className="mb-1 text-[9.5px] font-semibold uppercase tracking-wide text-zinc-500">
                  Likelihood
                </p>

                <ScoreBar
                  value={likelihood}
                  color="#a78bfa"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-cyan-500/[0.07] pt-2.5">
          {risk.obligation_id ? (
            <span className="rounded border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-violet-300">
              {risk.obligation_id}
            </span>
          ) : (
            <span className="text-[10px] text-zinc-600">
              No linked obligation
            </span>
          )}

          <span className="font-mono text-[10px] text-zinc-500">
            {risk.id}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function DetailDrawer({
  risk,
  index,
  onClose,
}: {
  risk: RiskLike;
  index: number;
  onClose: () => void;
}) {
  const level = normalizeRiskLevel(
    risk.risklevel ?? risk.risk_level,
  );

  const score = getRiskScore(risk);
  const impact = getImpactScore(risk);
  const likelihood = getLikelihoodScore(risk);
  const label = getRiskLabel(risk, index);

  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="flex w-[360px] shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-[#05080f]/95 backdrop-blur-2xl"
    >
      <div className="sticky top-0 z-10 flex items-start gap-2.5 border-b border-white/10 bg-[#05080f]/98 p-4">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <RiskBadge level={level} />

            <span className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-zinc-500">
              {risk.id}
            </span>
          </div>

          <p className="text-sm font-bold leading-snug text-[var(--c-text)]">
            {label}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-icon mt-0.5 shrink-0"
          aria-label="Close risk detail"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
          <p className="mb-3 text-[10.5px] font-bold uppercase tracking-wide text-zinc-500">
            Risk Scoring
          </p>

          <div className="space-y-2.5">
            {impact !== null ? (
              <div>
                <p className="mb-1.5 text-xs text-zinc-300">
                  Impact
                </p>

                <ScoreBar
                  value={impact}
                  color={LEVEL_COLOR[level]}
                />
              </div>
            ) : null}

            {likelihood !== null ? (
              <div>
                <p className="mb-1.5 text-xs text-zinc-300">
                  Likelihood
                </p>

                <ScoreBar value={likelihood} color="#a78bfa" />
              </div>
            ) : null}

            <div>
              <p className="mb-1.5 text-xs text-zinc-300">
                Overall Score
              </p>

              <ScoreBar
                value={score}
                max={Math.max(score, 100)}
                color={
                  score >= 85
                    ? "#ef4444"
                    : score >= 65
                      ? "#f59e0b"
                      : "#38bdf8"
                }
              />
            </div>
          </div>
        </div>

        {risk.rationale ? (
          <div>
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-zinc-500">
              Risk Summary
            </p>

            <p className="text-[13px] leading-6 text-[var(--c-text-dim)]">
              {risk.rationale}
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="mb-1.5 flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wide text-zinc-500">
              <Folder size={9} />
              Category
            </p>

            <p className="text-xs font-semibold text-zinc-200">
              {risk.category || "Uncategorized"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="mb-1.5 flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wide text-zinc-500">
              <Target size={9} />
              Department
            </p>

            <p className="text-xs font-semibold text-zinc-200">
              {getDepartment(risk)}
            </p>
          </div>
        </div>

        {risk.obligation_id ? (
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.08] p-3.5">
            <p className="mb-2 flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wide text-zinc-500">
              <Target size={10} />
              Related Obligation
            </p>

            <span className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-violet-300">
              {risk.obligation_id}
            </span>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function RiskIntelligencePage() {
  const { data, error, isLoading } = useRisks();
  const items: RiskLike[] = data?.items ?? [];

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<
    RiskLevelLabel | "All"
  >("All");
  const [filterDept, setFilterDept] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<
    number | null
  >(null);

  const departments = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(items.map((item) => getDepartment(item))),
      ),
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item, index) => {
      const level = normalizeRiskLevel(
        item.risklevel ?? item.risk_level,
      );

      if (filterLevel !== "All" && level !== filterLevel) {
        return false;
      }

      if (
        filterDept !== "All" &&
        getDepartment(item) !== filterDept
      ) {
        return false;
      }

      if (search) {
        const haystack = getRiskLabel(item, index)
          .toLowerCase();

        if (!haystack.includes(search.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [items, filterLevel, filterDept, search]);

  const counts = useMemo(() => {
    const base: Record<RiskLevelLabel, number> = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    items.forEach((item) => {
      const level = normalizeRiskLevel(
        item.risklevel ?? item.risk_level,
      );

      base[level] += 1;
    });

    return base;
  }, [items]);

  const distribution = useMemo(() => {
    return RISK_LEVELS.map((level) => ({
      name: level,
      value: counts[level],
    }));
  }, [counts]);

  const departmentRiskData = useMemo(() => {
    const grouped = new Map<
      string,
      { total: number; count: number }
    >();

    for (const item of items) {
      const dept = getDepartment(item);
      const current = grouped.get(dept) ?? {
        total: 0,
        count: 0,
      };

      current.total += getRiskScore(item);
      current.count += 1;

      grouped.set(dept, current);
    }

    return Array.from(grouped.entries()).map(
      ([department, value]) => ({
        department,
        score: value.count
          ? Math.round(value.total / value.count)
          : 0,
      }),
    );
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
      const level = normalizeRiskLevel(
        item.risklevel ?? item.risk_level,
      );

      return level === "Critical" || level === "High";
    }).length;

    return Math.round((highWeight / items.length) * 100);
  }, [items]);

  const selectedRisk =
    selectedIndex !== null
      ? filteredItems[selectedIndex]
      : null;

  const clearFilters = () => {
    setFilterLevel("All");
    setFilterDept("All");
    setSearch("");
  };

  if (isLoading) {
    return (
      <Shell
        mode="demo"
        docName="Master Circular – Stock Brokers"
        docPages={419}
      >
        <LoadingBlock label="Loading risk intelligence..." />
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell
        mode="demo"
        docName="Master Circular – Stock Brokers"
        docPages={419}
      >
        <ErrorBlock message={error.message} />
      </Shell>
    );
  }

  if (!items.length) {
    return (
      <Shell
        mode="demo"
        docName="Master Circular – Stock Brokers"
        docPages={419}
      >
        <EmptyBlock label="No risk data found." />
      </Shell>
    );
  }

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="flex gap-0">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="glass-panel flex flex-col gap-4 rounded-[28px] border border-white/10 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-7">
            <div>
              <div className="mb-1.5 flex items-center gap-2.5">
                <ShieldAlert size={20} className="text-red-500" />

                <h1 className="page-title !mt-0">
                  Risk Intelligence
                </h1>
              </div>

              <p className="page-subtitle !mt-1">
                AI-powered risk scoring across departments,
                obligations, and governance signals.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5">
              <div className="relative">
                <Search
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  className="input-glass w-[220px] pl-9 text-sm"
                  placeholder="Search risks…"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <div className="flex items-center gap-1.5">
                <SlidersHorizontal
                  size={13}
                  className="text-zinc-500"
                />

                <select
                  className="select-glass"
                  value={filterLevel}
                  onChange={(event) =>
                    setFilterLevel(
                      event.target.value as
                        | RiskLevelLabel
                        | "All",
                    )
                  }
                >
                  <option value="All">All Levels</option>
                  {RISK_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>

                <select
                  className="select-glass"
                  value={filterDept}
                  onChange={(event) =>
                    setFilterDept(event.target.value)
                  }
                >
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
            {RISK_LEVELS.map((level) => {
              const Icon =
                level === "Critical"
                  ? ShieldAlert
                  : level === "High"
                    ? AlertTriangle
                    : level === "Medium"
                      ? Activity
                      : ShieldCheck;

              const color = LEVEL_COLOR[level];
              const isActive = filterLevel === level;

              return (
                <motion.button
                  type="button"
                  key={level}
                  whileHover={{ y: -2 }}
                  onClick={() =>
                    setFilterLevel(isActive ? "All" : level)
                  }
                  className="rounded-2xl p-4 text-left transition-colors"
                  style={{
                    background: isActive
                      ? `${color}10`
                      : "rgba(10,16,32,0.65)",
                    border: `1px solid ${
                      isActive
                        ? `${color}35`
                        : "rgba(255,255,255,0.07)"
                    }`,
                  }}
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-[10.5px] font-bold uppercase tracking-wide text-zinc-500">
                      {level}
                    </p>

                    <Icon size={14} style={{ color }} />
                  </div>

                  <p
                    className="text-3xl font-extrabold leading-none"
                    style={{ color }}
                  >
                    {counts[level]}
                  </p>

                  <p className="mt-1.5 text-[11px] text-zinc-500">
                    {level === "Critical"
                      ? "Immediate action required"
                      : level === "High"
                        ? "Action within 14 days"
                        : level === "Medium"
                          ? "Monitor and plan"
                          : "Low priority"}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card className="flex flex-col items-center justify-center rounded-[24px] text-center lg:col-span-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400">
                Inspection Failure Probability
              </p>

              <p className="mt-3 text-5xl font-bold text-amber-400">
                {inspectionFailureProbability}%
              </p>

              <p className="mt-2 text-xs text-zinc-500">
                Based on {items.length} active risk records
              </p>
            </Card>

            <Card className="rounded-[24px] lg:col-span-8">
              <div className="mb-2 flex items-center gap-2">
                <BarChart3 size={15} className="text-cyan-300" />

                <h3 className="text-sm font-semibold text-gray-200">
                  Compliance Risk by Department
                </h3>
              </div>

              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentRiskData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E2A3D"
                    />
                    <XAxis
                      dataKey="department"
                      stroke="#6B7280"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderColor: "#374151",
                      }}
                    />
                    <Bar
                      dataKey="score"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card className="rounded-[24px] lg:col-span-6">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp size={15} className="text-cyan-300" />

                <h3 className="text-sm font-semibold text-gray-200">
                  Risk Trend
                </h3>
              </div>

              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E2A3D"
                    />
                    <XAxis
                      dataKey="label"
                      stroke="#6B7280"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderColor: "#374151",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#F87171"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="rounded-[24px] lg:col-span-6">
              <h3 className="text-sm font-semibold text-gray-200">
                Departmental Risk Radar
              </h3>

              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid gridType="circle" stroke="#1E2A3D" />
                    <PolarAngleAxis
                      dataKey="dept"
                      stroke="#6B7280"
                      fontSize={9}
                    />
                    <PolarRadiusAxis
                      stroke="#374151"
                      fontSize={9}
                      domain={[0, 100]}
                    />
                    <Radar
                      dataKey="score"
                      stroke="#22D3EE"
                      fill="#22D3EE"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="rounded-[24px]">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Risk distribution
            </h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                  >
                    {distribution.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          COLORS[entry.name as RiskLevelLabel]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="flex items-center gap-2.5">
            <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--c-text)]">
              <Info size={13} className="text-zinc-500" />
              Risk Register
            </p>

            <span className="badge badge-gray text-[9px]">
              {filteredItems.length} of {items.length} shown
            </span>

            {(filterLevel !== "All" ||
              filterDept !== "All" ||
              search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-ghost text-[11px] text-cyan-400"
              >
                Clear filters ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
            <AlertOctagon size={15} className="text-red-400" />
            Prioritized risk cards
          </div>

          <motion.div layout className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((risk, index) => (
                <RiskCard
                  key={risk.id ?? `${getRiskLabel(risk, index)}-${index}`}
                  risk={risk}
                  index={index}
                  isSelected={selectedIndex === index}
                  onClick={() =>
                    setSelectedIndex(
                      selectedIndex === index ? null : index,
                    )
                  }
                />
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <div className="py-12 text-center text-sm text-zinc-500">
                No risks match the current filters.
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedRisk && selectedIndex !== null ? (
            <DetailDrawer
              risk={selectedRisk}
              index={selectedIndex}
              onClose={() => setSelectedIndex(null)}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </Shell>
  );
}