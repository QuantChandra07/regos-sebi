"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  GitBranch,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Upload,
  Workflow,
  XCircle,
  Zap,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

type UploadStatus = "idle" | "selected" | "invalid";

type PipelineStage = {
  label: string;
  description: string;
  icon: React.ReactNode;
};

const pipelineStages: PipelineStage[] = [
  {
    label: "OCR Processing",
    description:
      "Extract text from scanned pages using OCR and PDF text-layer detection.",
    icon: <FileText size={15} />,
  },
  {
    label: "Text Extraction",
    description:
      "Parse structured sections, headings, page numbers, and body text.",
    icon: <Layers3 size={15} />,
  },
  {
    label: "Semantic Chunking",
    description:
      "Split regulatory text into overlapping semantic chunks with clause awareness.",
    icon: <Zap size={15} />,
  },
  {
    label: "Vector Embeddings",
    description:
      "Generate embeddings for semantic retrieval and grounded RAG responses.",
    icon: <Brain size={15} />,
  },
  {
    label: "Clause Detection",
    description:
      "Identify regulatory clauses using clause numbering and semantic classification.",
    icon: <Eye size={15} />,
  },
  {
    label: "Obligation Extraction",
    description:
      "Extract actors, actions, deadlines, frequencies, and evidence requirements.",
    icon: <CheckCircle2 size={15} />,
  },
  {
    label: "Risk Analysis",
    description:
      "Score each obligation by regulatory impact, likelihood, and operational exposure.",
    icon: <ShieldCheck size={15} />,
  },
  {
    label: "Knowledge Graph",
    description:
      "Build the Circular → Clause → Obligation → Risk → Evidence relationship graph.",
    icon: <Network size={15} />,
  },
  {
    label: "Workflow Generation",
    description:
      "Generate compliance tasks and assign suggested owners by department.",
    icon: <Workflow size={15} />,
  },
];

const recentDocuments = [
  {
    name: "Master Circular – Stock Brokers",
    pages: 419,
    uploadedAt: "05 Dec 2024",
    status: "Processed",
  },
  {
    name: "Master Circular – Investment Advisers",
    pages: 99,
    uploadedAt: "03 Dec 2024",
    status: "Processed",
  },
  {
    name: "Investor Charter – Stock Brokers",
    pages: 11,
    uploadedAt: "01 Dec 2024",
    status: "Processed",
  },
];

function getStatusBadge(status: string) {
  if (status === "Processed") {
    return "PROCESSED";
  }

  if (status === "Processing") {
    return "PROCESSING";
  }

  return "FAILED";
}

