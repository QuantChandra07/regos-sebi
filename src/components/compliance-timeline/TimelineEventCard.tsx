"use client";

import React from "react";
import clsx from "clsx";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import type { LucideIcon } from "lucide-react";

type TimelineEventTone =
  | "regulatory"
  | "evidence"
  | "risk"
  | "workflow"
  | "obligation"
  | "neutral";

type TimelineEventCardProps = {
  title: string;
  description: string;
  dateLabel?: string;
  status?: string;
  meta?: string;
  icon: LucideIcon;
  tone?: TimelineEventTone;
  className?: string;
};

const toneStyles: Record<TimelineEventTone, string> = {
  regulatory:
    "border-cyan-500/20 bg-gradient-to-br from-cyan-500/12 via-sky-500/8 to-transparent",
  evidence:
    "border-emerald-500/20 bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-transparent",
  risk:
    "border-rose-500/20 bg-gradient-to-br from-rose-500/12 via-orange-500/10 to-transparent",
  workflow:
    "border-violet-500/20 bg-gradient-to-br from-violet-500/12 via-fuchsia-500/8 to-transparent",
  obligation:
    "border-amber-500/20 bg-gradient-to-br from-amber-500/12 via-yellow-500/8 to-transparent",
  neutral:
    "border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent",
};

const iconStyles: Record<TimelineEventTone, string> = {
  regulatory: "border-cyan-400/20 bg-cyan-500/12 text-cyan-300",
  evidence: "border-emerald-400/20 bg-emerald-500/12 text-emerald-300",
  risk: "border-rose-400/20 bg-rose-500/12 text-rose-300",
  workflow: "border-violet-400/20 bg-violet-500/12 text-violet-300",
  obligation: "border-amber-400/20 bg-amber-500/12 text-amber-300",
  neutral: "border-white/10 bg-white/5 text-zinc-300",
};

export function TimelineEventCard({
  title,
  description,
  dateLabel,
  status,
  meta,
  icon: Icon,
  tone = "neutral",
  className,
}: TimelineEventCardProps) {
  return (
    <Card
      className={clsx(
        "rounded-[24px] border p-5 backdrop-blur-xl",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.045]",
        toneStyles[tone],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={clsx(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
              iconStyles[tone]
            )}
          >
            <Icon size={18} />
          </div>

          <div className="min-w-0">
            {dateLabel ? (
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                {dateLabel}
              </p>
            ) : null}

            <h3 className="mt-1 text-sm font-semibold leading-6 text-white sm:text-base">
              {title}
            </h3>
          </div>
        </div>

        {status ? <Badge label={status} className="shrink-0" /> : null}
      </div>

      <p className="mt-4 text-sm leading-7 text-zinc-300">{description}</p>

      {meta ? (
        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{meta}</p>
        </div>
      ) : null}
    </Card>
  );
}