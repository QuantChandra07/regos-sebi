"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
  FileSearch,
  GitBranch,
  Loader2,
  Network,
  ScanText,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

type StageStatus = "complete" | "active" | "pending";

type ProcessingStage = {
  id: string;
  label: string;
  description: string;
  log: string;
  icon: React.ReactNode;
};

const processingStages: ProcessingStage[] = [
  {
    id: "upload",
    label: "Loading PDF",
    description: "Validating document metadata and file integrity.",
    log: "Loading Master Circular – Stock Brokers.pdf",
    icon: <FileSearch size={15} />,
  },
  {
    id: "ocr",
    label: "OCR Processing",
    description: "Extracting text from scanned pages and PDF text layers.",
    log: "OCR completed — 419 pages processed",
    icon: <ScanText size={15} />,
  },
  {
    id: "extraction",
    label: "Text Extraction",
    description: "Parsing headings, sections, page references, and body text.",
    log: "Extracted 186,432 tokens from regulatory text",
    icon: <FileSearch size={15} />,
  },
  {
    id: "chunking",
    label: "Semantic Chunking",
    description: "Creating overlapping chunks with clause-boundary awareness.",
    log: "Created 1,240 semantic chunks — average 512 tokens",
    icon: <Zap size={15} />,
  },
  {
    id: "embeddings",
    label: "Vector Embeddings",
    description: "Generating embeddings for semantic retrieval and RAG.",
    log: "Generated 1,240 vector embeddings",
    icon: <Network size={15} />,
  },
  {
    id: "clauses",
    label: "Clause Extraction",
    description: "Identifying and classifying regulatory clauses.",
    log: "532 clauses identified by the clause parser",
    icon: <FileSearch size={15} />,
  },
  {
    id: "obligations",
    label: "Obligation Detection",
    description: "Extracting actors, actions, deadlines, frequencies, and conditions.",
    log: "148 regulatory obligations extracted and categorized",
    icon: <CheckCircle2 size={15} />,
  },
  {
    id: "risk",
    label: "Risk Analysis",
    description: "Calculating impact, likelihood, and overall obligation risk.",
    log: "Risk analysis completed — 7 critical, 23 high-risk items",
    icon: <ShieldCheck size={15} />,
  },
  {
    id: "graph",
    label: "Knowledge Graph",
    description: "Linking circulars, clauses, obligations, risks, and evidence.",
    log: "Knowledge graph built — 1,842 nodes and 4,231 edges",
    icon: <GitBranch size={15} />,
  },
  {
    id: "workflows",
    label: "Workflow Generation",
    description: "Converting obligations into tasks, owners, and evidence requirements.",
    log: "23 compliance workflows generated",
    icon: <Workflow size={15} />,
  },
  {
    id: "summary",
    label: "AI Summary",
    description: "Preparing a grounded executive summary and risk narrative.",
    log: "Executive summary and risk narrative generated",
    icon: <Sparkles size={15} />,
  },
  {
    id: "workspace",
    label: "Workspace Ready",
    description: "Initializing the compliance workspace and connected views.",
    log: "Workspace initialized — dashboard is ready",
    icon: <CheckCircle2 size={15} />,
  },
];

const initialLog = {
  timestamp: getTimestamp(),
  message: "Loading Master Circular – Stock Brokers.pdf",
};

