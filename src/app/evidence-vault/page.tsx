"use client";

import React, { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../../components/ui/StateBlocks";
import { useEvidence } from "../../lib/hooks";
import { uploadEvidence } from "../../lib/api";
import {
  FileText,
  Search,
  ShieldCheck,
  Clock3,
  Download,
  Filter,
  CheckCircle2,
} from "lucide-react";

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

function formatTimestamp(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
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

export default function EvidenceVaultPage() {
  const { data, error, isLoading, mutate } = useEvidence();
  const [taskId, setTaskId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fileInputKey, setFileInputKey] = useState(0);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setUploadMsg("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    if (taskId.trim()) formData.append("task_id", taskId.trim());
    formData.append("file", file);

    try {
      setUploadMsg("Uploading...");
      await uploadEvidence(formData);
      setUploadMsg("Upload successful.");
      setFile(null);
      setTaskId("");
      setFileInputKey((prev) => prev + 1);
      await mutate();
    } catch (err: any) {
      setUploadMsg(err?.message || "Upload failed.");
    }
  }

  const items: EvidenceRowItem[] = data?.items ?? [];

  const filteredEvidence = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const status = item.reviewstatus || "PENDINGREVIEW";
      const matchesStatus = statusFilter === "ALL" || status === statusFilter;

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

      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [items, query, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      verified: items.filter((e) => e.reviewstatus === "VERIFIED").length,
      pending: items.filter((e) => (e.reviewstatus || "PENDINGREVIEW") === "PENDINGREVIEW").length,
      expired: items.filter((e) => e.reviewstatus === "EXPIRED").length,
    };
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="glass-panel rounded-[28px] border border-white/10 p-6 lg:p-7">
          <p className="section-label">Governance evidence layer</p>
          <h1 className="page-title mt-4">Evidence Vault</h1>
          <p className="page-subtitle">
            Review evidence items, upload supporting documents, and track verification state across
            workflow-linked controls.
          </p>
        </div>

        <Card className="rounded-[28px] p-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" type="button">
              <ShieldCheck size={14} />
              Export Register
            </Button>
            <Button type="submit" form="evidence-upload-form">
              <FileText size={14} />
              Upload Evidence
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
          onChange={(e) => setTaskId(e.target.value)}
        />
        <input
          key={fileInputKey}
          type="file"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="submit"
          className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-medium text-black"
        >
          Upload
        </button>
      </form>

      {uploadMsg ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          {uploadMsg}
        </div>
      ) : null}

      {isLoading ? <LoadingBlock label="Loading evidence..." /> : null}
      {error ? <ErrorBlock message={error.message} /> : null}

      {!isLoading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Files" value={stats.total} tone="cyan" icon={<FileText size={18} />} />
            <StatCard title="Verified" value={stats.verified} tone="emerald" icon={<CheckCircle2 size={18} />} />
            <StatCard title="Pending Review" value={stats.pending} tone="amber" icon={<Clock3 size={18} />} />
            <StatCard title="Expired" value={stats.expired} tone="red" icon={<ShieldCheck size={18} />} />
          </div>

          <Card className="rounded-[24px]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search file name, MIME type, storage key, task ID..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-9 pr-3 text-sm text-gray-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Filter size={14} className="text-zinc-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm text-gray-200 outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="PENDINGREVIEW">Pending Review</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>
          </Card>

          {!items.length ? (
            <EmptyBlock label="No evidence found." />
          ) : (
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
                      <th className="px-4 py-3">Storage Hash</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEvidence.length > 0 ? (
                      filteredEvidence.map((item) => <EvidenceRow key={item.id} item={item} />)
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-xs text-zinc-500">
                          No evidence items matched the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      ) : null}
    </div>
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
  icon: React.ReactNode;
}) {
  const toneMap = {
    cyan: "text-cyan-400 border-cyan-500/15 bg-cyan-500/10",
    emerald: "text-emerald-400 border-emerald-500/15 bg-emerald-500/10",
    amber: "text-amber-400 border-amber-500/15 bg-amber-500/10",
    red: "text-red-400 border-red-500/15 bg-red-500/10",
  };

  return (
    <Card className="rounded-[24px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${toneMap[tone]}`}>
          {icon}
        </div>
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
            <p className="font-medium text-gray-100">{fileLabel}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{item.mimetype || "Unknown MIME type"}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 align-top">
        <p className="font-medium text-gray-200">{item.taskid || "-"}</p>
        <p className="mt-1 text-[11px] text-zinc-500">Linked workflow task</p>
      </td>

      <td className="px-4 py-4 align-top">{item.mimetype || "-"}</td>
      <td className="px-4 py-4 align-top">
        <Badge label={status} />
      </td>
      <td className="px-4 py-4 align-top">{formatTimestamp(timestamp)}</td>
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