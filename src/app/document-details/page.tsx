"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  GitBranch,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

type RegulatoryDocument = {
  title: string;
  circular: string;
  pages: number;
  type: string;
  date: string;
  clauses: number;
  obligations: number;
  processingTime: string;
  applicableTo: string[];
  controls: string[];
  description: string;
};

const documents: RegulatoryDocument[] = [
  {
    title: "Master Circular – Stock Brokers",
    circular: "SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/89",
    pages: 419,
    type: "SEBI Master Circular",
    date: "2024-08-09",
    clauses: 532,
    obligations: 148,
    processingTime: "18 seconds",
    applicableTo: [
      "Stock Brokers",
      "Trading Members",
      "Clearing Members",
      "Depository Participants",
    ],
    controls: [
      "Cyber Security",
      "Client Protection",
      "AML/KYC",
      "Risk Management",
      "Grievance Redressal",
    ],
    description:
      "A comprehensive master circular consolidating SEBI requirements applicable to stock brokers, including operational controls, client protection, AML/KYC, cybersecurity, grievance management, and reporting obligations.",
  },
  {
    title: "Master Circular – Investment Advisers",
    circular: "SEBI/HO/IFC/IFC-RAC/P/CIR/2024/66",
    pages: 99,
    type: "SEBI Master Circular",
    date: "2024-07-18",
    clauses: 181,
    obligations: 49,
    processingTime: "12 seconds",
    applicableTo: [
      "Investment Advisers",
      "Research Analysts",
      "Portfolio Managers",
    ],
    controls: [
      "Fee Disclosure",
      "Client Suitability",
      "Conflict of Interest",
      "Registration Norms",
    ],
    description:
      "Regulatory requirements for SEBI-registered investment advisers covering advisory practices, client onboarding, fee structures, conflict management, and compliance reporting.",
  },
  {
    title: "Investor Charter – Stock Brokers",
    circular: "SEBI/HO/OIAE/OIAE-RAC/P/CIR/2024/33",
    pages: 11,
    type: "SEBI Circular",
    date: "2024-06-15",
    clauses: 37,
    obligations: 12,
    processingTime: "6 seconds",
    applicableTo: [
      "Stock Brokers",
      "Investors",
    ],
    controls: [
      "Grievance Redressal",
      "Investor Rights",
      "Transparency",
    ],
    description:
      "Defines investor rights and responsibilities when dealing with SEBI-registered stock brokers, including grievance escalation, investor communication, and transparency obligations.",
  },
];

const clausePreview = [
  {
    id: "Clause 14.2",
    title: "Enhanced Customer Due Diligence",
    category: "AML/KYC",
    risk: "Critical",
    summary:
      "Enhanced due diligence is required for high-risk clients, politically exposed persons, non-resident clients, and complex ownership structures.",
  },
  {
    id: "Clause 19.7",
    title: "Suspicious Transaction Reporting",
    category: "AML/KYC",
    risk: "Critical",
    summary:
      "Suspicious transactions must be escalated, reviewed, documented, and reported through the prescribed reporting process.",
  },
  {
    id: "Clause 47.3",
    title: "Annual Cybersecurity Audit",
    category: "Cyber Security",
    risk: "High",
    summary:
      "Critical systems must be covered by an annual cybersecurity audit with remediation tracking and evidence retention.",
  },
  {
    id: "Clause 61.2",
    title: "Privileged Access Management",
    category: "Cyber Security",
    risk: "High",
    summary:
      "Privileged access must use stronger authentication, controlled access, session monitoring, and periodic review.",
  },
];

