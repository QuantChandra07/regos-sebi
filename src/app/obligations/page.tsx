"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  CalendarClock,
  Filter,
  Search,
  ShieldCheck,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "../../components/ui/StateBlocks";
import { useObligations } from "../../lib/hooks";

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

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "NOTSTARTED", label: "Not started" },
  { value: "INDESIGN", label: "In design" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLIANT", label: "Compliant" },
];

function normalizeStatus(value?: string) {
  return (value || "NOTSTARTED")
    .replace(/[\s_-]/g, "")
    .toUpperCase();
}

function normalizeRisk(value?: string) {
  return (value || "MEDIUM").toUpperCase();
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
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-semibold ${tone}`}>
        {value}
      </p>
    </div>
  );
}

function MetaBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2">
        {icon}

        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
          {label}
        </p>
      </div>

      <p className="mt-2 break-words text-sm text-zinc-200">
        {value}
      </p>
    </div>
  );
}

export default function ObligationsPage() {
  const { data, error, isLoading } = useObligations();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const obligations: ObligationLike[] = data?.items ?? [];

  const filtered = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return obligations.filter((obligation) => {
      const haystack = [
        obligation.id,
        obligation.actor,
        obligation.obligation,
        obligation.section,
        obligation.risklevel,
        obligation.status,
        obligation.frequency,
        obligation.deadline,
        obligation.department,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !searchTerm || haystack.includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizeStatus(obligation.status) === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [obligations, query, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: obligations.length,

      active: obligations.filter(
        (obligation) =>
          normalizeStatus(obligation.status) === "ACTIVE",
      ).length,

      compliant: obligations.filter(
        (obligation) =>
          normalizeStatus(obligation.status) === "COMPLIANT",
      ).length,

      critical: obligations.filter(
        (obligation) =>
          normalizeRisk(obligation.risklevel) === "CRITICAL",
      ).length,
    };
  }, [obligations]);

  const shell = (children: ReactNode) => (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      {children}
    </Shell>
  );

  if (isLoading) {
    return shell(
      <LoadingBlock label="Loading obligations..." />,
    );
  }

  if (error) {
    return shell(<ErrorBlock message={error.message} />);
  }

  return shell(
    <main className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">
            Obligation register
          </p>

          <h1 className="page-title mt-4">
            Obligations
          </h1>

          <p className="page-subtitle">
            Browse the structured obligation register generated
            from circular intelligence and linked execution
            workflows.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Total"
              value={stats.total}
              tone="text-white"
            />

            <StatTile
              label="Active"
              value={stats.active}
              tone="text-cyan-300"
            />

            <StatTile
              label="Compliant"
              value={stats.compliant}
              tone="text-emerald-400"
            />

            <StatTile
              label="Critical"
              value={stats.critical}
              tone="text-red-400"
            />
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
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search actor, obligation, section, deadline..."
              className="input-glass w-full rounded-2xl py-3 pl-9 pr-3 text-sm text-gray-200 placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <Filter
              size={14}
              className="text-zinc-500"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="bg-transparent text-sm text-gray-200 outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-slate-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {!obligations.length ? (
        <EmptyBlock label="No obligations found. Ingest a document and run extraction to populate this register." />
      ) : !filtered.length ? (
        <EmptyBlock label="No obligations matched the current filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((obligation) => (
            <Card
              key={obligation.id}
              className="rounded-[24px] p-5 transition-colors hover:border-cyan-500/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-white">
                    {obligation.actor || "Unknown actor"}
                  </p>

                  <p className="mt-1 font-mono text-[11px] text-zinc-500">
                    {obligation.id}
                    {" · "}
                    {obligation.section
                      ? `Section ${obligation.section}`
                      : "No section mapped"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    label={obligation.risklevel || "Medium"}
                  />

                  <Badge
                    label={obligation.status || "NOTSTARTED"}
                  />
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-200">
                {obligation.obligation ||
                  "No obligation text available."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MetaBox
                  icon={
                    <CalendarClock
                      size={14}
                      className="text-cyan-300"
                    />
                  }
                  label="Deadline"
                  value={
                    obligation.deadline || "Not specified"
                  }
                />

                <MetaBox
                  icon={
                    <ShieldCheck
                      size={14}
                      className="text-amber-400"
                    />
                  }
                  label="Frequency"
                  value={
                    obligation.frequency || "Not specified"
                  }
                />

                <MetaBox
                  icon={
                    <Building2
                      size={14}
                      className="text-indigo-300"
                    />
                  }
                  label="Department"
                  value={
                    obligation.department || "Unassigned"
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>,
  );
}