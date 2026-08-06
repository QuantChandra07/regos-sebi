"use client";

import React, { useMemo, useState } from "react";
import { UploadCloud, X, Sparkles, CalendarRange, FileText } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/ui/StateBlocks";
import { useCirculars, useCircularDetail } from "../../lib/hooks";
import type { Circular, Clause } from "../../types/api";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusVariant(label?: string | null) {
  if (!label) return "NEW";
  const upper = label.toUpperCase();
  if (["NEW", "UPDATED", "SUPERSEDED", "ARCHIVED"].includes(upper)) return upper;
  return "NEW";
}

const filters = ["ALL", "NEW", "UPDATED", "SUPERSEDED", "ARCHIVED"] as const;

export default function RegulationFeedPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [autoMonitor, setAutoMonitor] = useState(true);
  const [intermediaryType, setIntermediaryType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCircularId, setSelectedCircularId] = useState<string | undefined>(undefined);
  const [aiRunning, setAiRunning] = useState(false);

  const query = useMemo(() => {
    const qs = new URLSearchParams();
    if (intermediaryType) qs.set("intermediary_type", intermediaryType);
    if (fromDate) qs.set("from_date", fromDate);
    if (toDate) qs.set("to_date", toDate);
    const str = qs.toString();
    return str ? `?${str}` : "";
  }, [intermediaryType, fromDate, toDate]);

  const { data, error, isLoading } = useCirculars(query);
  const detail = useCircularDetail(selectedCircularId);

  const circulars = data?.items ?? [];

  const filteredCirculars = useMemo(() => {
    if (statusFilter === "ALL") return circulars;
    return circulars.filter((doc) => getStatusVariant(doc.category) === statusFilter);
  }, [circulars, statusFilter]);

  const selectedDoc: Circular | null =
    circulars.find((doc) => doc.id === selectedCircularId) ?? null;

  const extractedClauses: Clause[] = detail.data?.clauses ?? [];

  const handleExtract = async () => {
    if (!selectedCircularId) return;
    setAiRunning(true);
    try {
      await detail.mutate();
    } finally {
      setAiRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Regulatory intake</p>
          <h1 className="page-title mt-4">Regulation Feed</h1>
          <p className="page-subtitle">
            Ingest, monitor, and inspect SEBI circulars with extraction-ready metadata and
            machine-assisted clause parsing.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Monitoring state
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {autoMonitor ? "Auto-monitoring on" : "Manual mode"}
              </p>
              <p className="mt-1 text-sm text-zinc-400">SEBI watch pipeline status</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
              <CalendarRange size={18} className="text-cyan-300" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-200">Auto-monitor SEBI site</p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Toggle simulated monitoring state in UI
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAutoMonitor((prev) => !prev)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  autoMonitor ? "bg-cyan-500" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    autoMonitor ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="rounded-[26px] lg:col-span-4">
          <h3 className="section-title">Upload document</h3>

          <div className="mt-4 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center transition-colors hover:border-cyan-500/30">
            <UploadCloud className="mx-auto mb-3 text-zinc-500" size={28} />
            <p className="text-sm text-zinc-300">Upload PDF, Word, HTML, or email text</p>
            <div className="mt-4">
              <Button type="button">Browse Files</Button>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              placeholder="Intermediary type"
              value={intermediaryType}
              onChange={(e) => setIntermediaryType(e.target.value)}
            />

            <input
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <input
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </Card>

        <Card className="rounded-[26px] lg:col-span-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-label">Live feed</p>
              <h3 className="section-title mt-2">Circular timeline</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-mono transition-colors ${
                    statusFilter === status
                      ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                      : "border-white/10 bg-white/5 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? <LoadingBlock label="Loading circulars..." /> : null}
          {error ? <ErrorBlock message={error.message} /> : null}
          {!isLoading && !error && !filteredCirculars.length ? (
            <EmptyBlock label="No circulars found." />
          ) : null}

          <div className="space-y-2">
            {filteredCirculars.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedCircularId(doc.id)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-cyan-500/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200">{doc.title}</p>
                    <p className="mt-1 font-mono text-[11px] text-zinc-500">
                      {doc.reference_id || "No reference"} •{" "}
                      {formatDate(doc.effective_from || doc.uploaded_at)}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[doc.regulator, doc.entity_type || "Generic", doc.category || "Circular"]
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  </div>

                  <Badge label={getStatusVariant(doc.category)} />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {selectedDoc ? (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedCircularId(undefined)}
        >
          <div
            className="h-full w-full max-w-5xl overflow-y-auto border-l border-white/10 bg-[#09111b]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#09111b]/95 p-5 backdrop-blur-xl">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-white">{selectedDoc.title}</h2>
                <p className="mt-1 font-mono text-[11px] text-zinc-500">
                  {selectedDoc.reference_id || "No reference ID"}
                </p>
              </div>

              <button onClick={() => setSelectedCircularId(undefined)} type="button">
                <X size={18} className="text-zinc-400 hover:text-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-cyan-300" />
                  <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
                    Document metadata
                  </h3>
                </div>

                <div className="mt-4 space-y-3 text-sm text-zinc-300">
                  <p><span className="text-zinc-500">Title:</span> {selectedDoc.title}</p>
                  <p><span className="text-zinc-500">Reference:</span> {selectedDoc.reference_id || "—"}</p>
                  <p><span className="text-zinc-500">Regulator:</span> {selectedDoc.regulator || "—"}</p>
                  <p><span className="text-zinc-500">Entity Type:</span> {selectedDoc.entity_type || "—"}</p>
                  <p><span className="text-zinc-500">Effective:</span> {formatDate(selectedDoc.effective_from)}</p>
                  <p><span className="text-zinc-500">Category:</span> {selectedDoc.category || "—"}</p>
                </div>
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
                    AI panel
                  </h3>

                  <Button onClick={handleExtract} disabled={aiRunning}>
                    <Sparkles size={14} />
                    {aiRunning ? "Extracting..." : "Refresh Clauses"}
                  </Button>
                </div>

                <div className="text-[11px] font-mono text-zinc-500">
                  AI status: <span className="text-cyan-400">{aiRunning ? "RUNNING" : "READY"}</span>
                </div>

                {aiRunning || detail.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : null}

                {detail.error ? <ErrorBlock message={detail.error.message} /> : null}

                {!detail.isLoading && !detail.error && extractedClauses.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {extractedClauses.map((c) => (
                      <div
                        key={c.chunk_id}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <p className="font-mono text-[11px] text-cyan-400">
                          {c.section_label || c.chunk_id}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-300">{c.text}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {c.heading ? <Badge label={c.heading} /> : null}
                          {c.category ? <Badge label={c.category} /> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {!detail.isLoading && !detail.error && extractedClauses.length === 0 ? (
                  <EmptyBlock label="No clauses extracted for this circular." />
                ) : null}

                {!detail.isLoading && !detail.error && detail.data?.obligations?.length ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-mono text-[11px] text-zinc-400">Obligation summary</p>
                    <p className="mt-1 text-sm text-zinc-300">
                      {detail.data.obligations.length} obligations linked to this circular.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}