export default function DocumentDetailsPage() {
  const [documentIndex, setDocumentIndex] = useState(0);

  useEffect(() => {
    const queryIndex = Number(
      new URLSearchParams(window.location.search).get("doc"),
    );

    if (
      Number.isInteger(queryIndex) &&
      queryIndex >= 0 &&
      queryIndex < documents.length
    ) {
      setDocumentIndex(queryIndex);
    }
  }, []);

  const document = documents[documentIndex];

  const nextDocument = () => {
    const nextIndex =
      documentIndex >= documents.length - 1
        ? 0
        : documentIndex + 1;

    setDocumentIndex(nextIndex);
    window.history.replaceState(
      null,
      "",
      `/document-details?doc=${nextIndex}`,
    );
  };

  const previousDocument = () => {
    const previousIndex =
      documentIndex <= 0
        ? documents.length - 1
        : documentIndex - 1;

    setDocumentIndex(previousIndex);
    window.history.replaceState(
      null,
      "",
      `/document-details?doc=${previousIndex}`,
    );
  };

  const openLibrary = () => {
    window.location.href = "/document-library";
  };

  return (
    <Shell
      mode="demo"
      docName={document.title}
      docPages={document.pages}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openLibrary}
              className="btn-ghost text-xs"
            >
              <ArrowLeft size={13} />
              Document Library
            </button>

            <span className="text-zinc-700">/</span>

            <Badge label="DOCUMENT DETAILS" />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={previousDocument}
              className="btn-secondary text-xs"
            >
              <ArrowLeft size={13} />
              Previous
            </button>

            <button
              type="button"
              onClick={nextDocument}
              className="btn-secondary text-xs"
            >
              Next
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="rounded-[28px] p-6 lg:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                <FileSearch
                  size={25}
                  className="text-cyan-300"
                />

                <span className="text-[8px] font-bold tracking-wide text-cyan-300">
                  PDF
                </span>
              </div>

              <div className="min-w-0">
                <p className="section-label">
                  Selected document · {documentIndex + 1} of{" "}
                  {documents.length}
                </p>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
                  {document.title}
                </h1>

                <p className="mt-2 break-all font-mono text-xs text-zinc-500">
                  {document.circular}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
                  <span>{document.pages} pages</span>
                  <span>{document.type}</span>
                  <span>Issued {document.date}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge label="PROCESSED" />
              <Badge label="PAGE INDEXED" />
              <Badge label="RAG READY" />
              <Badge label="GRAPH LINKED" />
            </div>
          </Card>

          <Card className="rounded-[28px] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-label">Processing state</p>

                <p className="mt-2 text-lg font-semibold text-emerald-300">
                  Analysis complete
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  The document is available across the compliance
                  intelligence modules.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-500/10">
                <CheckCircle2
                  size={19}
                  className="text-emerald-400"
                />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <StateRow
                label="OCR and extraction"
                value="Complete"
              />
              <StateRow
                label="Clause mapping"
                value="Complete"
              />
              <StateRow
                label="Obligation extraction"
                value="Complete"
              />
              <StateRow
                label="Risk and workflow graph"
                value="Complete"
              />
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Extracted Clauses"
            value={document.clauses.toLocaleString()}
            icon={<FileSearch size={17} />}
          />

          <StatCard
            label="Extracted Obligations"
            value={document.obligations.toLocaleString()}
            icon={<CheckCircle2 size={17} />}
          />

          <StatCard
            label="Processing Time"
            value={document.processingTime}
            icon={<Sparkles size={17} />}
          />
        </div>

        <Card className="rounded-[28px] p-5 lg:p-6">
          <div className="flex items-center gap-2">
            <Sparkles
              size={17}
              className="text-violet-300"
            />

            <div>
              <p className="text-sm font-semibold text-white">
                Document intelligence summary
              </p>

              <p className="text-xs text-zinc-500">
                Explainable processing context
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-zinc-300">
            {document.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {document.controls.map((control) => (
              <span
                key={control}
                className="rounded-full border border-cyan-500/15 bg-cyan-500/[0.05] px-3 py-1.5 text-xs text-cyan-300"
              >
                {control}
              </span>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card className="rounded-[28px] p-5 lg:p-6">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck
                size={17}
                className="text-cyan-300"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Applicable entities
                </p>

                <p className="text-xs text-zinc-500">
                  Entity types mapped during ingestion
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {document.applicableTo.map((entity) => (
                <div
                  key={entity}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                  <span className="text-sm text-zinc-300">
                    {entity}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[28px] p-5 lg:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Network
                size={17}
                className="text-violet-300"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Connected intelligence
                </p>

                <p className="text-xs text-zinc-500">
                  Available downstream modules
                </p>
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <LinkedModule
                label="Clause Intelligence"
                icon={<FileSearch size={14} />}
                href="/clause-intelligence"
              />

              <LinkedModule
                label="Obligations"
                icon={<CheckCircle2 size={14} />}
                href="/obligations"
              />

              <LinkedModule
                label="Risk Intelligence"
                icon={<ShieldCheck size={14} />}
                href="/risk-intelligence"
              />

              <LinkedModule
                label="Workflow Engine"
                icon={<WorkflowIcon />}
                href="/workflow-engine"
              />

              <LinkedModule
                label="Evidence Vault"
                icon={<GitBranch size={14} />}
                href="/evidence-vault"
              />

              <LinkedModule
                label="Compliance Timeline"
                icon={<Network size={14} />}
                href="/compliance-timeline"
              />
            </div>
          </Card>
        </div>

        <Card className="rounded-[28px] p-5 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-label">Clause preview</p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                High-priority regulatory clauses
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Sample clause intelligence linked to this document.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/clause-intelligence";
              }}
              className="btn-secondary text-xs"
            >
              View all clauses
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {clausePreview.map((clause) => (
              <ClausePreview
                key={clause.id}
                clause={clause}
              />
            ))}
          </div>
        </Card>

        <Card className="rounded-[28px] border-violet-500/15 bg-violet-500/[0.04] p-5 lg:p-6">
          <div className="flex items-start gap-3">
            <Sparkles
              size={18}
              className="mt-0.5 text-violet-300"
            />

            <div>
              <p className="text-sm font-semibold text-white">
                AI analysis available
              </p>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-zinc-400">
                Ask the AI Copilot to summarize this circular,
                identify applicable obligations, explain a clause,
                find evidence gaps, or generate a compliance workflow.
              </p>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/ai-copilot";
                }}
                className="btn-primary mt-4 text-xs"
              >
                Open AI Copilot
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function StateRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5">
      <span className="text-xs text-zinc-500">{label}</span>

      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
        <CheckCircle2 size={12} />
        {value}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-[24px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10 text-cyan-300">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function LinkedModule({
  label,
  icon,
  href,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = href;
      }}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3 text-left transition-colors hover:border-cyan-500/25 hover:bg-cyan-500/[0.05]"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
        {icon}
      </span>

      <span className="flex-1 text-xs font-medium text-zinc-300">
        {label}
      </span>

      <ArrowRight
        size={13}
        className="text-zinc-600"
      />
    </button>
  );
}

function ClausePreview({
  clause,
}: {
  clause: {
    id: string;
    title: string;
    category: string;
    risk: string;
    summary: string;
  };
}) {
  const riskColor =
    clause.risk === "Critical"
      ? "text-red-300"
      : "text-amber-300";

  const riskIcon =
    clause.risk === "Critical" ? (
      <AlertCircle size={12} />
    ) : (
      <ShieldCheck size={12} />
    );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-cyan-500/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-cyan-300">
            {clause.id}
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {clause.title}
          </p>
        </div>

        <span
          className={`flex items-center gap-1 text-[10px] font-semibold uppercase ${riskColor}`}
        >
          {riskIcon}
          {clause.risk}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge label={clause.category} />
      </div>

      <p className="mt-3 text-xs leading-6 text-zinc-400">
        {clause.summary}
      </p>
    </div>
  );
}

function WorkflowIcon() {
  return <Workflow size={14} />;
}