"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Network,
  Search,
  Sparkles,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

type RiskCoverage = "High" | "Medium" | "Low";

type RegulatoryDocument = {
  id: string;
  title: string;
  circular: string;
  date: string;
  pages: number;
  clauses: number;
  obligations: number;
  riskCoverage: RiskCoverage;
  complianceScore: number;
  summary: string;
  tags: string[];
};

const documents: RegulatoryDocument[] = [
  {
    id: "doc-stock-brokers",
    title: "Master Circular – Stock Brokers",
    circular: "SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/89",
    date: "2024-08-09",
    pages: 419,
    clauses: 532,
    obligations: 148,
    riskCoverage: "High",
    complianceScore: 92,
    summary:
      "Comprehensive regulatory framework governing stock broker operations, client protection, AML/KYC, cybersecurity, and risk management requirements.",
    tags: [
      "AML/KYC",
      "Cyber Security",
      "Client Protection",
      "Risk Management",
    ],
  },
  {
    id: "doc-investment-advisers",
    title: "Master Circular – Investment Advisers",
    circular: "SEBI/HO/IFC/IFC-RAC/P/CIR/2024/66",
    date: "2024-07-18",
    pages: 99,
    clauses: 181,
    obligations: 49,
    riskCoverage: "Medium",
    complianceScore: 88,
    summary:
      "Regulatory obligations for SEBI-registered investment advisers covering fee structures, client suitability, disclosures, registration, and conflict-of-interest controls.",
    tags: [
      "Fee Disclosure",
      "Client Suitability",
      "Registration",
      "Conflicts",
    ],
  },
  {
    id: "doc-investor-charter",
    title: "Investor Charter – Stock Brokers",
    circular: "SEBI/HO/OIAE/OIAE-RAC/P/CIR/2024/33",
    date: "2024-06-15",
    pages: 11,
    clauses: 37,
    obligations: 12,
    riskCoverage: "Low",
    complianceScore: 91,
    summary:
      "Defines investor rights, responsibilities, grievance escalation mechanisms, transparency requirements, and investor-facing disclosures.",
    tags: [
      "Grievance Redressal",
      "Investor Rights",
      "Transparency",
    ],
  },
];

const datasetStats = [
  ["Total Documents", "03"],
  ["Total Clauses", "750"],
  ["Total Obligations", "209"],
  ["Knowledge Graph Nodes", "1,842"],
  ["Typical Processing", "18 sec"],
];

