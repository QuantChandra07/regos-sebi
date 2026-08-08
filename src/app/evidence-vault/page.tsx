"use client";

import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Filter,
  LayoutGrid,
  List,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";

import Shell from "../../components/layout/Shell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import {
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from "../../components/ui/StateBlocks";
import { uploadEvidence } from "../../lib/api";
import { useEvidence } from "../../lib/hooks";

type EvidenceRowItem = {
  id: string;
  filename?: string;
  mimetype?: string;
  storagekey?: string;
  reviewstatus?: string;
  createdat?: string;
  uploadedat?: string;
  taskid?: string;
  filehash?: string;
  downloadurl?: string;
};

type ViewMode = "grid" | "list";

const STATUS_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "VERIFIED", label: "Verified" },
  { value: "PENDINGREVIEW", label: "Pending" },
  { value: "EXPIRED", label: "Expired" },
] as const;

function formatTimestamp(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortenHash(hash?: string) {
  if (!hash) return "-";
  if (hash.length <= 18) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function getFileExtension(item: EvidenceRowItem) {
  const source = item.filename || item.storagekey || "";
  const parts = source.split(".");

  if (parts.length < 2) {
    return "FILE";
  }

  return parts[parts.length - 1].toUpperCase();
}

function statusDotColor(status: string) {
  switch (status) {
    case "VERIFIED":
      return "#22c55e";
    case "EXPIRED":
      return "#ef4444";
    default:
      return "#f59e0b";
  }
}

export default function EvidenceVaultPage() {
  const { data, error, isLoading, mutate } = useEvidence();

  const [taskId, setTaskId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [fileInputKey, setFileInputKey] = useState(0);

  async function handleUpload(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!file) {
      setUploadMsg("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();

    if (taskId.trim()) {
      formData.append("task_id", taskId.trim());
    }

    formData.append("file", file);

    try {
      setUploading(true);
      setUploadMsg("Uploading...");

      await uploadEvidence(formData);

      setUploadMsg("Upload successful.");
      setFile(null);
      setTaskId("");
      setFileInputKey((prev) => prev + 1);

      await mutate();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Upload failed.";

      setUploadMsg(message);
    } finally {
      setUploading(false);
    }
  }

  const items: EvidenceRowItem[] = data?.items ?? [];

  const filteredEvidence = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const status = item.reviewstatus || "PENDINGREVIEW";

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      const haystack = [
        item.filename,
        item.mimetype,
        item.storagekey,
        item.taskid,
        item.id,
        item.filehash,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 ||
        haystack.includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [items, query, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      verified: items.filter(
        (item) => item.reviewstatus === "VERIFIED",
      ).length,
      pending: items.filter(
        (item) =>
          (item.reviewstatus || "PENDINGREVIEW") ===
          "PENDINGREVIEW",
      ).length,
      expired: items.filter(
        (item) => item.reviewstatus === "EXPIRED",
      ).length,
    };
  }, [items]);

  const timelineItems = useMemo(() => {
    return [...items]
      .sort((a, b) => {
        const aTime = new Date(
          a.uploadedat || a.createdat || 0,
        ).getTime();

        const bTime = new Date(
          b.uploadedat || b.createdat || 0,
        ).getTime();

        return bTime - aTime;
      })
      .slice(0, 8);
  }, [items]);

  return (
    <Shell
      mode="demo"
      docName="Master Circular – Stock Brokers"
      docPages={419}
    >
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
            <p className="section-label">
              Governance evidence layer
            </p>

            <h1 className="page-title mt-4">
              Evidence Vault
            </h1>

            <p className="page-subtitle">
              Review evidence items, upload supporting
              documents, and track verification state across
              workflow-linked controls.
            </p>
          </div>

          <Card className="rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  View
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {viewMode === "grid" ? "Grid layout" : "List layout"}
                </p>
              </div>

              <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                  className={`flex h-9 w-9 items-center justify-center transition-colors ${
                    viewMode === "grid"
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <LayoutGrid size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  className={`flex h-9 w-9 items-center justify-center transition-colors ${
                    viewMode === "list"
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Button variant="secondary" type="button">
                <ShieldCheck size={14} />
                Export Register
              </Button>

              <Button
                type="submit"
                form="evidence-upload-form"
                disabled={uploading}
              >
                <Upload size={14} />
                {uploading ? "Uploading..." : "Upload Evidence"}
              </Button>
            </div>
          </Card>
        </div>

        <form
          id="evidence-upload-form"
          onSubmit={handleUpload}
          className="grid gap-3 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_1fr_auto]"
        >
          <input
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            placeholder="Workflow task ID"
            value={taskId}
            onChange={(event) =>
              setTaskId(event.target.value)
            }
          />

          <input
            key={fileInputKey}
            type="file"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300"
            onChange={(event) =>
              setFile(event.target.files?.[0] ?? null)
            }
          />

          <button
            type="submit"
            disabled={uploading}
            className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-medium text-black transition-opacity disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {uploadMsg ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
            {uploadMsg}
          </div>
        ) : null}

        {isLoading ? (
          <LoadingBlock label="Loading evidence..." />
        ) : null}

        {error ? (
          <ErrorBlock message={error.message} />
        ) : null}

        {!isLoading && !error ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Files"
                value={stats.total}
                tone="cyan"
                icon={<FileText size={18} />}
              />

              <StatCard
                title="Verified"
                value={stats.verified}
                tone="emerald"
                icon={<CheckCircle2 size={18} />}
              />

              <StatCard
                title="Pending Review"
                value={stats.pending}
                tone="amber"
                icon={<Clock3 size={18} />}
              />

              <StatCard
                title="Expired"
                value={stats.expired}
                tone="red"
                icon={<ShieldCheck size={18} />}
              />
            </div>

            <Card className="rounded-[24px]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    value={query}
                    onChange={(event) =>
                      setQuery(event.target.value)
                    }
                    placeholder="Search file name, MIME type, storage key, task ID..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-9 pr-3 text-sm text-gray-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {STATUS_FILTERS.map((filterOption) => {
                    const isActive =
                      statusFilter === filterOption.value;

                    const count =
                      filterOption.value === "ALL"
                        ? stats.total
                        : filterOption.value === "VERIFIED"
                          ? stats.verified
                          : filterOption.value ===
                              "PENDINGREVIEW"
                            ? stats.pending
                            : stats.expired;

                    return (
                      <button
                        key={filterOption.value}
                        type="button"
                        onClick={() =>
                          setStatusFilter(filterOption.value)
                        }
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <Filter size={12} />
                        {filterOption.label}
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {!items.length ? (
              <EmptyBlock label="No evidence found." />
            ) : viewMode === "list" ? (
              <Card className="overflow-hidden rounded-[24px] p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="border-b border-white/10 bg-white/[0.04]">
                      <tr className="text-[10px] font-mono uppercase tracking-wide text-zinc-500">
                        <th className="px-4 py-3">Evidence</th>
                        <th className="px-4 py-3">Task</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Uploaded</th>
                        <th className="px-4 py-3">
                          Storage Hash
                        </th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEvidence.length > 0 ? (
                        filteredEvidence.map((item) => (
                          <EvidenceRow
                            key={item.id}
                            item={item}
                          />
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-10 text-center text-xs text-zinc-500"
                          >
                            No evidence items matched the
                            current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : filteredEvidence.length ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredEvidence.map((item) => (
                  <EvidenceGridCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <EmptyBlock label="No evidence items matched the current filters." />
            )}

            {timelineItems.length > 0 ? (
              <Card className="rounded-[24px] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="section-label">
                      Recent activity
                    </p>

                    <h2 className="section-title mt-2">
                      Upload timeline
                    </h2>
                  </div>
                </div>

                <div className="relative space-y-5 pl-5">
                  <div className="absolute bottom-0 left-[7px] top-1 w-px bg-white/10" />

                  {timelineItems.map((item) => {
                    const status =
                      item.reviewstatus || "PENDINGREVIEW";

                    const color = statusDotColor(status);

                    return (
                      <div
                        key={item.id}
                        className="relative flex items-start gap-4"
                      >
                        <span
                          className="absolute -left-5 mt-1 h-3.5 w-3.5 rounded-full border-2"
                          style={{
                            borderColor: color,
                            background: `${color}33`,
                          }}
                        />

                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-zinc-500">
                            {formatTimestamp(
                              item.uploadedat ||
                                item.createdat,
                            )}
                          </p>

                          <p className="mt-1 truncate text-sm text-zinc-200">
                            {item.filename || "Unnamed file"}
                          </p>

                          <div className="mt-1.5">
                            <Badge label={status} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ) : null}
          </>
        ) : null}
      </div>
    </Shell>
  );
}

function StatCard({
  title,
  value,
  tone,
  icon,
}: {
  title: string;
  value: number;
  tone: "cyan" | "emerald" | "amber" | "red";
  icon: ReactNode;
}) {
  const toneMap = {
    cyan: "text-cyan-400 border-cyan-500/15 bg-cyan-500/10",
    emerald:
      "text-emerald-400 border-emerald-500/15 bg-emerald-500/10",
    amber: "text-amber-400 border-amber-500/15 bg-amber-500/10",
    red: "text-red-400 border-red-500/15 bg-red-500/10",
  };

  return (
    <Card className="rounded-[24px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${toneMap[tone]}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

function EvidenceGridCard({
  item,
}: {
  item: EvidenceRowItem;
}) {
  const status = item.reviewstatus || "PENDINGREVIEW";
  const timestamp = item.uploadedat || item.createdat;
  const fileLabel = item.filename || "Unnamed file";
  const extension = getFileExtension(item);

  return (
    <Card className="rounded-[24px] p-5 transition-colors hover:border-cyan-500/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/15 bg-cyan-500/10 text-cyan-300">
          <FileText size={18} />
        </div>

        <Badge label={status} />
      </div>

      <p className="mt-4 truncate text-sm font-semibold text-white">
        {fileLabel}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
          {extension}
        </span>

        {item.mimetype ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
            {item.mimetype}
          </span>
        ) : null}
      </div>

      {item.taskid ? (
        <p className="mt-3 text-[11px] text-zinc-500">
          Task: <span className="text-zinc-300">{item.taskid}</span>
        </p>
      ) : null}

      <p className="mt-3 font-mono text-[11px] text-cyan-300">
        {shortenHash(item.filehash || item.storagekey)}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[11px] text-zinc-500">
          {formatTimestamp(timestamp)}
        </span>

        {item.downloadurl ? (
          <a
            href={item.downloadurl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-gray-200 transition hover:border-cyan-500 hover:text-cyan-400"
          >
            <Download size={13} />
            Open
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-gray-500 opacity-60"
          >
            <Download size={13} />
            Unavailable
          </button>
        )}
      </div>
    </Card>
  );
}

function EvidenceRow({ item }: { item: EvidenceRowItem }) {
  const timestamp = item.uploadedat || item.createdat;
  const status = item.reviewstatus || "PENDINGREVIEW";
  const fileLabel = item.filename || "Unnamed file";

  return (
    <tr className="border-b border-white/10 text-sm text-gray-300 transition-colors hover:bg-white/[0.02]">
      <td className="px-4 py-4 align-top">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-cyan-400">
            <FileText size={15} />
          </div>

          <div>
            <p className="font-medium text-gray-100">
              {fileLabel}
            </p>

            <p className="mt-1 text-[11px] text-zinc-500">
              {item.mimetype || "Unknown MIME type"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 align-top">
        <p className="font-medium text-gray-200">
          {item.taskid || "-"}
        </p>

        <p className="mt-1 text-[11px] text-zinc-500">
          Linked workflow task
        </p>
      </td>

      <td className="px-4 py-4 align-top">
        {item.mimetype || "-"}
      </td>

      <td className="px-4 py-4 align-top">
        <Badge label={status} />
      </td>

      <td className="px-4 py-4 align-top">
        {formatTimestamp(timestamp)}
      </td>

      <td className="px-4 py-4 align-top">
        <code className="rounded-lg bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-cyan-300">
          {shortenHash(item.filehash || item.storagekey)}
        </code>
      </td>

      <td className="px-4 py-4 align-top">
        {item.downloadurl ? (
          <a
            href={item.downloadurl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-gray-200 transition hover:border-cyan-500 hover:text-cyan-400"
          >
            <Download size={13} />
            Open
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-gray-500 opacity-60"
          >
            <Download size={13} />
            Unavailable
          </button>
        )}
      </td>
    </tr>
  );
}