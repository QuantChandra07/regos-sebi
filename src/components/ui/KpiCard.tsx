"use client";

export function KpiCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-zinc-400">{hint}</p> : null}
    </div>
  );
}