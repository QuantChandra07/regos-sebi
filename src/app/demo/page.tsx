"use client";

import { ArrowRight, FileText, Sparkles } from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export default function DemoPage() {
  const startDemo = () => {
    window.location.href = "/live-upload";
  };

  return (
    <Shell
      mode="demo"
      docName="Demo Workspace"
      docPages={419}
    >
      <div className="space-y-6">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-8">
          <div className="flex items-center gap-2">
            <Badge label="DEMO WORKSPACE" />
            <span className="text-xs text-zinc-500">
              Synthetic SEBI compliance environment
            </span>
          </div>

          <h1 className="page-title mt-5">
            Explore the RegOS-SEBI Compliance Twin
          </h1>

          <p className="page-subtitle max-w-3xl">
            Upload a regulatory document or explore the preprocessed
            compliance workspace containing clauses, obligations, risks,
            workflows, and evidence mappings.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startDemo}
              className="btn-primary"
            >
              Start with document upload
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="btn-secondary"
            >
              Open dashboard
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DemoCard
            icon={<FileText size={18} />}
            title="Document intelligence"
            body="Inspect circulars, clauses, page references, and extracted regulatory text."
          />

          <DemoCard
            icon={<Sparkles size={18} />}
            title="AI-assisted compliance"
            body="Ask grounded questions about obligations, risks, evidence, and workflows."
          />

          <DemoCard
            icon={<ArrowRight size={18} />}
            title="Operational execution"
            body="Move from obligations to owners, tasks, evidence, and inspection readiness."
          />
        </div>
      </div>
    </Shell>
  );
}

function DemoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="rounded-[24px] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10 text-cyan-300">
        {icon}
      </div>

      <p className="mt-4 text-sm font-semibold text-white">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {body}
      </p>
    </Card>
  );
}