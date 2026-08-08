"use client";

import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from "react";
import {
  Filter,
  MessageSquare,
  Paperclip,
  Plus,
  Users,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "../../components/ui/StateBlocks";
import { useTasks } from "../../lib/hooks";
import type { WorkflowTask } from "../../types/api";

const columns = [
  "NOT_STARTED",
  "IN_DESIGN",
  "ACTIVE",
  "COMPLIANT",
] as const;

type WorkflowColumn = (typeof columns)[number];

type LegacyWorkflowTask = WorkflowTask & {
  priority?: string | null;
  evidencestatus?: string | null;
  ownername?: string | null;
  duedate?: string | null;
  comments?: string[];
};

type ColumnConfig = {
  key: WorkflowColumn;
  label: string;
  color: string;
};

const columnConfig: ColumnConfig[] = [
  { key: "NOT_STARTED", label: "Not Started", color: "#64748b" },
  { key: "IN_DESIGN", label: "In Design", color: "#f59e0b" },
  { key: "ACTIVE", label: "Active", color: "#38bdf8" },
  { key: "COMPLIANT", label: "Compliant", color: "#22c55e" },
];

function normalizeWorkflowStatus(
  value: string | undefined | null,
): WorkflowColumn {
  const normalized = (value || "NOT_STARTED")
    .replace(/[\s-]/g, "_")
    .toUpperCase();

  if (normalized === "NOTSTARTED") return "NOT_STARTED";
  if (normalized === "INDESIGN") return "IN_DESIGN";
  if (normalized === "IN_PROGRESS") return "ACTIVE";
  if (normalized === "COMPLETED") return "COMPLIANT";

  if (columns.includes(normalized as WorkflowColumn)) {
    return normalized as WorkflowColumn;
  }

  return "NOT_STARTED";
}

function apiStatusFromColumn(
  column: WorkflowColumn,
): WorkflowTask["status"] {
  switch (column) {
    case "NOT_STARTED":
      return "NOT_STARTED";
    case "IN_DESIGN":
      return "IN_DESIGN";
    case "ACTIVE":
      return "ACTIVE";
    case "COMPLIANT":
      return "COMPLIANT";
  }
}

function formatDueDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDeadlineStatus(value?: string | null) {
  if (!value) return "none";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "normal";
  }

  const now = new Date();
  const daysRemaining =
    (date.getTime() - now.getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysRemaining < 0) return "overdue";
  if (daysRemaining <= 14) return "soon";

  return "normal";
}

function getPriorityColor(priority?: string | null) {
  const normalized = (priority || "").toUpperCase();

  if (normalized === "P1" || normalized === "CRITICAL") {
    return "#ef4444";
  }

  if (normalized === "P2" || normalized === "HIGH") {
    return "#f59e0b";
  }

  return "#38bdf8";
}

function getProgress(task: LegacyWorkflowTask) {
  const status = normalizeWorkflowStatus(task.status);

  if (status === "COMPLIANT") return 100;
  if (status === "ACTIVE") return 65;
  if (status === "IN_DESIGN") return 35;

  return 0;
}

function CircleProgress({
  percentage,
  size = 34,
  color = "#38bdf8",
}: {
  percentage: number;
  size?: number;
  color?: string;
}) {
  const radius = (size - 5) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`${percentage}% complete`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3.5"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>

      <span
        className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold"
        style={{ color }}
      >
        {percentage}%
      </span>
    </div>
  );
}

