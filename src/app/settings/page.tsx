"use client";

import {
  AlertCircle,
  Bell,
  Database,
  KeyRound,
  LockKeyhole,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { EmptyBlock } from "../../components/ui/StateBlocks";

const plannedSettings = [
  {
    title: "Workspace preferences",
    description:
      "Manage timezone, date formats, compliance thresholds, and default dashboard behavior.",
    icon: <SlidersHorizontal size={16} />,
  },
  {
    title: "Notifications and alerts",
    description:
      "Configure deadline reminders, critical-risk notifications, evidence alerts, and escalation rules.",
    icon: <Bell size={16} />,
  },
  {
    title: "Integrations",
    description:
      "Connect approved storage, identity, notification, vector search, and regulatory data services.",
    icon: <Database size={16} />,
  },
  {
    title: "Security controls",
    description:
      "Manage authentication, session policies, API access, audit retention, and encryption settings.",
    icon: <KeyRound size={16} />,
  },
];

export default function SettingsPage() {
  return (
    <Shell
      mode="demo"
      docName="Workspace Settings"
      docPages={419}
    >
      <div className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <p className="section-label">
              Workspace administration
            </p>

            <h1 className="page-title mt-4">Settings</h1>

            <p className="page-subtitle max-w-3xl">
              Manage workspace-level preferences, notifications,
              integrations, and security controls from a governed
              administration surface.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge label="GOVERNED CONFIGURATION" />
              <Badge label="ADMIN ACCESS REQUIRED" />
            </div>
          </div>

          <Card className="rounded-[28px] p-5 lg:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                <Settings2
                  size={18}
                  className="text-cyan-300"
                />
              </div>

              <div>
                <p className="section-label">Access status</p>

                <p className="mt-2 text-lg font-semibold text-white">
                  Managed centrally
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Configuration becomes available when the workspace
                  administration service is enabled.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-500/15 bg-amber-500/[0.05] px-3 py-2.5 text-xs text-amber-200/80">
              <LockKeyhole size={13} />
              Restricted configuration surface
            </div>
          </Card>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plannedSettings.map((setting) => (
            <Card
              key={setting.title}
              className="rounded-[24px] p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-cyan-300">
                {setting.icon}
              </div>

              <p className="mt-4 text-sm font-semibold text-white">
                {setting.title}
              </p>

              <p className="mt-2 text-xs leading-6 text-zinc-500">
                {setting.description}
              </p>

              <span className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                Not configured
              </span>
            </Card>
          ))}
        </div>

        <Card className="rounded-[28px] p-6 sm:p-8">
          <div className="mx-auto max-w-xl py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <SlidersHorizontal
                size={23}
                className="text-cyan-300"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Settings service is not connected
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              This workspace does not currently expose editable
              configuration controls. No settings have been changed.
            </p>

            <div className="mt-6">
              <EmptyBlock label="No editable workspace preferences are available." />
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <AlertCircle size={13} />
              Contact the workspace administrator for access.
            </div>
          </div>
        </Card>

        <Card className="rounded-[28px] border-violet-500/15 bg-violet-500/[0.04] p-5 lg:p-6">
          <div className="flex items-start gap-3">
            <Settings2
              size={17}
              className="mt-0.5 text-violet-300"
            />

            <div>
              <p className="text-sm font-semibold text-white">
                Planned configuration model
              </p>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-zinc-400">
                When enabled, settings should be loaded from the
                workspace configuration API and protected through
                role-based access control. Changes should be validated,
                logged, and recorded in the administrative audit trail.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge label="RBAC" />
                <Badge label="AUDIT LOGGING" />
                <Badge label="INPUT VALIDATION" />
                <Badge label="APPROVAL FLOW" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}