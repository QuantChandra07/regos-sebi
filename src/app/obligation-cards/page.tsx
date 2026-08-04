"use client";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/ui/StateBlocks";
import { useObligations } from "../../lib/hooks";
import { ListChecks, ShieldAlert, CalendarClock } from "lucide-react";

export default function ObligationCardsPage() {
  const { data, error, isLoading } = useObligations();

  if (isLoading) return <LoadingBlock label="Loading obligations..." />;
  if (error) return <ErrorBlock message={error.message} />;

  const obligations = data?.items ?? [];

  return (
    <main className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Structured obligation workspace</p>
          <h1 className="page-title mt-4">Obligation Cards</h1>
          <p className="page-subtitle">
            Review extracted compliance obligations as operational cards with ownership, timing,
            status, and evidence context.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Live extraction
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{obligations.length}</p>
              <p className="mt-1 text-sm text-zinc-400">Obligations available in workspace</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
              <ListChecks size={18} className="text-cyan-300" />
            </div>
          </div>
        </Card>
      </div>

      {obligations.length === 0 ? (
        <EmptyBlock label="No obligations found. Ingest a document and run extraction to populate this view." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {obligations.map((ob) => (
            <Card key={ob.id} className="rounded-[24px] p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{ob.actor}</p>
                  {ob.section ? (
                    <p className="mt-1 text-[11px] font-mono text-zinc-500">Section {ob.section}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge label={ob.risklevel || "Medium"} />
                  <Badge label={ob.status || "NOTSTARTED"} />
                </div>
              </div>

              <p className="text-sm leading-7 text-zinc-200">{ob.obligation}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={14} className="text-amber-400" />
                    <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Frequency</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-200">{ob.frequency || "Not specified"}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={14} className="text-cyan-300" />
                    <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Deadline</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-200">{ob.deadline || "Not specified"}</p>
                </div>
              </div>

              {"evidence" in ob &&
              Array.isArray((ob as { evidence?: string[] }).evidence) &&
              (ob as { evidence?: string[] }).evidence!.length > 0 ? (
                <div className="mt-5">
                  <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500">
                    Evidence
                  </p>
                  <ul className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-zinc-300">
                    {(ob as { evidence?: string[] }).evidence!.map((ev, idx) => (
                      <li key={idx} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}