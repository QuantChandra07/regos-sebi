"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/ui/StateBlocks";
import { useObligations } from "../../lib/hooks";
import { Search, ShieldCheck, Filter, CalendarClock, Building2 } from "lucide-react";

type ObligationLike = {
  id: string;
  actor?: string;
  obligation?: string;
  section?: string;
  risklevel?: string;
  status?: string;
  frequency?: string;
  deadline?: string;
  department?: string;
};

export default function ObligationsPage() {
  const { data, error, isLoading } = useObligations();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const obligations: ObligationLike[] = data?.items ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return obligations.filter((ob) => {
      const haystack = [
        ob.actor,
        ob.obligation,
        ob.section,
        ob.risklevel,
        ob.status,
        ob.frequency,
        ob.deadline,
        ob.department,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !q || haystack.includes(q);
      const matchesStatus =
        statusFilter === "ALL" || (ob.status || "NOTSTARTED") === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [obligations, query, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: obligations.length,
      active: obligations.filter((o) => (o.status || "NOTSTARTED") === "ACTIVE").length,
      compliant: obligations.filter((o) => (o.status || "NOTSTARTED") === "COMPLIANT").length,
      critical: obligations.filter((o) => (o.risklevel || "").toUpperCase() === "CRITICAL").length,
    };
  }, [obligations]);

  if (isLoading) return <LoadingBlock label="Loading obligations..." />;
  if (error) return <ErrorBlock message={error.message} />;

  return (
    <main className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Obligation register</p>
          <h1 className="page-title mt-4">Obligations</h1>
          <p className="page-subtitle">
            Browse the full structured obligation register generated from circular intelligence and
            linked execution workflows.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Total" value={stats.total} tone="text-white" />
            <StatTile label="Active" value={stats.active} tone="text-cyan-300" />
            <StatTile label="Compliant" value={stats.compliant} tone="text-emerald-400" />
            <StatTile label="Critical" value={stats.critical} tone="text-red-400" />
          </div>
        </Card>
      </div>

      <Card className="rounded-[24px] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search actor, obligation, section, deadline..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-9 pr-3 text-sm text-gray-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <Filter size={14} className="text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-200 outline-none"
            >
              <option value="ALL">All statuses</option>
              <option value="NOTSTARTED">Not started</option>
              <option value="INDESIGN">In design</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLIANT">Compliant</option>
            </select>
          </div>
        </div>
      </Card>

      {!obligations.length ? (
        <EmptyBlock label="No obligations found. Ingest a document and run extraction to populate this register." />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((ob) => (
            <Card key={ob.id} className="rounded-[24px] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-white">{ob.actor || "Unknown actor"}</p>
                  <p className="mt-1 text-[11px] font-mono text-zinc-500">
                    {ob.section ? `Section ${ob.section}` : "No section mapped"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge label={ob.risklevel || "Medium"} />
                  <Badge label={ob.status || "NOTSTARTED"} />
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-200">
                {ob.obligation || "No obligation text available."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MetaBox
                  icon={<CalendarClock size={14} className="text-cyan-300" />}
                  label="Deadline"
                  value={ob.deadline || "Not specified"}
                />
                <MetaBox
                  icon={<ShieldCheck size={14} className="text-amber-400" />}
                  label="Frequency"
                  value={ob.frequency || "Not specified"}
                />
                <MetaBox
                  icon={<Building2 size={14} className="text-indigo-300" />}
                  label="Department"
                  value={ob.department || "Unassigned"}
                />
              </div>
            </Card>
          ))}

          {!filtered.length ? (
            <div className="xl:col-span-2">
              <EmptyBlock label="No obligations matched the current filters." />
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function MetaBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      </div>
      <p className="mt-2 text-sm text-zinc-200">{value}</p>
    </div>
  );
}