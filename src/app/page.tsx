import { SectionButton } from "@/components/buttons/SectionButton";
import { getBigThree } from "@/server/hevy/actions";

const COMPETITION = "2027-08-01";

const todayFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland" });

function daysUntil(date: string) {
  const today = Date.parse(todayFormat.format(new Date()));
  return Math.max(0, Math.round((Date.parse(date) - today) / 86_400_000));
}

export default async function Home() {
  const lifts = await getBigThree();
  const daysLeft = daysUntil(COMPETITION);

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-16 px-6 py-16 md:grid-cols-2 md:gap-12 md:px-12">
      <section>
        <h1 className="font-display text-7xl font-medium leading-[0.95] text-chalk sm:text-8xl">
          Shuaib
          <br />
          Al Khudairi
        </h1>
        <p className="mt-6 text-lg text-muted">Part time coder, Full time lifter</p>

        <dl className="mt-12 grid max-w-lg grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
          {(["squat", "bench", "deadlift", "total"] as const).map((name) => ({ name, kg: lifts[name] })).map((lift) => (
            <div key={lift.name}>
              <dt className="flex items-center gap-2 text-sm text-muted">
                {lift.name}
              </dt>
              <dd className="mt-2 font-display text-4xl font-medium text-chalk">
                {lift.kg ?? "—"}
                <span className="ml-1 font-mono text-sm text-faint">kg</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex max-w-lg items-baseline justify-between border-t border-line pt-6">
          <p className="text-sm text-muted">time till competition</p>
          <p className="font-display text-4xl font-medium text-chalk">
            {daysLeft}
            <span className="ml-1 font-mono text-sm text-faint">{daysLeft === 1 ? "day" : "days"}</span>
          </p>
        </div>
      </section>

      <nav aria-label="Sections">
        <ul className="mt-4">
          <li>
            <SectionButton href="/about" text="About" attempt={1} ordinal="1st" />
          </li>
          <li>
            <SectionButton href="/projects" text="Projects" attempt={2} ordinal="2nd" />
          </li>
          <li>
            <SectionButton href="/trainingLog" text="Training log" attempt={3} ordinal="3rd" />
          </li>
        </ul>
      </nav>
    </main>
  );
}
