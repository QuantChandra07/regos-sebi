// src/app/demo/workspace/dashboard/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getDemoAnalysis } from "@/data/demoAnalysis";
import type { DemoDocumentId } from "@/data/demoDocuments";

export default function DemoDashboardPage() {
  const searchParams = useSearchParams();
  const docId =
    (searchParams.get("doc") as DemoDocumentId | null) ?? "stock-brokers";
  const analysis = getDemoAnalysis(docId);

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[24px] p-5">
          <p className="text-xs text-zinc-500">Compliance Score</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {analysis.complianceScore}%
          </p>
        </Card>

        <Card className="rounded-[24px] p-5">
          <p className="text-xs text-zinc-500">Open Obligations</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {analysis.openObligations}
          </p>
        </Card>

        <Card className="rounded-[24px] p-5">
          <p className="text-xs text-zinc-500">Critical Risks</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {analysis.criticalRisks}
          </p>
        </Card>

        <Card className="rounded-[24px] p-5">
          <p className="text-xs text-zinc-500">Evidence Pending</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {analysis.evidencePending}
          </p>
        </Card>

        <Card className="rounded-[24px] p-5">
          <p className="text-xs text-zinc-500">Controls Generated</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {analysis.controlsGenerated}
          </p>
        </Card>

        <Card className="rounded-[24px] p-5">
          <p className="text-xs text-zinc-500">AI Confidence</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {analysis.aiConfidence}%
          </p>
        </Card>
      </div>
    </div>
  );
}