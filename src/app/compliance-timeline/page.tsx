"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  History,
  Loader2,
  Sparkles,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

type StageStatus = "complete" | "active" | "pending";

type Stage = {
  id: string;
  label: string;
  sublabel: string;
  status: StageStatus;
  timestamp: string;
  duration: string;
  description: string;
  outputs: string[];
  metrics: Record<string, string>;
};

const stages: Stage[] = [
  {
    id: "pdf-upload",
    label: "PDF Upload",
    sublabel: "Document Ingestion",
    status: "complete",
    timestamp: "09:41:03",
    duration: "0.3s",
    description:
      "Raw PDF uploaded to the ingestion pipeline. The document was validated for file integrity, page count, and format compliance.",
    outputs: [
      "document-sha256.txt",
      "metadata.json",
      "upload-receipt.log",
    ],
    metrics: {
      Pages: "419",
      "File Size": "14.2 MB",
      "SHA-256": "a3f8…d92c",
      Status: "Accepted",
    },
  },
  {
    id: "ocr",
    label: "OCR",
    sublabel: "Text Extraction",
    status: "complete",
    timestamp: "09:41:06",
    duration: "4.1s",
    description:
      "PDF text extraction and OCR processing completed. High-confidence text regions bypassed OCR while low-confidence areas were reprocessed.",
    outputs: [
      "extracted-text.txt",
      "ocr-confidence-map.json",
      "page-heatmap.png",
    ],
    metrics: {
      Characters: "218,432",
      Confidence: "96.4%",
      Pages: "419 / 419",
      Engine: "PDF Layer + OCR",
    },
  },
  {
    id: "chunking",
    label: "Chunking",
    sublabel: "Semantic Segmentation",
    status: "complete",
    timestamp: "09:41:11",
    duration: "1.2s",
    description:
      "The document was divided into semantic chunks with overlap to preserve context across clause boundaries.",
    outputs: ["chunks.jsonl", "chunk-metadata.json"],
    metrics: {
      "Total Chunks": "1,847",
      "Average Size": "284 tokens",
      Overlap: "10%",
      Strategy: "Recursive + Semantic",
    },
  },
  {
    id: "embeddings",
    label: "Embeddings",
    sublabel: "Vector Generation",
    status: "complete",
    timestamp: "09:41:13",
    duration: "2.8s",
    description:
      "Semantic embeddings were generated for document chunks and stored with document and section metadata for retrieval.",
    outputs: [
      "vectors.bin",
      "embedding-upsert-log.json",
    ],
    metrics: {
      Model: "Text Embedding Model",
      Dimensions: "3,072",
      Upserted: "1,847",
      Index: "regos-sebi",
    },
  },
  {
    id: "clause-extraction",
    label: "Clause Extraction",
    sublabel: "LLM Parsing",
    status: "complete",
    timestamp: "09:41:16",
    duration: "3.4s",
    description:
      "Clause boundaries, numbering, classifications, and cross-references were extracted from the regulatory text.",
    outputs: [
      "clauses.jsonl",
      "clause-graph.json",
      "cross-refs.json",
    ],
    metrics: {
      Clauses: "532",
      Prescriptive: "318",
      Descriptive: "142",
      "Cross-references": "89",
      Model: "Regulatory LLM",
    },
  },
  {
    id: "obligation-detection",
    label: "Obligation Detection",
    sublabel: "Entity Extraction",
    status: "complete",
    timestamp: "09:41:20",
    duration: "2.1s",
    description:
      "Actors, actions, deadlines, frequencies, and conditions were identified from prescriptive clauses.",
    outputs: [
      "obligations.jsonl",
      "obligation-actors.json",
      "deadlines.json",
    ],
    metrics: {
      Obligations: "148",
      Actors: "12",
      Frequencies: "7 types",
      Deadlines: "43 extracted",
      Confidence: "94.2%",
    },
  },
  {
    id: "workflow",
    label: "Workflow",
    sublabel: "Task Decomposition",
    status: "complete",
    timestamp: "09:41:23",
    duration: "1.5s",
    description:
      "Obligations were mapped to operational workflows with task decomposition, ownership suggestions, SLA targets, and evidence requirements.",
    outputs: [
      "workflows.json",
      "task-assignments.json",
      "sla-map.json",
    ],
    metrics: {
      Workflows: "67",
      Tasks: "284",
      "Average Tasks / Workflow": "4.2",
      "Auto Assigned": "83%",
    },
  },
  {
    id: "evidence",
    label: "Evidence",
    sublabel: "Document Matching",
    status: "complete",
    timestamp: "09:41:25",
    duration: "0.9s",
    description:
      "Existing evidence was matched against obligations using semantic similarity, recency, relevance, and completeness signals.",
    outputs: [
      "evidence-map.json",
      "gaps-report.json",
    ],
    metrics: {
      Matched: "94",
      Missing: "41",
      Pending: "13",
      "Match Rate": "63.5%",
    },
  },
  {
    id: "inspection-ready",
    label: "Inspection Ready",
    sublabel: "Readiness Score",
    status: "active",
    timestamp: "09:41:26",
    duration: "—",
    description:
      "The final compliance posture is being compiled from obligation coverage, evidence completeness, workflow status, and risk exposure.",
    outputs: [
      "readiness-report.json",
      "inspection-pack.zip",
    ],
    metrics: {
      Score: "72%",
      "Critical Gaps": "14",
      Target: "85%",
      Estimated: "~3 weeks to target",
    },
  },
];

