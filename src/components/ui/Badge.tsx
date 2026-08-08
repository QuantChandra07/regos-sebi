import type { ReactNode } from "react";
import clsx from "clsx";

import type {
  AgentHealth,
  AgentRunStatus,
  ComplianceStatus,
  EvidenceReviewStatus,
  EvidenceStatus,
  RiskLevel,
  WorkflowColumn,
} from "@/types";

type BadgeType =
  | RiskLevel
  | ComplianceStatus
  | WorkflowColumn
  | EvidenceStatus
  | EvidenceReviewStatus
  | AgentRunStatus
  | AgentHealth
  | string;

type BadgeProps = {
  variant?: BadgeType;
  label?: string;
  className?: string;
  children?: ReactNode;
};

function normalizeValue(value: string) {
  return value
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getBadgeStyles(value: string) {
  const normalized = normalizeValue(value);

  switch (normalized) {
    case "CRITICAL":
    case "BREACH":
    case "EXPIRED":
    case "ERROR":
    case "GAP":
    case "MISSING":
    case "REJECTED":
    case "OVERDUE":
      return "border-red-800/80 bg-red-950/60 text-red-400";

    case "HIGH":
    case "PENDING_REVIEW":
    case "EVIDENCE_REQUESTED":
    case "UNDER_REVIEW":
    case "WARNING":
      return "border-amber-800/80 bg-amber-950/60 text-amber-400";

    case "MEDIUM":
    case "IN_DESIGN":
    case "UPLOADED":
      return "border-yellow-800/80 bg-yellow-950/60 text-yellow-400";

    case "LOW":
    case "ACTIVE":
    case "COMPLIANT":
    case "VERIFIED":
    case "APPROVED":
    case "COMPLETED":
    case "RUNNING":
    case "GOOD":
      return "border-emerald-800/80 bg-emerald-950/60 text-emerald-400";

    case "ASSIGNED":
    case "IN_PROGRESS":
      return "border-cyan-800/80 bg-cyan-950/60 text-cyan-400";

    case "PENDING":
    case "NONE":
    case "IDLE":
    case "NOT_STARTED":
    case "NOTSTARTED":
      return "border-gray-700 bg-gray-800 text-gray-300";

    default:
      return "border-gray-700 bg-gray-800 text-gray-300";
  }
}

export function Badge({
  variant,
  label,
  className,
  children,
}: BadgeProps) {
  const value = String(
    children ?? label ?? variant ?? "NONE",
  );

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1",
        "font-mono text-[10px] font-semibold uppercase tracking-wide",
        getBadgeStyles(value),
        className,
      )}
    >
      {formatLabel(value)}
    </span>
  );
}

export default Badge;