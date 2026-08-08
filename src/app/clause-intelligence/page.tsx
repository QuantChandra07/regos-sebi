"use client";

import { useMemo, useState } from "react";
import {
  Braces,
  Check,
  Edit3,
  Sparkles,
  Terminal,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "../../components/ui/StateBlocks";
import {
  useCircularDetail,
  useCirculars,
} from "../../lib/hooks";

type SelectedClauseView = {
  id: string;
  clauseNumber: string;
  content: string;
  riskLevel: "low" | "medium" | "high";
  department: string;
  timeline: string;
  documentId: string;
  applicability: string;
  penalty: string;
  machineLogic: string;
};

function getRiskLevel(
  hasDeadline: boolean,
  hasSection: boolean,
): "low" | "medium" | "high" {
  if (hasDeadline) {
    return "high";
  }

  if (hasSection) {
    return "medium";
  }

  return "low";
}

export default function ClauseIntelligencePage() {
  const [selectedCircularId, setSelectedCircularId] =
    useState<string | undefined>(undefined);

  const [selectedClauseId, setSelectedClauseId] =
    useState<string | undefined>(undefined);

  const circulars = useCirculars();
  const detail = useCircularDetail(selectedCircularId);

  const normalizedClauses = useMemo<SelectedClauseView[]>(
    () => {
      if (!detail.data) {
        return [];
      }

      return detail.data.clauses.map((clause, index) => {
        const matchedObligation =
          detail.data?.obligations?.find(
            (obligation) =>
              obligation.section ===
                clause.section_label ||
              obligation.section === clause.chunk_id,
          );

        const clauseNumber =
          clause.section_label || `Clause ${index + 1}`;

        const hasDeadline = Boolean(
          matchedObligation?.deadline,
        );

        const hasSection = Boolean(
          matchedObligation?.section,
        );

        return {
          id: clause.chunk_id,
          clauseNumber,
          content: clause.text,
          riskLevel: getRiskLevel(
            hasDeadline,
            hasSection,
          ),
          department:
            matchedObligation?.actor || "Unassigned",
          timeline:
            matchedObligation?.deadline || "No deadline",
          documentId: selectedCircularId || "N/A",
          applicability:
            matchedObligation?.actor ||
            "General applicability",
          penalty: "Not specified",
          machineLogic: JSON.stringify(
            {
              clause_id: clause.chunk_id,
              section: clause.section_label || null,
              actor: matchedObligation?.actor || null,
              obligation:
                matchedObligation?.obligation || null,
              deadline:
                matchedObligation?.deadline || null,
            },
            null,
            2,
          ),
        };
      });
    },
    [detail.data, selectedCircularId],
  );

  const selectedClause =
    normalizedClauses.find(
      (clause) => clause.id === selectedClauseId,
    ) || normalizedClauses[0];

  const resetClauseSelection = () => {
    setSelectedCircularId(undefined);
    setSelectedClauseId(undefined);
  };

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <p className="section-label">
              Legal extraction workspace
            </p>

            <h1 className="page-title mt-4">
              Clause Intelligence
            </h1>

            <p className="page-subtitle">
              Explore extracted clauses, linked obligations,
              and executable machine-readable logic for a
              selected circular.
            </p>
          </div>

          <Card className="rounded-[28px] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Extraction mode
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  Structured obligation parsing
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  LLM-ready legal intelligence view
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                <Braces
                  size={18}
                  className="text-cyan-300"
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/15"
            >
              <Sparkles size={15} />
              Re-run Extractor
            </button>
          </Card>
        </div>

        <Card className="rounded-[26px] p-4">
          <label
            htmlFor="circular-select"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Select circular
          </label>

          <select
            id="circular-select"
            className="select-glass w-full rounded-2xl px-4 py-3 text-sm text-white"
            value={selectedCircularId || ""}
            onChange={(event) => {
              const value =
                event.target.value || undefined;

              setSelectedCircularId(value);
              setSelectedClauseId(undefined);
            }}
          >
            <option value="" className="bg-slate-900">
              Select a circular
            </option>

            {circulars.data?.items?.map((circular) => (
              <option
                key={circular.id}
                value={circular.id}
                className="bg-slate-900"
              >
                {circular.title}
              </option>
            ))}
          </select>

          {circulars.isLoading ? (
            <p className="mt-3 text-xs text-zinc-500">
              Loading circulars...
            </p>
          ) : null}

          {circulars.error ? (
            <div className="mt-3">
              <ErrorBlock
                message={circulars.error.message}
              />
            </div>
          ) : null}
        </Card>

        {detail.isLoading ? (
          <LoadingBlock label="Loading clause intelligence..." />
        ) : null}

        {detail.error ? (
          <ErrorBlock message={detail.error.message} />
        ) : null}

        {!selectedCircularId &&
        !detail.isLoading &&
        !detail.error ? (
          <EmptyBlock label="Select a circular to view clause intelligence." />
        ) : null}

        {selectedCircularId && detail.data ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">
                    Extracted clauses
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    {normalizedClauses.length} clauses found
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetClauseSelection}
                  className="btn-ghost text-xs"
                >
                  Clear selection
                </button>
              </div>

              {normalizedClauses.length > 0 ? (
                normalizedClauses.map((clause) => (
                  <Card
                    key={clause.id}
                    onClick={() =>
                      setSelectedClauseId(clause.id)
                    }
                    className={`cursor-pointer rounded-2xl transition-all ${
                      selectedClause?.id === clause.id
                        ? "border-cyan-500/40 bg-cyan-950/10"
                        : "hover:border-cyan-500/25"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {clause.clauseNumber}
                      </span>

                      <Badge
                        variant={clause.riskLevel}
                      />
                    </div>

                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-300">
                      {clause.content}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3 text-[11px] font-mono text-gray-500">
                      <span className="truncate">
                        Dept: {clause.department}
                      </span>

                      <span className="shrink-0">
                        {clause.timeline}
                      </span>
                    </div>
                  </Card>
                ))
              ) : (
                <EmptyBlock label="No clauses found for this circular." />
              )}
            </div>

            <div className="lg:col-span-7">
              {selectedClause ? (
                <Card className="space-y-5 rounded-[26px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h2 className="font-mono text-sm font-bold text-white">
                        {selectedClause.clauseNumber}{" "}
                        Analysis
                      </h2>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        Document ID:{" "}
                        {selectedClause.documentId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-lg border border-emerald-800 bg-emerald-950/60 px-2.5 py-1.5 text-xs font-mono text-emerald-400"
                      >
                        <Check size={12} />
                        <span>Approved</span>
                      </button>

                      <button
                        type="button"
                        aria-label="Edit clause"
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-300 hover:bg-white/10"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.16em] text-gray-500">
                      Legal text fragment
                    </label>

                    <p className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-gray-200">
                      “{selectedClause.content}”
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-[0.16em] text-gray-500">
                        Applicability
                      </label>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-gray-300">
                          {selectedClause.applicability}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-[0.16em] text-gray-500">
                        Penalty clause
                      </label>

                      <p className="mt-2 font-mono text-sm text-red-400">
                        {selectedClause.penalty || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Terminal
                        size={14}
                        className="text-cyan-400"
                      />

                      <label className="text-[10px] font-mono uppercase tracking-[0.16em] text-cyan-400">
                        Executable machine logic
                      </label>
                    </div>

                    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs leading-6 text-emerald-400">
                      {selectedClause.machineLogic}
                    </pre>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="mb-3 text-sm font-semibold text-white">
                      Linked obligations
                    </h3>

                    <div className="space-y-3">
                      {detail.data.obligations.length > 0 ? (
                        detail.data.obligations.map(
                          (obligation) => (
                            <div
                              key={obligation.id}
                              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                            >
                              <p className="text-xs text-zinc-500">
                                {obligation.actor ||
                                  "Unknown actor"}
                              </p>

                              <p className="mt-2 text-sm leading-6 text-zinc-200">
                                {obligation.obligation ||
                                  "No obligation text available."}
                              </p>

                              <p className="mt-2 text-xs text-zinc-400">
                                {obligation.section ||
                                  "No section"}{" "}
                                •{" "}
                                {obligation.deadline ||
                                  "No deadline"}
                              </p>
                            </div>
                          ),
                        )
                      ) : (
                        <EmptyBlock label="No obligations extracted for this circular." />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      className="rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-semibold font-mono text-black transition-colors hover:bg-cyan-400"
                    >
                      Generate Obligation Workflow
                    </button>
                  </div>
                </Card>
              ) : (
                <EmptyBlock label="Select a clause to inspect its analysis." />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}