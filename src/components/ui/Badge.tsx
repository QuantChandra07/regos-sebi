import React from "react";
import clsx from "clsx";
import type {
  RiskLevel,
  ComplianceStatus,
  WorkflowColumn,
  EvidenceStatus,
  EvidenceReviewStatus,
  AgentRunStatus,
  AgentHealth,
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
};

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

function getBadgeStyles(value: string) {
  switch (value) {
    case "CRITICAL":
    case "Critical":
    case "BREACH":
    case "EXPIRED":
    case "ERROR":
    case "GAP":
    case "MISSING":
    case "REJECTED":
    case "Overdue":
      return "bg-red-950/60 text-red-400 border-red-800/80";

    case "HIGH":
    case "High":
    case "PENDING_REVIEW":
    case "EVIDENCE_REQUESTED":
    case "UNDER_REVIEW":
    case "WARNING":
      return "bg-amber-950/60 text-amber-400 border-amber-800/80";

    case "MEDIUM":
    case "Medium":
    case "IN_DESIGN":
    case "UPLOADED":
      return "bg-yellow-950/60 text-yellow-400 border-yellow-800/80";

    case "LOW":
    case "Low":
    case "ACTIVE":
    case "COMPLIANT":
    case "VERIFIED":
    case "APPROVED":
    case "COMPLETED":
    case "RUNNING":
    case "GOOD":
      return "bg-emerald-950/60 text-emerald-400 border-emerald-800/80";

    case "ASSIGNED":
    case "In Progress":
      return "bg-cyan-950/60 text-cyan-400 border-cyan-800/80";

    case "PENDING":
    case "Pending":
    case "NONE":
    case "IDLE":
    case "NOT_STARTED":
      return "bg-gray-800 text-gray-300 border-gray-700";

    default:
      return "bg-gray-800 text-gray-300 border-gray-700";
  }
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  label,
  className,
}) => {
  const value = String(label ?? variant ?? "NONE");
  const styles = getBadgeStyles(value);

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono",
        styles,
        className
      )}
    >
      {formatLabel(value)}
    </span>
  );
};