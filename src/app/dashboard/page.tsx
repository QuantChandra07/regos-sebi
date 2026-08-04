"use client";

import { KpiCard } from "../../components/ui/KpiCard";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/ui/StateBlocks";
import { Card } from "../../components/ui/Card";
import { AlertTriangle, CheckCircle2, Activity, Building2 } from "lucide-react";
import { useDashboardSummary } from "../../lib/hooks";

export default function DashboardPage() {
  const { data, error, isLoading } = useDashboardSummary();

  if (isLoading) return <LoadingBlock label="Loading dashboard..." />;
  if (error) return <ErrorBlock message={error.message} />;
  if (!data?.summary) return <EmptyBlock label="No dashboard summary available." />;

  const s = data.summary;
  const completed = Number(s.tasks_completed || 0);
  const open = Number(s.tasks_open || 0);
  const totalTaskVolume = completed + open;
  const completionRate = totalTaskVolume
    ? Math.round((completed / totalTaskVolume) * 100)
    : 0;
  const complianceScores = Array.isArray(s.compliance_scores)
    ? s.compliance_scores
    : [];

  const newCircularsThisMonth = Number(s.new_circulars_this_month || 0);
  const obligationsFound = Number(s.obligations_found || 0);
  const highCriticalObligations = Number(s.high_critical_obligations || 0);
  const tasksOpen = Number(s.tasks_open || 0);
  const tasksCompleted = Number(s.tasks_completed || 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Operational control room</p>
          <h1 className="page-title mt-4">Dashboard</h1>
          <p className="page-subtitle">
            Live operational view of SEBI compliance activity across circular ingestion,
            obligation discovery, workflow progress, and department posture.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Execution health
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">{completionRate}%</p>
              <p className="mt-1 text-sm text-zinc-400">Task completion rate</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-500/10">
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 transition-all"
              style={{ width: `${Math.max(0, Math.min(completionRate, 100))}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Open</p>
              <p className="mt-1 text-lg font-semibold text-white">{open}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Completed</p>
              <p className="mt-1 text-lg font-semibold text-white">{completed}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard title="New Circulars this month" value={s.new_circulars_this_month} />
        <KpiCard title="Obligations found" value={s.obligations_found} />
        <KpiCard title="High Critical" value={s.high_critical_obligations} />
        <KpiCard title="Tasks open" value={s.tasks_open} />
        <KpiCard title="Tasks completed" value={s.tasks_completed} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <Card className="rounded-[26px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Department posture</p>
              <h2 className="section-title mt-2">Compliance score per department</h2>
            </div>
            <Building2 size={18} className="text-cyan-300" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {complianceScores.length > 0 ? (
              complianceScores.map((item: { department: string; score: number | string }) => (
                <div
                  key={item.department}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-sm text-zinc-400">{item.department}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold tracking-tight text-white">
                      {item.score}
                    </p>
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300">
                      Score
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyBlock label="No department compliance scores available." />
            )}
          </div>
        </Card>

        <Card className="rounded-[26px] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/15 bg-amber-500/10">
              <AlertTriangle size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="section-label">Priority signal</p>
              <h2 className="section-title mt-1">Operational summary</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-300">High-critical obligations</p>
                <Activity size={16} className="text-amber-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">
                {s.high_critical_obligations}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-zinc-300">Circular intake this month</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {s.new_circulars_this_month}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-zinc-300">Obligations discovered</p>
              <p className="mt-2 text-2xl font-semibold text-white">{s.obligations_found}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}