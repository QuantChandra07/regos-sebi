// src/app/demo/docs/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { demoDocuments, type DemoDocumentId } from "@/data/demoDocuments";

export default function DemoDocsPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Available SEBI Documents
      </h2>
      <p className="text-xs text-zinc-400">
        Preprocessed regulatory dataset for Demo Mode.
      </p>

      <div className="space-y-3">
        {demoDocuments.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-white">{doc.title}</p>
              <p className="text-xs text-zinc-500">
                {doc.pages} Pages · Coverage: {doc.coverage} · Risk Areas ~{" "}
                {doc.riskAreasEstimate}
              </p>
            </div>
            <button
              className="rounded-xl bg-zinc-100 text-xs font-medium text-black px-3 py-1"
              onClick={() =>
                router.push(`/demo/docs/${doc.id as DemoDocumentId}`)
              }
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}