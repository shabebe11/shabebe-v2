"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { kg, shortDate } from "./format";

export type ChartSeries = {
  key: string;
  label: string;
  colour: string;
  points: { date: string; value: number }[];
};

const HEIGHT = 280;
const PAD = { top: 16, right: 128, bottom: 32, left: 44 };
const SURFACE = "#111110";
const monthTick = new Intl.DateTimeFormat("en-NZ", { timeZone: "Pacific/Auckland", month: "short" });

function niceTicks(min: number, max: number, count = 4) {
  const raw = (max - min) / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

function valueAt(points: { time: number; value: number }[], time: number) {
  let found: { time: number; value: number } | null = null;
  for (const point of points) {
    if (point.time <= time) found = point;
    else break;
  }
  return found;
}

export function LiftChart({
  series,
  label,
  stepped = false,
}: {
  series: ChartSeries[];
  label: string;
  stepped?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const model = useMemo(() => {
    const lines = series.map((s) => ({
      ...s,
      points: s.points.map((p) => ({ time: new Date(p.date).getTime(), value: p.value })).sort((a, b) => a.time - b.time),
    }));
    const times = [...new Set(lines.flatMap((l) => l.points.map((p) => p.time)))].sort((a, b) => a - b);
    const values = lines.flatMap((l) => l.points.map((p) => p.value));
    if (times.length === 0) return null;
    const ticks = niceTicks(Math.min(...values) - 2, Math.max(...values) + 2);
    const months: number[] = [];
    const cursor = new Date(times[0]);
    cursor.setUTCDate(1);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    while (cursor.getTime() <= times.at(-1)!) {
      months.push(cursor.getTime());
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return { lines, times, ticks, months };
  }, [series]);

  if (!model) {
    return <p className="border border-line p-6 text-sm text-faint">No lifts logged yet.</p>;
  }

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const [t0, t1] = [model.times[0], model.times.at(-1)!];
  const [v0, v1] = [model.ticks[0], model.ticks.at(-1)!];
  const x = (t: number) => PAD.left + (t1 === t0 ? plotW / 2 : ((t - t0) / (t1 - t0)) * plotW);
  const y = (v: number) => PAD.top + plotH - ((v - v0) / (v1 - v0)) * plotH;

  const hoverTime = hover === null ? null : model.times[hover];

  function pick(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    let best = 0;
    model!.times.forEach((t, i) => {
      if (Math.abs(x(t) - px) < Math.abs(x(model!.times[best]) - px)) best = i;
    });
    setHover(best);
  }

  function step(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const last = model!.times.length - 1;
    setHover((h) => {
      if (h === null) return event.key === "ArrowLeft" ? last : 0;
      return Math.min(last, Math.max(0, h + (event.key === "ArrowRight" ? 1 : -1)));
    });
  }

  const tooltipLeft = hoverTime === null ? 0 : x(hoverTime);
  const flip = tooltipLeft > width - 200;

  return (
    <div>
      {model.lines.length > 1 && (
        <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          {model.lines.map((line) => (
            <li key={line.key} className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-4 rounded-full" style={{ background: line.colour }} />
              {line.label}
            </li>
          ))}
        </ul>
      )}
      <div ref={frame} className="relative" style={{ height: HEIGHT }}>
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={label}
            tabIndex={0}
            className="outline-none focus-visible:ring-1 focus-visible:ring-faint"
            onPointerMove={pick}
            onPointerLeave={() => setHover(null)}
            onKeyDown={step}
            onBlur={() => setHover(null)}
          >
            {model.ticks.map((tick) => (
              <g key={tick}>
                <line x1={PAD.left} x2={PAD.left + plotW} y1={y(tick)} y2={y(tick)} stroke="#2c2c2a" strokeWidth={1} />
                <text x={PAD.left - 10} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-faint text-[11px] tabular-nums">
                  {kg(tick)}
                </text>
              </g>
            ))}
            {model.months.map((m) => (
              <text key={m} x={x(m)} y={HEIGHT - 10} textAnchor="middle" className="fill-faint text-[11px]">
                {monthTick.format(new Date(m))}
              </text>
            ))}
            {hoverTime !== null && (
              <line x1={x(hoverTime)} x2={x(hoverTime)} y1={PAD.top} y2={PAD.top + plotH} stroke="#8C8B85" strokeWidth={1} />
            )}
            {model.lines.map((line) => {
              const d = line.points
                .map((p, i) =>
                  i === 0
                    ? `M${x(p.time)},${y(p.value)}`
                    : stepped
                      ? `H${x(p.time)}V${y(p.value)}`
                      : `L${x(p.time)},${y(p.value)}`,
                )
                .join(" ");
              const end = line.points.at(-1)!;
              const active = hoverTime === null ? null : valueAt(line.points, hoverTime);
              return (
                <g key={line.key}>
                  <path d={d} fill="none" stroke={line.colour} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx={x(end.time)} cy={y(end.value)} r={4} fill={line.colour} stroke={SURFACE} strokeWidth={2} />
                  <text x={x(end.time) + 10} y={y(end.value)} dy="0.32em" className="fill-muted text-[12px]">
                    {line.label} {kg(end.value)}
                  </text>
                  {active && (
                    <circle cx={x(active.time)} cy={y(active.value)} r={5} fill={line.colour} stroke={SURFACE} strokeWidth={2} />
                  )}
                </g>
              );
            })}
          </svg>
        )}
        {hoverTime !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-36 border border-line bg-background/95 px-3 py-2 text-xs shadow-lg"
            style={flip ? { right: width - tooltipLeft + 12 } : { left: tooltipLeft + 12 }}
          >
            <p className="text-faint">{shortDate(new Date(hoverTime).toISOString())}</p>
            <ul className="mt-1 space-y-1">
              {model.lines.map((line) => {
                const active = valueAt(line.points, hoverTime);
                return (
                  <li key={line.key} className="flex items-center gap-2">
                    <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: line.colour }} />
                    <span className="font-medium text-chalk">{active ? `${kg(active.value)} kg` : "—"}</span>
                    <span className="text-faint">{line.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
