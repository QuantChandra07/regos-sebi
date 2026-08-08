// src/app/demo/workspace/layout.tsx

"use client";

import Shell from "@/components/layout/Shell";
import Header from "@/components/layout/Header";
import { usePathname, useSearchParams } from "next/navigation";
import { getDemoDocument, type DemoDocumentId } from "@/data/demoDocuments";

export default function DemoWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const docId =
    (searchParams.get("doc") as DemoDocumentId | null) ?? "stock-brokers";

  const doc = getDemoDocument(docId);

  return (
    <Shell>
      <Header
        rightSlot={
          <div className="flex items-center gap-2 text-xs text-emerald-300">
            <span className="rounded-full bg-emerald-500/20 px-2 py-1">
              Demo Mode · Preprocessed SEBI Dataset
            </span>
            {doc && (
              <span className="text-zinc-400 hidden md:inline">
                Document: {doc.title}
              </span>
            )}
          </div>
        }
      />
      <div className="content-scroll">
        <div className="page-container">{children}</div>
      </div>
    </Shell>
  );
}