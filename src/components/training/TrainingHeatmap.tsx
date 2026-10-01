"use client";

import { useState } from "react";

export type HeatmapCell = { key: string; label: string; workouts: number; sets: number } | null;

const CELL = 12;
const GAP = 2;
const LEVELS = ["#2c2c2a", "rgb(237 235 228 / 0.3)", "rgb(237 235 228 / 0.55)", "rgb(237 235 228 / 0.85)"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

function level(sets: number, max: number) {
  if (sets === 0 || max === 0) return 0;
  return Math.min(3, Math.max(1, Math.ceil((sets / max) * 3)));
}

export function TrainingHeatmap({ weeks, months }: { weeks: HeatmapCell[][]; months: { column: number; label: string }[] }) {
  const [hover, setHover] = useState<{ cell: NonNullable<HeatmapCell>; x: number; y: number } | null>(null);
  const max = Math.max(0, ...weeks.flat().map((c) => c?.sets ?? 0));
  const width = 28 + weeks.length * (CELL + GAP) + 24;
  const height = 18 + 7 * (CELL + GAP);

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-1">
        <svg width={width} height={height} role="img" aria-label="Training days over the last year" onPointerLeave={() => setHover(null)}>
          {months.map((m) => (
            <text key={m.column} x={28 + m.column * (CELL + GAP)} y={10} className="fill-faint text-[10px]">
              {m.label}
            </text>
          ))}
          {DAYS.map((d, row) =>
            d ? (
              <text key={row} x={0} y={18 + row * (CELL + GAP) + CELL - 2} className="fill-faint text-[10px]">
                {d}
              </text>
            ) : null,
          )}
          {weeks.map((week, column) =>
            week.map((cell, row) =>
              cell ? (
                <rect
                  key={cell.key}
                  x={28 + column * (CELL + GAP)}
                  y={18 + row * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={LEVELS[level(cell.sets, max)]}
                  className="transition-opacity hover:opacity-80"
                  onPointerEnter={(e) => {
                    const box = e.currentTarget.getBoundingClientRect();
                    const frame = e.currentTarget.ownerSVGElement!.parentElement!.parentElement!.getBoundingClientRect();
                    setHover({ cell, x: box.left - frame.left + CELL / 2, y: box.top - frame.top });
                  }}
                />
              ) : null,
            ),
          )}
        </svg>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-faint">
        Less
        {LEVELS.map((fill) => (
          <span key={fill} aria-hidden className="size-3 rounded-[2px]" style={{ background: fill }} />
        ))}
        More sets
      </div>
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full border border-line bg-background/95 px-3 py-2 text-xs whitespace-nowrap shadow-lg"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          <span className="font-medium text-chalk">
            {hover.cell.workouts ? `${hover.cell.sets} sets` : "Rest day"}
          </span>
          <span className="ml-2 text-faint">{hover.cell.label}</span>
        </div>
      )}
    </div>
  );
}
