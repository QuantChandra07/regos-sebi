"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Building2,
  ChevronDown,
  ClipboardCheck,
  FileSearch,
  FileText,
  GitBranch,
  History,
  LayoutDashboard,
  Network,
  Scale,
  Search,
  Settings,
  Shield,
  Sparkles,
  Upload,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useState } from "react";

type SidebarItem = {
  name: string;
  route: string;
  icon: LucideIcon;
  badge?: string;
};

type SidebarSection = {
  title: string;
  icon: LucideIcon;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    title: "Workspace",
    icon: LayoutDashboard,
    items: [
      {
        name: "Dashboard",
        route: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Regulation Feed",
        route: "/regulation-feed",
        icon: Bell,
      },
      {
        name: "Document Library",
        route: "/document-library",
        icon: FileText,
      },
      {
        name: "Live Upload",
        route: "/live-upload",
        icon: Upload,
      },
    ],
  },
  {
    title: "Intelligence",
    icon: Sparkles,
    items: [
      {
        name: "Clause Intelligence",
        route: "/clause-intelligence",
        icon: FileSearch,
      },
      {
        name: "Obligations",
        route: "/obligations",
        icon: ClipboardCheck,
        badge: "148",
      },
      {
        name: "Risk Intelligence",
        route: "/risk",
        icon: Shield,
        badge: "07",
      },
      {
        name: "Compliance Graph",
        route: "/compliance-graph",
        icon: Network,
      },
    ],
  },
  {
    title: "Execution",
    icon: Workflow,
    items: [
      {
        name: "Workflow Engine",
        route: "/workflow-engine",
        icon: Workflow,
        badge: "23",
      },
      {
        name: "Evidence Vault",
        route: "/evidence-vault",
        icon: FileText,
        badge: "12",
      },
      {
        name: "Compliance Timeline",
        route: "/compliance-timeline",
        icon: History,
      },
    ],
  },
  {
    title: "Assistant",
    icon: Bot,
    items: [
      {
        name: "AI Copilot",
        route: "/ai-copilot",
        icon: Bot,
      },
      {
        name: "Synthetic Inspection",
        route: "/synthetic-inspection",
        icon: Search,
      },
    ],
  },
  {
    title: "Administration",
    icon: Settings,
    items: [
      {
        name: "Executive",
        route: "/executive",
        icon: BarChart3,
      },
      {
        name: "Administration",
        route: "/admin",
        icon: Users,
      },
      {
        name: "Settings",
        route: "/settings",
        icon: Settings,
      },
    ],
  },
];

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] =
    useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  const isActive = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  };

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/10 bg-[#060a12]/95 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Scale
                size={18}
                className="text-slate-950"
              />
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-white">
                REGOS-SEBI
              </p>

              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Compliance OS
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <div className="border-b border-white/10 px-4 py-4">
          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.05] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                <Building2
                  size={16}
                  className="text-cyan-300"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  Demo Workspace
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Workspace active
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-5">
            {sections.map((section) => {
              const SectionIcon = section.icon;
              const isCollapsed =
                collapsedSections[section.title];

              return (
                <div key={section.title}>
                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(section.title)
                    }
                    className="mb-2 flex w-full items-center justify-between px-2 text-left"
                  >
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                      <SectionIcon size={12} />
                      {section.title}
                    </span>

                    <ChevronDown
                      size={13}
                      className={`text-zinc-700 transition-transform ${
                        isCollapsed ? "-rotate-90" : ""
                      }`}
                    />
                  </button>

                  {!isCollapsed ? (
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        const active = isActive(item.route);

                        return (
                          <Link
                            key={item.route}
                            href={item.route}
                            onClick={onClose}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                              active
                                ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 shadow-[0_0_18px_rgba(56,189,248,0.08)]"
                                : "border border-transparent text-zinc-500 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-200"
                            }`}
                          >
                            <ItemIcon
                              size={15}
                              className={`shrink-0 ${
                                active
                                  ? "text-cyan-300"
                                  : "text-zinc-600 group-hover:text-zinc-300"
                              }`}
                            />

                            <span className="min-w-0 flex-1 truncate">
                              {item.name}
                            </span>

                            {item.badge ? (
                              <span
                                className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] ${
                                  active
                                    ? "bg-cyan-400/15 text-cyan-300"
                                    : "bg-white/[0.05] text-zinc-600"
                                }`}
                              >
                                {item.badge}
                              </span>
                            ) : null}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-[10px] font-bold text-white">
              RS
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-zinc-200">
                Compliance User
              </p>

              <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                Compliance Officer
              </p>
            </div>

            <Activity
              size={14}
              className="text-emerald-400"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
