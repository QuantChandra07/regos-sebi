"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  Bot,
  CalendarDays,
  CheckCircle2,
  FileSearch,
  FileText,
  GitBranch,
  LayoutDashboard,
  Network,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Layers3,
  Sparkles,
} from "lucide-react";

type AppMode = "demo" | "live";

interface SidebarProps {
  mode?: AppMode;
}

const items = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/regulation-feed",
    label: "Regulation Feed",
    icon: FileSearch,
  },
  {
    href: "/clause-intelligence",
    label: "Clause Intelligence",
    icon: FileText,
  },
  {
    href: "/obligations",
    label: "Obligations",
    icon: CheckCircle2,
    isNew: true,
  },
  {
    href: "/workflow-engine",
    label: "Workflow Engine",
    icon: GitBranch,
  },
  {
    href: "/evidence-vault",
    label: "Evidence Vault",
    icon: Archive,
  },
  {
    href: "/risk",
    label: "Risk Intelligence",
    icon: AlertTriangle,
  },
  {
    href: "/compliance-graph",
    label: "Compliance Graph",
    icon: Network,
  },
  {
    href: "/compliance-timeline",
    label: "Compliance Timeline",
    icon: CalendarDays,
  },
  {
    href: "/ai-copilot",
    label: "AI Copilot",
    icon: Bot,
  },
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

export default function Sidebar({
  mode = "demo",
}: SidebarProps) {
  const pathname = usePathname();
  const isLive = mode === "live";

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: isLive
                ? "linear-gradient(135deg, #10b981, #0ea5e9)"
                : "linear-gradient(135deg, #0ea5e9, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isLive
                ? "0 4px 12px rgba(16,185,129,0.3)"
                : "0 4px 12px rgba(56,189,248,0.3)",
              flexShrink: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 8L6 4L10 8L14 4"
                stroke="#020617"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L6 8L10 12L14 8"
                stroke="#020617"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity=".5"
              />
            </svg>
          </div>

          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "0.02em",
              }}
            >
              REGOS-SEBI
            </div>

            <div
              style={{
                fontSize: 10,
                color: isLive
                  ? "#10b981"
                  : "var(--c-text-muted)",
                fontWeight: 600,
                marginTop: 1,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {isLive && (
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "inline-block",
                    boxShadow: "0 0 6px #10b981",
                  }}
                />
              )}

              {isLive
                ? "Live Backend"
                : "AI Compliance Engine"}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "8px 12px",
          margin: "0 8px 4px",
          borderRadius: 8,
          background: isLive
            ? "rgba(16,185,129,0.08)"
            : "rgba(56,189,248,0.06)",
          border: `1px solid ${
            isLive
              ? "rgba(16,185,129,0.2)"
              : "rgba(56,189,248,0.12)"
          }`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: isLive ? "#10b981" : "#38bdf8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isLive ? "#10b981" : "#38bdf8",
              display: "inline-block",
              boxShadow: `0 0 5px ${
                isLive ? "#10b981" : "#38bdf8"
              }`,
            }}
          />

          {isLive
            ? "Live Backend · Real SEBI Data"
            : "Demo Dataset · AI Processed"}
        </div>
      </div>

      <div className="sidebar-section-label">
        Workspace
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 16,
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item${
                isActive ? " active" : ""
              }`}
            >
              <Icon size={15} strokeWidth={1.7} />

              <span>{item.label}</span>

              {item.isNew && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 9,
                    fontWeight: 700,
                    background: "rgba(56,189,248,0.1)",
                    color: "var(--c-primary)",
                    border:
                      "1px solid rgba(56,189,248,0.18)",
                    padding: "1px 6px",
                    borderRadius: 4,
                    letterSpacing: "0.04em",
                  }}
                >
                  NEW
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--c-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            RS
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--c-text)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              SEBI TechSprint
            </div>

            <div
              style={{
                fontSize: 11,
                color: isLive
                  ? "#10b981"
                  : "var(--c-text-muted)",
              }}
            >
              {isLive
                ? "Live Workspace"
                : "Demo Workspace"}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