export default function LiveUploadPage() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setStatus("invalid");
      setFileName(file.name);
      setFileSize("");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setStatus("invalid");
      setFileName(file.name);
      setFileSize("File exceeds the 100 MB limit");
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setStatus("selected");
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      acceptFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      acceptFile(file);
    }
  };

  const clearFile = () => {
    setStatus("idle");
    setFileName("");
    setFileSize("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const beginProcessing = () => {
    if (status !== "selected") {
      return;
    }

    // Replace this with your upload API call.
    // Example:
    // await uploadCircular(file);
    window.location.href = "/processing";
  };

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <div className="mb-4 flex items-center gap-2">
              <Badge label="LIVE INGESTION" />
              <span className="text-xs text-zinc-500">
                Regulatory document pipeline
              </span>
            </div>

            <h1 className="page-title">
              Upload Regulatory PDF
            </h1>

            <p className="page-subtitle max-w-3xl">
              Upload a SEBI circular, master circular, act, guideline,
              or notification to start the explainable compliance
              processing pipeline.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge label="PDF Only" />
              <Badge label="Maximum 100 MB" />
              <Badge label="OCR Fallback Enabled" />
              <Badge label="Page-Level Indexing" />
            </div>
          </div>

          <Card className="rounded-[28px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">
                  Pipeline state
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  RAG-ready ingestion
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Every document passes through extraction,
                  chunking, embedding, and regulatory intelligence
                  stages.
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                <BarChart3
                  size={18}
                  className="text-cyan-300"
                />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <PipelineStat
                label="Processing stages"
                value="09"
              />
              <PipelineStat
                label="Expected outputs"
                value="12+"
              />
              <PipelineStat
                label="Knowledge graph"
                value="Enabled"
              />
              <PipelineStat
                label="Citation tracking"
                value="Enabled"
              />
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <Card className="rounded-[28px] p-5 lg:p-7">
              <div className="mb-5">
                <p className="section-label">
                  Document intake
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  Start a new compliance analysis
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Drag and drop a regulatory PDF or browse your
                  local files.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (status === "idle" || status === "invalid") {
                    fileInputRef.current?.click();
                  }
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative overflow-hidden rounded-[24px] border-2 border-dashed p-8 text-center transition-all duration-300 lg:p-14 ${
                  isDragging
                    ? "border-emerald-400/60 bg-emerald-500/[0.08]"
                    : status === "selected"
                      ? "border-emerald-400/40 bg-emerald-500/[0.05]"
                      : status === "invalid"
                        ? "border-red-400/40 bg-red-500/[0.05]"
                        : "border-cyan-400/20 bg-white/[0.025] hover:border-cyan-400/40 hover:bg-cyan-500/[0.04]"
                }`}
              >
                <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-cyan-400/[0.06] blur-3xl" />

                {status === "selected" ? (
                  <div className="relative">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-emerald-500/15 shadow-[0_0_32px_rgba(34,197,94,0.25)]">
                      <CheckCircle2
                        size={30}
                        className="text-emerald-400"
                      />
                    </div>

                    <p className="mt-5 text-lg font-semibold text-emerald-300">
                      File ready for processing
                    </p>

                    <p className="mx-auto mt-2 max-w-md truncate text-sm text-zinc-300">
                      {fileName}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {fileSize}
                    </p>

                    <div className="mt-5 flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearFile();
                        }}
                        className="btn-ghost text-xs"
                      >
                        <XCircle size={13} />
                        Remove
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          beginProcessing();
                        }}
                        className="btn-primary text-xs"
                      >
                        <Sparkles size={13} />
                        Start Analysis
                      </button>
                    </div>
                  </div>
                ) : status === "invalid" ? (
                  <div className="relative">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-400/40 bg-red-500/10">
                      <XCircle
                        size={30}
                        className="text-red-400"
                      />
                    </div>

                    <p className="mt-5 text-lg font-semibold text-red-300">
                      File cannot be processed
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      {fileSize ||
                        "Please select a valid PDF document."}
                    </p>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearFile();
                        fileInputRef.current?.click();
                      }}
                      className="btn-secondary mt-5 text-xs"
                    >
                      Choose another file
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10">
                      <Upload
                        size={28}
                        className="text-cyan-300"
                      />
                    </div>

                    <p className="mt-5 text-lg font-semibold text-white">
                      {isDragging
                        ? "Drop document to begin"
                        : "Drag and drop a SEBI PDF here"}
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      or{" "}
                      <span className="font-semibold text-cyan-300">
                        browse files
                      </span>{" "}
                      from your computer
                    </p>

                    <p className="mt-5 text-xs text-zinc-500">
                      Supported format: PDF · Maximum size: 100 MB
                    </p>

                    <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-lg border border-cyan-500/15 bg-cyan-500/[0.05] px-3 py-2 text-xs text-zinc-400">
                      <Sparkles
                        size={12}
                        className="text-cyan-300"
                      />
                      OCR fallback is available for scanned documents
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <InfoTile
                  title="Secure intake"
                  body="Files are validated before processing."
                />
                <InfoTile
                  title="Explainable AI"
                  body="Outputs remain linked to source pages."
                />
                <InfoTile
                  title="Background ready"
                  body="Large files can be processed asynchronously."
                />
              </div>
            </Card>

            <Card className="rounded-[28px] p-5 lg:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Workflow
                  size={16}
                  className="text-cyan-300"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Processing pipeline
                  </p>

                  <p className="text-xs text-zinc-500">
                    Ordered stages executed after upload
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {pipelineStages.map((stage, index) => (
                  <div
                    key={stage.label}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10 text-cyan-300">
                      {stage.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="text-sm font-semibold text-zinc-200">
                          {stage.label}
                        </p>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="rounded-[28px] p-5">
              <div className="mb-5 flex items-center gap-2">
                <Clock3
                  size={16}
                  className="text-zinc-400"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Recent documents
                  </p>

                  <p className="text-xs text-zinc-500">
                    Previously processed circulars
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {recentDocuments.map((document) => (
                  <div
                    key={document.name}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10">
                      <FileText
                        size={17}
                        className="text-cyan-300"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-200">
                        {document.name}
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        {document.pages} pages · Uploaded{" "}
                        {document.uploadedAt}
                      </p>
                    </div>

                    <Badge label={getStatusBadge(document.status)} />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/document-library";
                }}
                className="btn-secondary mt-4 w-full justify-center text-xs"
              >
                Open document library
              </button>
            </Card>

            <Card className="rounded-[28px] p-5">
              <div className="flex items-start gap-3">
                <GitBranch
                  size={17}
                  className="mt-0.5 text-violet-300"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Output structure
                  </p>

                  <p className="mt-1 text-xs leading-6 text-zinc-400">
                    The uploaded circular becomes a connected
                    compliance record.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  "Circular metadata",
                  "Page-mapped text chunks",
                  "Clauses and obligations",
                  "Risk scores and explanations",
                  "Workflows and evidence links",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 font-mono text-[9px] text-cyan-300">
                      {index + 1}
                    </span>

                    <span className="text-xs text-zinc-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] border-violet-500/15 bg-violet-500/[0.04] p-5">
              <div className="flex items-start gap-3">
                <Sparkles
                  size={17}
                  className="mt-0.5 text-violet-300"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Explainability first
                  </p>

                  <p className="mt-1 text-xs leading-6 text-zinc-400">
                    Every extracted obligation should remain connected
                    to its source circular, clause, page range, and
                    supporting evidence.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function PipelineStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="font-mono text-xs font-semibold text-cyan-300">
        {value}
      </span>
    </div>
  );
}

function InfoTile({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
      <p className="text-xs font-semibold text-zinc-200">
        {title}
      </p>

      <p className="mt-1 text-[11px] leading-5 text-zinc-500">
        {body}
      </p>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}