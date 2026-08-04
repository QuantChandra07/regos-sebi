"use client";

import { AlertCircle, Settings2, SlidersHorizontal } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { EmptyBlock } from "../../components/ui/StateBlocks";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Workspace administration</p>
          <h1 className="page-title mt-4">Settings</h1>
          <p className="page-subtitle">
            Manage workspace-level preferences and approved platform integrations from a governed
            administration surface.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
              <Settings2 size={18} className="text-cyan-300" />
            </div>
            <div>
              <p className="section-label">Access status</p>
              <p className="mt-2 text-lg font-semibold text-white">Managed centrally</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Configuration is available when workspace administration is enabled.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="rounded-[26px] p-6 sm:p-8">
        <div className="mx-auto max-w-xl py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <SlidersHorizontal size={23} className="text-cyan-300" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">Settings are not available</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            This workspace does not currently expose a settings service. No configuration has been
            changed.
          </p>
          <div className="mt-6">
            <EmptyBlock label="No editable workspace preferences are available." />
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-500">
            <AlertCircle size={13} /> Contact the workspace administrator for access.
          </p>
        </div>
      </Card>
    </div>
  );
}
