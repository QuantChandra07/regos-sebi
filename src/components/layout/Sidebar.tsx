"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Home,
  Rss,
  BrainCircuit,
  FileCheck2,
  GitFork,
  KanbanSquare,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  History,
  Bot,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Layers3,
  Sparkles,
} from "lucide-react";

type MenuItem = {
  name: string;
  route: string;
  icon: LucideIcon;
};

type MenuGroup = {
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
};

const groupedMenu: MenuGroup[] = [
  {
    title: "Core",
    icon: Layers3,
    items: [
      { name: "Home", icon: Home, route: "/" },
      { name: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
      { name: "Regulation Feed", icon: Rss, route: "/regulation-feed" },
      { name: "Workflow Engine", icon: KanbanSquare, route: "/workflow-engine" },
      { name: "Evidence Vault", icon: ShieldCheck, route: "/evidence-vault" },
    ],
  },
  {
    title: "Intelligence",
    icon: Sparkles,
    items: [
      { name: "Clause Intelligence", icon: BrainCircuit, route: "/clause-intelligence" },
      { name: "Obligations", icon: ListChecks, route: "/obligations" },
      { name: "Compliance Graph", icon: GitFork, route: "/compliance-graph" },
      { name: "Risk Intelligence", icon: TrendingUp, route: "/risk" },
      { name: "AI Copilot", icon: Bot, route: "/ai-copilot" },
    ],
  },
];

function isRouteActive(pathname: string, route: string) {
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const groups = useMemo(() => groupedMenu, []);

  return (
    <aside
      className={`glass-panel sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-white/10 lg:flex ${
        collapsed ? "w-24" : "w-80"
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        {!collapsed ? (
          <div className="flex min-w-0 items-center gap-3">
            <div className="shadow-glow flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-base font-black text-white">
              R
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight text-white">
                RegOS<span className="text-cyan-400"> SEBI</span>
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                Compliance OS
              </p>
            </div>
          </div>
        ) : (
          <div className="shadow-glow flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-base font-black text-white">
            R
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="px-3 pt-4">
        {!collapsed ? (
          <div className="mb-3 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Workspace
            </p>
            <p className="mt-1 text-sm font-medium text-white">SEBI Compliance Twin</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Unified control room for circulars, obligations, evidence, and risk.
            </p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
        {groups.map((group) => {
          const GroupIcon = group.icon;

          return (
            <div key={group.title} className="space-y-1.5">
              {!collapsed ? (
                <div className="flex items-center gap-2 px-2 pb-1">
                  <GroupIcon size={13} className="text-zinc-500" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    {group.title}
                  </p>
                </div>
              ) : null}

              {group.items.map((item) => {
                const isActive = isRouteActive(pathname, item.route);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`group flex w-full items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "border border-cyan-500/25 bg-cyan-500/10 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
                        : "text-zinc-300 hover:border hover:border-white/10 hover:bg-white/5 hover:text-white"
                    } ${collapsed ? "justify-center" : "gap-3"}`}
                    title={collapsed ? item.name : undefined}
                    aria-label={collapsed ? item.name : undefined}
                  >
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? "bg-cyan-500/12 text-cyan-300"
                          : "text-zinc-400 group-hover:bg-white/5 group-hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                    </span>

                    {!collapsed ? <span className="truncate text-sm">{item.name}</span> : null}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              <div>
                <p className="text-xs font-semibold text-zinc-200">SEBI Watch Active</p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                  Live sync healthy across dashboard, obligations, evidence, and risk services.
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Last sync 3 mins ago
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-white/10 p-3">
          <div className="flex justify-center">
            <div
              className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
              aria-label="SEBI Watch Active"
              title="SEBI Watch Active"
            />
          </div>
        </div>
      )}
    </aside>
  );
}
