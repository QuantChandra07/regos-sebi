"use client";

import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export function LoadingBlock({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex min-h-32 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 p-6 text-sm text-zinc-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <Loader2
          size={17}
          className="animate-spin text-cyan-400"
        />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function ErrorBlock({
  message,
}: {
  message: string;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-sm text-red-200"
      role="alert"
    >
      <AlertCircle
        size={18}
        className="mt-0.5 shrink-0 text-red-400"
      />

      <div>
        <p className="font-semibold text-red-300">
          Something went wrong
        </p>

        <p className="mt-1 break-words text-red-200/80">
          {message}
        </p>
      </div>
    </div>
  );
}

export function EmptyBlock({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-950 p-8 text-center text-sm text-zinc-400">
      <Inbox
        size={22}
        className="mb-3 text-zinc-600"
      />
      <p>{label}</p>
    </div>
  );
}

export default {
  LoadingBlock,
  ErrorBlock,
  EmptyBlock,
};