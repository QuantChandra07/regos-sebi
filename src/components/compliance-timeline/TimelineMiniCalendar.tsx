"use client";

import React from "react";
import clsx from "clsx";
import { Card } from "../ui/Card";

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthGrid = [
  29, 30, 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 1, 2,
];

type TimelineMiniCalendarProps = {
  selectedDay?: number;
};

export function TimelineMiniCalendar({
  selectedDay = 22,
}: TimelineMiniCalendarProps) {
  return (
    <Card className="rounded-[24px] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Calendar
          </p>
          <p className="mt-2 text-base font-semibold text-white">Jul 2026</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-zinc-400">
          Replay mode
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500"
          >
            {day}
          </div>
        ))}

        {monthGrid.map((day, index) => {
          const isMuted = index < 2 || index > 32;
          const isSelected = day === selectedDay && !isMuted;
          const isHighlighted = [18, 20, 22, 23].includes(day) && !isMuted;

          return (
            <div
              key={`${day}-${index}`}
              className={clsx(
                "flex h-9 items-center justify-center rounded-xl border text-sm transition-all",
                isSelected
                  ? "border-cyan-400/40 bg-cyan-500/15 font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
                  : isHighlighted
                  ? "border-white/10 bg-white/[0.05] text-white"
                  : "border-transparent bg-transparent text-zinc-400",
                isMuted && "text-zinc-600"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </Card>
  );
}