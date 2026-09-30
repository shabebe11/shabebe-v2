import { SectionButton } from "@/components/SectionButton";

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