function WorkflowCard({
  task,
  isCompliant,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  task: LegacyWorkflowTask;
  isCompliant: boolean;
  isDragging: boolean;
  onDragStart: (
    event: DragEvent<HTMLElement>,
    taskId: string,
  ) => void;
  onDragEnd: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const progress = getProgress(task);
  const progressColor = isCompliant
    ? "#22c55e"
    : progress > 70
      ? "#38bdf8"
      : progress > 30
        ? "#f59e0b"
        : "#94a3b8";

  const priorityColor = getPriorityColor(task.priority);

  const department =
    task.department_name || "Unassigned department";

  const owner =
    task.ownername ||
    task.owner_employee_id ||
    "Unassigned owner";

  const ownerInitials = owner
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const dueDate = formatDueDate(
    task.due_date || task.duedate,
  );

  const deadlineStatus = getDeadlineStatus(
    task.due_date || task.duedate,
  );

  const evidenceCount =
    task.evidencestatus && task.evidencestatus !== "NONE"
      ? 1
      : 0;

  const commentCount = Array.isArray(task.comments)
    ? task.comments.length
    : 0;

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative mb-3 overflow-hidden rounded-[14px] p-4 transition-all ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        background: hovered
          ? "rgba(14,22,44,0.9)"
          : "rgba(10,16,32,0.7)",
        border: `1px solid ${
          isCompliant
            ? "rgba(34,197,94,0.22)"
            : hovered
              ? "rgba(56,189,248,0.3)"
              : "rgba(56,189,248,0.1)"
        }`,
        boxShadow: hovered
          ? "0 8px 28px rgba(0,0,0,0.4)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transitionDuration: "180ms",
      }}
    >
      {isCompliant && (
        <div
          className="absolute left-0 right-0 top-0 h-0.5"
          style={{
            background: "linear-gradient(90deg, #22c55e, #06b6d4)",
          }}
        />
      )}

      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-mono text-[10px] font-semibold text-zinc-500">
            {task.id}
          </span>

          {task.priority ? (
            <span
              className="rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide"
              style={{
                color: priorityColor,
                background: `${priorityColor}18`,
                border: `1px solid ${priorityColor}35`,
              }}
            >
              {task.priority}
            </span>
          ) : null}
        </div>

        {isCompliant ? (
          <span className="text-sm" title="Compliant" aria-label="Compliant">
            ✓
          </span>
        ) : (
          <CircleProgress
            percentage={progress}
            size={32}
            color={progressColor}
          />
        )}
      </div>

      <h3 className="text-[13px] font-bold leading-5 text-[var(--c-text)]">
        {task.title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
          {department}
        </span>

        <Badge label="Workflow Task" />
      </div>

      {!isCompliant && (
        <div className="progress-track mt-3 h-[3px]">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${progressColor}aa, ${progressColor})`,
            }}
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
            style={{
              color: "#38bdf8",
              background: "rgba(56,189,248,0.14)",
              border: "1px solid rgba(56,189,248,0.32)",
            }}
            title={owner}
          >
            {ownerInitials || "—"}
          </div>

          <span className="max-w-[90px] truncate text-[11px] text-zinc-500">
            {owner.split(/\s+/)[0]}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10.5px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Paperclip size={11} />
            {evidenceCount}
          </span>

          <span className="flex items-center gap-1">
            <MessageSquare size={11} />
            {commentCount}
          </span>

          {dueDate ? (
            <span
              className={
                deadlineStatus === "overdue"
                  ? "font-semibold text-red-400"
                  : deadlineStatus === "soon"
                    ? "font-semibold text-amber-400"
                    : "text-zinc-500"
              }
            >
              {dueDate}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function WorkflowEnginePage() {
  const { data, error, isLoading } = useTasks();

  const [tasks, setTasks] = useState<LegacyWorkflowTask[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  useEffect(() => {
    if (data?.items) {
      setTasks(data.items as LegacyWorkflowTask[]);
    }
  }, [data]);

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        tasks.map(
          (task) => task.department_name || "Unassigned department",
        ),
      ),
    ).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const department =
        task.department_name || "Unassigned department";

      return (
        departmentFilter === "ALL" ||
        department === departmentFilter
      );
    });
  }, [tasks, departmentFilter]);

  const groupedTasks = useMemo<
    Record<WorkflowColumn, LegacyWorkflowTask[]>
  >(() => {
    const grouped: Record<WorkflowColumn, LegacyWorkflowTask[]> = {
      NOT_STARTED: [],
      IN_DESIGN: [],
      ACTIVE: [],
      COMPLIANT: [],
    };

    filteredTasks.forEach((task) => {
      const column = normalizeWorkflowStatus(task.status);
      grouped[column].push(task);
    });

    return grouped;
  }, [filteredTasks]);

  const handleDragStart = (
    event: DragEvent<HTMLElement>,
    taskId: string,
  ) => {
    setDragId(taskId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragEnd = () => {
    setDragId(null);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    event: DragEvent<HTMLElement>,
    targetColumn: WorkflowColumn,
  ) => {
    event.preventDefault();

    const droppedTaskId =
      event.dataTransfer.getData("text/plain") || dragId;

    if (!droppedTaskId) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === droppedTaskId
          ? {
              ...task,
              status: apiStatusFromColumn(targetColumn),
            }
          : task,
      ),
    );

    setDragId(null);
  };

  const totalTasks = tasks.length;
  const compliantTasks = groupedTasks.COMPLIANT.length;
  const activeTasks = totalTasks - compliantTasks;

  if (isLoading) {
    return (
      <Shell
        mode="demo"
        docName="Master Circular – Stock Brokers"
        docPages={419}
      >
        <LoadingBlock label="Loading workflow..." />
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell
        mode="demo"
        docName="Master Circular – Stock Brokers"
        docPages={419}
      >
        <ErrorBlock message={error.message} />
      </Shell>
    );
  }

  if (!tasks.length) {
    return (
      <Shell
        mode="demo"
        docName="Master Circular – Stock Brokers"
        docPages={419}
      >
        <EmptyBlock label="No workflow tasks found." />
      </Shell>
    );
  }

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <p className="section-label">Execution workspace</p>

            <h1 className="page-title mt-4">Workflow Engine</h1>

            <p className="page-subtitle">
              Move obligations into accountable operational tasks
              using a Kanban-style execution view.
            </p>

            <p className="mt-5 text-sm text-zinc-400">
              {totalTasks} tasks · {compliantTasks} compliant ·{" "}
              {activeTasks} requiring action
            </p>
          </div>

          <Card className="rounded-[28px] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Filter
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  Department lens
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Focus workflow by functional owner
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
                <Users size={18} className="text-cyan-300" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Filter size={15} className="shrink-0 text-zinc-500" />

              <select
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(event.target.value)
                }
                className="select-glass w-full rounded-2xl px-4 py-3 text-sm text-white outline-none"
              >
                <option value="ALL" className="bg-slate-900">
                  All Departments
                </option>

                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                    className="bg-slate-900"
                  >
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          {columnConfig.map((column) => {
            const columnTasks = groupedTasks[column.key];
            const isDropTargetActive = dragId !== null;

            return (
              <section
                key={column.key}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, column.key)}
                className="min-w-0 rounded-[24px] p-3 transition-colors"
                style={{
                  background: isDropTargetActive
                    ? `${column.color}08`
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${
                    isDropTargetActive
                      ? `${column.color}35`
                      : "rgba(255,255,255,0.08)"
                  }`,
                }}
              >
                <div
                  className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5"
                  style={{
                    background: `${column.color}0d`,
                    border: `1px solid ${column.color}22`,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: column.color,
                      boxShadow: `0 0 8px ${column.color}`,
                    }}
                  />

                  <h2 className="flex-1 text-[13px] font-bold text-[var(--c-text)]">
                    {column.label}
                  </h2>

                  <span
                    className="flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-extrabold"
                    style={{
                      color: column.color,
                      background: `${column.color}20`,
                      border: `1px solid ${column.color}30`,
                    }}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                <div>
                  {columnTasks.length ? (
                    columnTasks.map((task) => (
                      <WorkflowCard
                        key={task.id}
                        task={task}
                        isCompliant={column.key === "COMPLIANT"}
                        isDragging={dragId === task.id}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))
                  ) : (
                    <p className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-zinc-500">
                      No tasks.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-left text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                  style={{ borderColor: `${column.color}35` }}
                >
                  <Plus size={13} />
                  Add workflow
                </button>
              </section>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}