export default function ProcessingPage() {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(
    new Set(),
  );
  const [logs, setLogs] = useState([initialLog]);
  const [isComplete, setIsComplete] = useState(false);

  const progress = useMemo(() => {
    if (isComplete) {
      return 100;
    }

    return Math.round(
      (completedStages.size / processingStages.length) * 100,
    );
  }, [completedStages.size, isComplete]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCompletedStages((previous) => {
        const next = new Set(previous);
        next.add(currentStage);
        return next;
      });

      setLogs((previous) => [
        ...previous.slice(-11),
        {
          timestamp: getTimestamp(),
          message: processingStages[currentStage].log,
        },
      ]);

      if (currentStage >= processingStages.length - 1) {
        setIsComplete(true);
        return;
      }

      setCurrentStage((previous) => previous + 1);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [currentStage, isComplete]);

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1400);

    return () => window.clearTimeout(redirectTimer);
  }, [isComplete]);

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[850px] -translate-x-1/2 rounded-full bg-cyan-400/[0.05] blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
              <div className="flex items-center gap-2">
                <Badge
                  label={isComplete ? "COMPLETE" : "PROCESSING"}
                />

                {!isComplete ? (
                  <span className="flex items-center gap-1.5 text-xs text-cyan-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                    AI pipeline active
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                    <CheckCircle2 size={13} />
                    Workspace initialized
                  </span>
                )}
              </div>

              <h1 className="page-title mt-4">
                Processing Regulatory Document
              </h1>

              <p className="page-subtitle max-w-3xl">
                The AI Compliance Engine is converting the uploaded
                circular into page-mapped regulatory intelligence,
                obligations, risk scores, workflows, and evidence links.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge label="OCR" />
                <Badge label="RAG" />
                <Badge label="Clause Intelligence" />
                <Badge label="Knowledge Graph" />
              </div>
            </div>

            <Card className="rounded-[28px] p-5">
              <p className="section-label">Pipeline progress</p>

              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-bold text-cyan-300">
                    {progress}%
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Complete
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                  {isComplete ? (
                    <CheckCircle2
                      size={21}
                      className="text-emerald-400"
                    />
                  ) : (
                    <Loader2
                      size={21}
                      className="animate-spin text-cyan-300"
                    />
                  )}
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-zinc-500">
                  Current stage
                </span>

                <span className="font-medium text-zinc-200">
                  {isComplete
                    ? "Workspace Ready"
                    : processingStages[currentStage].label}
                </span>
              </div>
            </Card>
          </div>

          <div className="grid min-h-[620px] gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
            <Card className="rounded-[28px] p-4">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="section-label">Execution trace</p>

                  <h2 className="mt-2 text-base font-semibold text-white">
                    Pipeline stages
                  </h2>
                </div>

                <span className="font-mono text-xs text-zinc-500">
                  {completedStages.size}/{processingStages.length}
                </span>
              </div>

              <div className="relative space-y-1">
                <div className="absolute bottom-5 left-[18px] top-5 w-px bg-white/10" />

                <div
                  className="absolute left-[18px] top-5 w-px bg-gradient-to-b from-emerald-400 to-cyan-400 transition-all duration-700"
                  style={{
                    height: `${Math.min(
                      100,
                      (completedStages.size /
                        processingStages.length) *
                        100,
                    )}%`,
                  }}
                />

                {processingStages.map((stage, index) => {
                  const stageStatus = getStageStatus(
                    index,
                    currentStage,
                    completedStages,
                    isComplete,
                  );

                  return (
                    <StageRow
                      key={stage.id}
                      stage={stage}
                      index={index}
                      status={stageStatus}
                    />
                  );
                })}
              </div>
            </Card>

            <Card className="flex min-h-[620px] flex-col rounded-[28px] p-5 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-label">System activity</p>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Live processing terminal
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs text-zinc-500">
                    {isComplete ? "Complete" : "Live"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex-1 overflow-hidden rounded-2xl border border-cyan-500/10 bg-black/30 p-4 font-mono text-xs leading-7">
                <p className="mb-3 text-cyan-400/50">
                  REGOS-SEBI AI PIPELINE v2.4.0
                </p>

                <p className="mb-3 text-zinc-600">
                  Document: master-circular-stock-brokers.pdf
                </p>

                <div className="max-h-[430px] overflow-y-auto">
                  {logs.map((log, index) => (
                    <div
                      key={`${log.timestamp}-${log.message}-${index}`}
                      className={`flex gap-3 ${
                        index === logs.length - 1
                          ? "text-cyan-300"
                          : "text-zinc-500"
                      }`}
                    >
                      <span className="shrink-0 text-cyan-400/40">
                        [{log.timestamp}]
                      </span>

                      <span>{log.message}</span>
                    </div>
                  ))}

                  {!isComplete ? (
                    <div className="mt-2 flex items-center gap-3 text-cyan-300">
                      <span>[{getTimestamp()}]</span>
                      <span>
                        Running {processingStages[currentStage].label}
                        <span className="ml-1 animate-pulse">
                          ...
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 font-semibold text-emerald-400">
                      <CheckCircle2 size={14} />
                      Processing complete — launching workspace
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-5">
                <MetricPill label="Pages" value="419" />
                <MetricPill label="Chunks" value="1,240" />
                <MetricPill label="Embeddings" value="1,240" />
                <MetricPill label="Risk Score" value="8.4" />
                <MetricPill
                  label="Remaining"
                  value={isComplete ? "0s" : "Calculating"}
                />
              </div>
            </Card>
          </div>

          <Card className="rounded-[28px] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock3
                  size={16}
                  className="text-zinc-500"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Document processing
                  </p>

                  <p className="text-xs text-zinc-500">
                    Master Circular – Stock Brokers · 419 pages
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge label="FastAPI" />
                <Badge label="Vector Search" />
                <Badge label="RAG Grounding" />
                <Badge label="Evidence Mapping" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function StageRow({
  stage,
  index,
  status,
}: {
  stage: ProcessingStage;
  index: number;
  status: StageStatus;
}) {
  const isComplete = status === "complete";
  const isActive = status === "active";

  return (
    <div className="relative z-10 flex items-center gap-3 rounded-xl px-1.5 py-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          isComplete
            ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(34,197,94,0.16)]"
            : isActive
              ? "border-cyan-400/70 bg-cyan-500/15 text-cyan-300 shadow-[0_0_14px_rgba(56,189,248,0.22)]"
              : "border-white/10 bg-white/[0.03] text-zinc-600"
        }`}
      >
        {isComplete ? (
          <CheckCircle2 size={14} />
        ) : isActive ? (
          <Loader2
            size={14}
            className="animate-spin"
          />
        ) : (
          <Circle size={12} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-zinc-600">
            {String(index + 1).padStart(2, "0")}
          </span>

          <p
            className={`truncate text-xs font-semibold ${
              isComplete
                ? "text-emerald-300"
                : isActive
                  ? "text-cyan-300"
                  : "text-zinc-500"
            }`}
          >
            {stage.label}
          </p>
        </div>

        <p className="mt-0.5 truncate text-[10px] text-zinc-600">
          {isComplete
            ? "Completed"
            : isActive
              ? "Processing"
              : "Pending"}
        </p>
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.04] px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm font-semibold text-cyan-300">
        {value}
      </p>
    </div>
  );
}

function getStageStatus(
  index: number,
  currentStage: number,
  completedStages: Set<number>,
  isComplete: boolean,
): StageStatus {
  if (isComplete || completedStages.has(index)) {
    return "complete";
  }

  if (index === currentStage) {
    return "active";
  }

  return "pending";
}

function getTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}