const activities = [
  {
    timestamp: "09:41:26",
    message:
      "Inspection readiness score computed: 72%",
    type: "info",
  },
  {
    timestamp: "09:41:25",
    message:
      "Evidence matching completed — 41 gaps identified",
    type: "warning",
  },
  {
    timestamp: "09:41:23",
    message:
      "67 workflows generated for 148 obligations",
    type: "info",
  },
  {
    timestamp: "09:41:20",
    message:
      "148 obligations extracted — 94.2% confidence",
    type: "success",
  },
  {
    timestamp: "09:41:16",
    message:
      "532 clauses parsed and classified",
    type: "success",
  },
  {
    timestamp: "09:41:13",
    message:
      "1,847 semantic vectors generated",
    type: "success",
  },
  {
    timestamp: "09:41:11",
    message:
      "1,847 semantic chunks created",
    type: "success",
  },
  {
    timestamp: "09:41:06",
    message:
      "OCR complete — 96.4% confidence across 419 pages",
    type: "success",
  },
  {
    timestamp: "09:41:03",
    message:
      "PDF uploaded — 14.2 MB and 419 pages",
    type: "info",
  },
];

const readiness = 72;
const gaugeRadius = 64;
const gaugeCircumference = 2 * Math.PI * gaugeRadius;

function getStageIcon(status: StageStatus) {
  if (status === "complete") {
    return <CheckCircle2 size={15} />;
  }

  if (status === "active") {
    return <Loader2 size={15} className="animate-spin" />;
  }

  return <Clock3 size={15} />;
}

function getStageColor(status: StageStatus) {
  if (status === "complete") {
    return "#22c55e";
  }

  if (status === "active") {
    return "#38bdf8";
  }

  return "#475569";
}

function getStatusLabel(status: StageStatus) {
  if (status === "complete") {
    return "Complete";
  }

  if (status === "active") {
    return "In Progress";
  }

  return "Pending";
}

function getActivityColor(type: string) {
  if (type === "success") {
    return "#22c55e";
  }

  if (type === "warning") {
    return "#f59e0b";
  }

  return "#38bdf8";
}

