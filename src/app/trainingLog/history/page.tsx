import { LiftChart, type ChartSeries } from "@/components/training/LiftChart";
import { LIFT_CHART_COLOUR, LIFT_LABEL, LIFT_ORDER } from "@/components/training/format";
import { PrTable } from "@/components/training/PrTable";
import { getPrHistory } from "@/server/hevy/actions";

export const revalidate = 3600;

export default async function HistoryPage() {
  const prs = (await getPrHistory()).sort((a, b) => a.date.localeCompare(b.date));

  const series: ChartSeries[] = LIFT_ORDER.map((lift) => ({
    key: lift,
    label: LIFT_LABEL[lift],
    colour: LIFT_CHART_COLOUR[lift],
    points: prs.filter((pr) => pr.lift === lift).map((pr) => ({ date: pr.date, value: pr.weightKg })),
  })).filter((s) => s.points.length > 0);

  const table = prs
    .map((pr, i) => {
      const previous = prs.slice(0, i).filter((p) => p.lift === pr.lift).at(-1);
      return { ...pr, gain: previous ? pr.weightKg - previous.weightKg : null };
    })
    .reverse();

  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">PRs</h1>

      <section className="mt-10">
        <LiftChart series={series} label="PR weight over time for each lift" stepped />
      </section>

      <PrTable rows={table} />
    </>
  );
}
