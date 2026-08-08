// src/app/demo/summary/[id]/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDemoAnalysis } from "@/data/demoAnalysis";
import { type DemoDocumentId } from "@/data/demoDocuments";

type Props = { params: { id: DemoDocumentId } };

export default function DemoSummaryPage({ params }: Props) {
  const router = useRouter();
  const analysis = getDemoAnalysis(params.id);

  useEffect(() => {
    const t = setTimeout(
      () => router.push(`/demo/workspace/dashboard?doc=${params.id}`),
      4000,
    );
    return () => clearTimeout(t);
  }, [router, params.id]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white">
        AI Compliance Analysis Complete
      </h2>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-xs text-zinc-300 space-y-1">
        <p>✓ Pages Processed: {analysis.pagesProcessed}</p>
        <p>✓ Text Chunks: {analysis.textChunks}</p>
        <p>✓ Clauses Identified: {analysis.clausesIdentified}</p>
        <p>✓ Compliance Obligations: {analysis.obligations}</p>
        <p>✓ High Risk Clauses: {analysis.highRiskClauses}</p>
        <p>✓ Departments Affected: {analysis.departmentsAffected}</p>
        <p>✓ Workflows Generated: {analysis.workflowsGenerated}</p>
        <p>✓ Evidence Requirements: {analysis.evidenceRequirements}</p>
        <p>✓ Knowledge Graph Nodes: {analysis.knowledgeGraphNodes}</p>

        <p className="mt-2 font-semibold text-emerald-400">
          Inspection Readiness Score: {analysis.inspectionReadinessScore}%
        </p>
      </div>

      <button
        className="rounded-xl bg-emerald-500 text-xs font-medium text-black px-4 py-2"
        onClick={() =>
          router.push(`/demo/workspace/dashboard?doc=${params.id}`)
        }
      >
        Open Compliance Workspace
      </button>
    </div>
  );
}