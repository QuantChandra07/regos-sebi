"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/ui/StateBlocks";
import { useTasks } from "../../lib/hooks";
import type { WorkflowTask } from "../../types/api";
import { Paperclip, MessageSquare, Workflow, Users } from "lucide-react";

const columns = ["NOTSTARTED", "INDESIGN", "ACTIVE", "COMPLIANT"] as const;
type WorkflowColumn = (typeof columns)[number];

function isWorkflowColumn(value: string | undefined | null): value is WorkflowColumn {
  return !!value && columns.some((column) => column === value);
}

function formatStatusLabel(value: WorkflowColumn) {
  return value.replaceAll("_", " ");
}

function formatDueDate(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function WorkflowEnginePage() {
  const { data, error, isLoading } = useTasks();
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [deptFilter, setDeptFilter] = useState("ALL");

  useEffect(() => {
    if (data?.items) {
      setTasks(data.items);
    }
  }, [data]);

  const departments = useMemo(() => {
    return Array.from(
      new Set(tasks.map((task) => task.department_name || "Unassigned department"))
    ).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        deptFilter === "ALL" ||
        (task.department_name || "Unassigned department") === deptFilter
    );
  }, [tasks, deptFilter]);

  const groupedTasks = useMemo<Record<WorkflowColumn, WorkflowTask[]>>(() => {
    const bucket: Record<WorkflowColumn, WorkflowTask[]> = {
      NOTSTARTED: [],
      INDESIGN: [],
      ACTIVE: [],
      COMPLIANT: [],
    };

    for (const task of filteredTasks) {
      const status = isWorkflowColumn(task.status) ? task.status : "NOTSTARTED";
      bucket[status].push(task);
    }

    return bucket;
  }, [filteredTasks]);

  const handleDrop = (targetColumn: WorkflowColumn) => {
    if (!dragId) return;

    setTasks((prev) => {
  return prev.map((task) => {
    if (task.id === dragId) {
      return {
        ...task,
        status: targetColumn as WorkflowTask["status"],
      };
    }
    return task;
  });
});

    setDragId(null);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    setDragId(taskId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragEnd = () => {
    setDragId(null);
  };

  if (isLoading) return <LoadingBlock label="Loading workflow..." />;
  if (error) return <ErrorBlock message={error.message} />;
  if (!tasks.length) return <EmptyBlock label="No workflow tasks found." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Execution workspace</p>
          <h1 className="page-title mt-4">Workflow Engine</h1>
          <p className="page-subtitle">
            Move obligations into accountable operational tasks using a Kanban-style execution view.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Filter
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Department lens</p>
              <p className="mt-1 text-sm text-zinc-400">Focus workflow by functional owner</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10">
              <Users size={18} className="text-cyan-300" />
            </div>
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = groupedTasks[column];
          const isDropTargetActive = dragId !== null;

          return (
            <div
              key={column}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={() => handleDrop(column)}
              className={`rounded-[24px] border p-4 transition-colors ${
                isDropTargetActive
                  ? "border-cyan-500/30 bg-cyan-500/[0.04]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Workflow size={16} className="text-cyan-300" />
                  <h2 className="text-sm font-semibold text-white">
                    {formatStatusLabel(column)}
                  </h2>
                </div>
                <Badge label={column} />
              </div>

              <div className="space-y-3">
                {columnTasks.length ? (
                  columnTasks.map((task) => {
                    const dueDate =
                      "duedate" in task
                        ? formatDueDate(typeof task.duedate === "string" ? task.duedate : undefined)
                        : null;

                    const commentCount =
                      "comments" in task && Array.isArray(task.comments)
                        ? task.comments.length
                        : 0;

                    const evidenceCount =
                      "evidencestatus" in task && task.evidencestatus !== "NONE" ? 1 : 0;

                    return (
                      <Card
                        key={task.id}
                        draggable
                        onDragStart={(event) => handleDragStart(event, task.id)}
                        onDragEnd={handleDragEnd}
                        className={`cursor-grab rounded-2xl border border-white/10 bg-white/[0.03] p-4 active:cursor-grabbing ${
                          dragId === task.id ? "opacity-60" : ""
                        }`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div className="flex flex-wrap gap-2">
                            {"priority" in task && task.priority ? (
                              <Badge label={String(task.priority)} />
                            ) : (
                              <span className="text-[10px] text-zinc-500">No priority</span>
                            )}

                            {"evidencestatus" in task && task.evidencestatus ? (
                              <Badge label={String(task.evidencestatus)} />
                            ) : null}
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-white">{task.title}</p>

                        <p className="mt-2 text-xs text-zinc-400">
                          {task.department_name || "Unassigned department"}
                          {"ownername" in task && task.ownername ? ` • ${task.ownername}` : ""}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-zinc-300">
                          {task.description || "No description"}
                        </p>

                        {dueDate ? (
                          <p className="mt-3 text-xs text-zinc-500">Due {dueDate}</p>
                        ) : null}

                        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-3 text-zinc-500">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Paperclip size={10} />
                            {evidenceCount}
                          </span>

                          <span className="flex items-center gap-1 text-[11px]">
                            <MessageSquare size={10} />
                            {commentCount}
                          </span>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <p className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-zinc-500">
                    No tasks.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}