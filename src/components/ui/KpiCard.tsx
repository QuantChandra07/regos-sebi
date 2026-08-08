"use client";

import TrendingUp from "lucide-react/dist/esm/icons/trending-up";

interface KpiCardProps {
  title: string;
  value: string | number;
  hint?: string;
}

export function KpiCard({
  title,
  value,
  hint,
}: KpiCardProps) {
  return (
    <div className="kpi-card rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-sm">
      <p className="kpi-label text-xs uppercase tracking-[0.2em] text-zinc-400">
        {title}
      </p>

      <p className="kpi-value mt-3 text-3xl font-semibold text-white">
        {value}
      </p>

      {hint ? (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-400">
          <TrendingUp
            size={13}
            className="text-emerald-400"
          />
          <span>{hint}</span>
        </div>
      ) : null}
    </div>
  );
}

export default KpiCard;