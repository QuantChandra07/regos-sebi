// src/app/demo/docs/[id]/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { getDemoDocument, type DemoDocumentId } from "@/data/demoDocuments";
import { getDemoAnalysis } from "@/data/demoAnalysis";

type Props = {
  params: { id: DemoDocumentId };
};

export default function DemoDocDetailPage({ params }: Props) {
  const router = useRouter();
  const doc = getDemoDocument(params.id);

  if (!doc) {
    return (
      <div className="p-6 text-sm text-red-400">
        Document not found for id: {params.id}
      </div>
    );
  }

  const analysis = getDemoAnalysis(doc.id);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white">Document Selected</h2>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-2">
        <p className="text-sm font-medium text-white">{doc.title}</p>
        <p className="text-xs text-zinc-400">
          {doc.pages} Pages · {doc.regulator} Circular · Issued: {doc.issueDate}
        </p>

        <div className="mt-2 grid gap-3 md:grid-cols-2 text-xs text-zinc-300">
          <div>
            <p className="font-semibold text-zinc-200">Applicable To</p>
            <ul className="mt-1 space-y-1">
              {doc.entityTypes.map((e) => (
                <li key={e}>✓ {e}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-zinc-200">Expected Controls</p>
            <ul className="mt-1 space-y-1">
              {doc.expectedControls.map((c) => (
                <li key={c}>✓ {c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-300">
          <span>Estimated Clauses: {analysis.clausesIdentified}+</span>
          <span>Estimated Obligations: {analysis.obligations}+</span>
          <span>Estimated Processing Time: ~18 seconds</span>
        </div>
      </div>

      <button
        className="rounded-xl bg-emerald-500 text-xs font-medium text-black px-4 py-2"
        onClick={() => router.push(`/demo/processing/${doc.id}`)}
      >
        Analyze Document
      </button>
    </div>
  );
}