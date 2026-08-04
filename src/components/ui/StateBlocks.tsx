"use client";

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-sm text-zinc-300">
      {label}
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-sm text-red-200">
      {message}
    </div>
  );
}

export function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950 p-8 text-center text-sm text-zinc-400">
      {label}
    </div>
  );
}