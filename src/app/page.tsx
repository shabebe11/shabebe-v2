import { SectionButton } from "@/components/buttons/SectionButton";

const LIFTS: { name: string; kg: number | null }[] = [
  { name: "squat", kg: null },
  { name: "bench", kg: null },
  { name: "deadlift", kg: null },
];

const TOTAL = LIFTS.every((lift) => lift.kg !== null)
  ? LIFTS.reduce((sum, lift) => sum + (lift.kg ?? 0), 0)
  : null;

export default function Home() {
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
          {[...LIFTS, { name: "total", kg: TOTAL }].map((lift) => (
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
