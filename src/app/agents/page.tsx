"use client";

import { AlertCircle, Bot, Sparkles } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { EmptyBlock } from "../../components/ui/StateBlocks";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">AI operations</p>
          <h1 className="page-title mt-4">Agent Control</h1>
          <p className="page-subtitle">
            Govern the specialised AI capabilities that support regulatory research, obligation
            analysis, and evidence review across the compliance workspace.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex h-full items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
              <Sparkles size={18} className="text-violet-300" />
            </div>
            <div>
              <p className="section-label">Runtime status</p>
              <p className="mt-2 text-lg font-semibold text-white">Awaiting configuration</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Connect an approved agent runtime to begin governed execution.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="rounded-[26px] p-6 sm:p-8">
        <div className="mx-auto max-w-xl py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Bot size={23} className="text-cyan-300" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">No agent runtime connected</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Agent activity will appear here once a configured service is available to this
            workspace.
          </p>
          <div className="mt-6">
            <EmptyBlock label="Agent telemetry is not available yet." />
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-500">
            <AlertCircle size={13} /> Configuration is managed by your platform administrator.
          </p>
        </div>
      </Card>
    </div>
  );
}
