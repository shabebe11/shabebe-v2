"use client";

import { useState } from "react";
import type { Pr } from "@/content/prs";
import { kg, LIFT_LABEL, LIFT_ORDER, LIFT_STRIP, shortDate } from "./format";

type Row = Pr & { gain: number | null };
type Filter = "all" | Pr["lift"];

const toIso = (date: string) => `${date}T12:00:00+12:00`;

export function PrTable({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: rows.length },
    ...LIFT_ORDER.map((lift) => ({ value: lift, label: LIFT_LABEL[lift], count: rows.filter((r) => r.lift === lift).length })),
  ];
  const visible = filter === "all" ? rows : rows.filter((r) => r.lift === filter);

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm text-muted">Every PR</h2>
        <div role="group" aria-label="Filter PRs by lift" className="flex flex-wrap gap-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`border px-3 py-1 text-xs transition-colors ${
                filter === option.value
                  ? "border-faint text-chalk"
                  : "border-line text-faint hover:border-faint hover:text-muted"
              }`}
            >
              {option.label}
              <span className="ml-1.5 text-faint">{option.count}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length ? (
        <table className="mt-4 w-full border-t border-line text-left text-sm">
          <thead className="text-xs text-faint">
            <tr className="border-b border-line">
              <th className="py-2 font-normal">Date</th>
              <th className="py-2 font-normal">Lift</th>
              <th className="py-2 text-right font-normal">Weight</th>
              <th className="py-2 text-right font-normal">Reps</th>
              <th className="py-2 text-right font-normal">Gain</th>
              <th className="hidden py-2 pl-6 font-normal md:table-cell">Note</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {visible.map((pr) => (
              <tr key={`${pr.lift}${pr.date}${pr.kg}${pr.reps}`} className="border-b border-line">
                <td className="py-3 text-faint">{shortDate(toIso(pr.date))}</td>
                <td className="py-3">
                  <span className="flex items-center gap-2 text-muted">
                    <span aria-hidden className={`size-2 ${LIFT_STRIP[pr.lift]}`} />
                    {LIFT_LABEL[pr.lift]}
                  </span>
                </td>
                <td className="py-3 text-right text-chalk">{kg(pr.kg)} kg</td>
                <td className="py-3 text-right text-muted">{pr.reps}</td>
                <td className="py-3 text-right text-muted">{pr.gain === null ? "first" : `+${kg(pr.gain)} kg`}</td>
                <td className="hidden py-3 pl-6 text-xs text-faint md:table-cell">{pr.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-sm text-faint">
          {rows.length ? `No ${filter === "all" ? "" : LIFT_LABEL[filter].toLowerCase()} PRs yet.` : "No PRs added yet."}
        </p>
      )}
    </section>
  );
}