export default function DocumentLibraryPage() {
  const [selectedId, setSelectedId] = useState(
    documents[0].id,
  );
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<
    "All" | RiskCoverage
  >("All");

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesSearch =
        !normalizedSearch ||
        document.title.toLowerCase().includes(normalizedSearch) ||
        document.circular.toLowerCase().includes(normalizedSearch) ||
        document.tags.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch),
        );

      const matchesRisk =
        riskFilter === "All" ||
        document.riskCoverage === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [riskFilter, search]);

  const selectedDocument =
    documents.find((document) => document.id === selectedId) ||
    filteredDocuments[0] ||
    documents[0];

  const openDocumentDetails = () => {
    const index = documents.findIndex(
      (document) => document.id === selectedDocument.id,
    );

    window.location.href = `/document-details?doc=${Math.max(
      index,
      0,
    )}`;
  };

  return (
    <Shell
      mode="demo"
      docName={selectedDocument.title}
      docPages={selectedDocument.pages}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                className="btn-ghost px-2 text-xs"
              >
                <ArrowLeft size={13} />
                Dashboard
              </button>

              <span className="text-zinc-700">/</span>

              <Badge label="DOCUMENT REPOSITORY" />
            </div>

            <h1 className="page-title">
              Available SEBI Documents
            </h1>

            <p className="page-subtitle max-w-3xl">
              Browse preprocessed circulars and open their connected
              clauses, obligations, risk assessments, workflows, and
              evidence mappings.
            </p>
          </div>

          <Card className="rounded-[28px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Selected document</p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedDocument.title}
                </p>

                <p className="mt-1 font-mono text-[10px] text-zinc-500">
                  {selectedDocument.circular}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                <FileText
                  size={18}
                  className="text-cyan-300"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <MiniMetric
                label="Pages"
                value={selectedDocument.pages}
              />
              <MiniMetric
                label="Clauses"
                value={selectedDocument.clauses}
              />
              <MiniMetric
                label="Obligations"
                value={selectedDocument.obligations}
              />
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {datasetStats.map(([label, value]) => (
            <Card
              key={label}
              className="rounded-[22px] p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                {label}
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {value}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <Card className="rounded-[28px] p-4 lg:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search documents, circular numbers, or tags..."
                    className="input-glass w-full pl-9 text-sm"
                  />
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-zinc-500">
                    Risk:
                  </span>

                  {(["All", "High", "Medium", "Low"] as const).map(
                    (filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setRiskFilter(filter)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                          riskFilter === filter
                            ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
                            : "border-white/10 bg-white/[0.03] text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {filter}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {filteredDocuments.length === 0 ? (
                <Card className="rounded-[28px] p-10 text-center">
                  <Search
                    size={24}
                    className="mx-auto text-zinc-600"
                  />

                  <p className="mt-4 text-sm font-semibold text-white">
                    No documents found
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Try a different search term or risk filter.
                  </p>
                </Card>
              ) : (
                filteredDocuments.map((document) => {
                  const isSelected =
                    document.id === selectedDocument.id;

                  return (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      selected={isSelected}
                      onSelect={() =>
                        setSelectedId(document.id)
                      }
                      onOpen={openDocumentDetails}
                    />
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="rounded-[28px] p-5">
              <div className="mb-5 flex items-center gap-2">
                <BarChart3
                  size={16}
                  className="text-cyan-300"
                />

                <p className="text-sm font-semibold text-white">
                  Dataset statistics
                </p>
              </div>

              <div className="space-y-3">
                {datasetStats.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-xs text-zinc-500">
                      {label}
                    </span>

                    <span className="font-mono text-xs font-semibold text-zinc-200">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.05] p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  AI engine
                </p>

                <p className="mt-2 text-sm font-semibold text-cyan-300">
                  GPT-4o · Custom RAG
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Vector database · Knowledge graph · Compliance
                  digital twin
                </p>
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
                    Selected workspace
                  </p>

                  <p className="mt-1 text-xs leading-6 text-zinc-400">
                    Open the selected circular to inspect its
                    page-mapped clauses, obligations, risks, and
                    generated workflows.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openDocumentDetails}
                className="btn-primary mt-4 w-full justify-center text-xs"
              >
                Open selected document
                <ArrowRight size={13} />
              </button>
            </Card>

            <Card className="rounded-[28px] p-5">
              <div className="flex items-start gap-3">
                <Network
                  size={17}
                  className="mt-0.5 text-cyan-300"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Connected intelligence
                  </p>

                  <p className="mt-1 text-xs leading-6 text-zinc-500">
                    Every processed document is linked to the
                    compliance graph and searchable through the AI
                    Copilot.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge label="Clauses" />
                <Badge label="Obligations" />
                <Badge label="Risks" />
                <Badge label="Evidence" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function DocumentCard({
  document,
  selected,
  onSelect,
  onOpen,
}: {
  document: RegulatoryDocument;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer rounded-[28px] p-5 transition-all duration-200 lg:p-6 ${
        selected
          ? "border-cyan-400/30 bg-cyan-500/[0.05] shadow-[0_0_28px_rgba(56,189,248,0.08)]"
          : "hover:border-white/20 hover:bg-white/[0.045]"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-cyan-500/20 bg-cyan-500/10">
          <FileText
            size={22}
            className="text-cyan-300"
          />

          <span className="text-[8px] font-bold tracking-wide text-cyan-300">
            PDF
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                {document.title}
              </h2>

              <p className="mt-1 break-all font-mono text-[10px] text-zinc-500">
                {document.circular}
              </p>
            </div>

            <Badge
              label={`${document.riskCoverage.toUpperCase()} RISK`}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <InlineStat
              label="Pages"
              value={document.pages}
            />
            <InlineStat
              label="Clauses"
              value={document.clauses}
            />
            <InlineStat
              label="Obligations"
              value={document.obligations}
            />

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">
                Compliance
              </span>

              <span className="text-base font-bold text-emerald-400">
                {document.complianceScore}%
              </span>
            </div>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
              style={{
                width: `${document.complianceScore}%`,
              }}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            {document.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect();
                }}
                className="btn-secondary text-xs"
              >
                {selected ? (
                  <>
                    <CheckCircle2 size={13} />
                    Selected
                  </>
                ) : (
                  "Select"
                )}
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen();
                }}
                className="btn-primary text-xs"
              >
                Open
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.04] p-2.5 text-center">
      <p className="text-sm font-bold text-cyan-300">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}

function InlineStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-base font-bold text-cyan-300">
        {value.toLocaleString()}
      </span>

      <span className="text-[11px] font-semibold text-zinc-500">
        {label}
      </span>
    </div>
  );
}