export default function ComplianceTimelinePage() {
  const [activeStage, setActiveStage] = useState<Stage | null>(
    stages.find((stage) => stage.status === "active") || null,
  );

  const activeStageIndex = useMemo(() => {
    if (!activeStage) {
      return -1;
    }

    return stages.findIndex(
      (stage) => stage.id === activeStage.id,
    );
  }, [activeStage]);

  const selectPreviousStage = () => {
    if (activeStageIndex > 0) {
      setActiveStage(stages[activeStageIndex - 1]);
    }
  };

  const selectNextStage = () => {
    if (
      activeStageIndex >= 0 &&
      activeStageIndex < stages.length - 1
    ) {
      setActiveStage(stages[activeStageIndex + 1]);
    }
  };

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <p className="section-label">
              Governance chronology
            </p>

            <h1 className="page-title mt-4 flex items-center gap-2.5 !text-2xl">
              <History size={21} className="text-cyan-300" />
              Compliance Timeline
            </h1>

            <p className="page-subtitle">
              Trace the regulatory processing lifecycle from
              document intake to obligation extraction, workflow
              generation, evidence matching, and inspection
              readiness.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge label="Demo Dataset" />
              <Badge label="Pipeline Trace" />
              <Badge label="419 Pages" />
            </div>
          </div>

          <Card className="rounded-[28px] p-5">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <svg
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                >
                  <defs>
                    <linearGradient
                      id="readinessGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>

                  <circle
                    cx="75"
                    cy="75"
                    r={gaugeRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                  />

                  <motion.circle
                    cx="75"
                    cy="75"
                    r={gaugeRadius}
                    fill="none"
                    stroke="url(#readinessGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={gaugeCircumference}
                    initial={{
                      strokeDashoffset: gaugeCircumference,
                    }}
                    animate={{
                      strokeDashoffset:
                        gaugeCircumference -
                        (readiness / 100) *
                          gaugeCircumference,
                    }}
                    transition={{
                      duration: 1.4,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                    transform="rotate(-90 75 75)"
                  />

                  <text
                    x="75"
                    y="71"
                    textAnchor="middle"
                    fontSize="25"
                    fontWeight="800"
                    fill="#38bdf8"
                  >
                    {readiness}%
                  </text>

                  <text
                    x="75"
                    y="91"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="#94a3b8"
                  >
                    READINESS
                  </text>
                </svg>
              </div>

              <div className="min-w-0 flex-1 space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Inspection state
                </p>

                <p className="text-lg font-semibold text-white">
                  At risk
                </p>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-500">
                    Obligations covered
                  </span>
                  <span className="font-semibold text-emerald-400">
                    134 / 148
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-500">
                    Evidence complete
                  </span>
                  <span className="font-semibold text-amber-400">
                    94 / 148
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-500">
                    Critical gaps
                  </span>
                  <span className="font-semibold text-red-400">
                    14
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-500">
                    Target readiness
                  </span>
                  <span className="font-semibold text-zinc-400">
                    85%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden rounded-[28px] p-5 lg:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Replay view</p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Historical compliance playback
              </h2>

              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Select a processing stage to inspect its metrics and
                generated artifacts.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-right md:block">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Selected stage
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {activeStage?.label || "None"}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="relative flex min-w-[980px] items-start">
              <div className="absolute left-8 right-8 top-5 h-0.5 bg-cyan-500/10" />

              {stages.map((stage, index) => {
                const isActive = activeStage?.id === stage.id;
                const color = getStageColor(stage.status);

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() =>
                      setActiveStage(
                        isActive ? null : stage,
                      )
                    }
                    className="relative flex min-w-[108px] flex-1 flex-col items-center text-center"
                  >
                    {index > 0 &&
                    stage.status === "complete" ? (
                      <span
                        className="absolute right-1/2 top-[18px] h-1 w-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(34,197,94,0.25), rgba(34,197,94,0.7))",
                        }}
                      />
                    ) : null}

                    <motion.span
                      whileHover={{ scale: 1.12 }}
                      className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        color,
                        background: isActive
                          ? "rgba(56,189,248,0.15)"
                          : stage.status === "complete"
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(255,255,255,0.03)",
                        border: `2px solid ${
                          isActive ? "#38bdf8" : color
                        }`,
                        boxShadow: isActive
                          ? "0 0 16px rgba(56,189,248,0.3)"
                          : stage.status === "complete"
                            ? "0 0 12px rgba(34,197,94,0.15)"
                            : "none",
                      }}
                    >
                      {getStageIcon(stage.status)}
                    </motion.span>

                    <span
                      className="mt-2.5 max-w-[90px] text-[11px] font-bold leading-4"
                      style={{
                        color: isActive
                          ? "#38bdf8"
                          : stage.status === "complete"
                            ? "var(--c-text)"
                            : "var(--c-text-muted)",
                      }}
                    >
                      {stage.label}
                    </span>

                    <span className="mt-1 max-w-[90px] text-[9.5px] leading-3 text-zinc-500">
                      {stage.sublabel}
                    </span>

                    <span className="mt-1 font-mono text-[9px] text-zinc-600">
                      {stage.timestamp}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <AnimatePresence mode="wait">
          {activeStage ? (
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="rounded-[28px] p-5 lg:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2.5">
                      <h2 className="text-lg font-extrabold text-white">
                        {activeStage.label}
                      </h2>

                      <Badge
                        label={getStatusLabel(
                          activeStage.status,
                        )}
                      />

                      <span className="font-mono text-[10px] text-zinc-500">
                        {activeStage.timestamp} ·{" "}
                        {activeStage.duration}
                      </span>
                    </div>

                    <p className="max-w-4xl text-sm leading-7 text-zinc-300">
                      {activeStage.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-icon shrink-0"
                    aria-label="Close stage details"
                    onClick={() => setActiveStage(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500">
                      Metrics
                    </p>

                    <div className="space-y-2">
                      {Object.entries(activeStage.metrics).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2"
                          >
                            <span className="text-xs text-zinc-500">
                              {key}
                            </span>

                            <span className="text-right font-mono text-xs font-bold text-zinc-200">
                              {value}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500">
                      Output artifacts
                    </p>

                    <div className="space-y-2">
                      {activeStage.outputs.map((output) => (
                        <div
                          key={output}
                          className="flex items-center gap-2 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] px-3 py-2"
                        >
                          <FileText
                            size={12}
                            className="text-cyan-400"
                          />

                          <span className="font-mono text-xs text-cyan-300">
                            {output}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-between">
                  <button
                    type="button"
                    className="btn-ghost text-xs"
                    disabled={activeStageIndex <= 0}
                    onClick={selectPreviousStage}
                  >
                    ← Previous Stage
                  </button>

                  <button
                    type="button"
                    className="btn-ghost flex items-center gap-1 text-xs"
                    disabled={
                      activeStageIndex < 0 ||
                      activeStageIndex >= stages.length - 1
                    }
                    onClick={selectNextStage}
                  >
                    Next Stage
                    <ChevronRight size={13} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Card className="rounded-[28px] p-5 lg:p-6">
          <div className="mb-4 flex items-center gap-2">
            <ActivityIcon />
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">
              Pipeline Activity Log
            </p>
          </div>

          <div className="space-y-0">
            {activities.map((activity, index) => (
              <motion.div
                key={`${activity.timestamp}-${activity.message}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.035 }}
                className="flex items-start gap-3 border-b border-white/[0.03] py-2.5 last:border-0"
              >
                <span className="shrink-0 pt-0.5 font-mono text-[10px] text-zinc-600">
                  {activity.timestamp}
                </span>

                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background: getActivityColor(
                      activity.type,
                    ),
                  }}
                />

                <span className="text-sm leading-5 text-zinc-300">
                  {activity.message}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[28px] p-5">
          <div className="flex items-start gap-3">
            <Sparkles
              size={17}
              className="mt-0.5 text-violet-300"
            />

            <div>
              <p className="text-sm font-semibold text-white">
                Timeline interpretation
              </p>

              <p className="mt-1 text-sm leading-6 text-zinc-400">
                The pipeline completed ingestion, parsing,
                obligation extraction, workflow generation, and
                evidence matching. Inspection readiness remains
                active because evidence gaps and critical risks
                still require remediation.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function ActivityIcon() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/15 bg-cyan-500/10">
      <History size={14} className="text-cyan-300" />
    </span>
  );
}