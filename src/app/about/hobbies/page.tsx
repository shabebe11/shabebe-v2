import Link from "next/link";
import { Suspense } from "react";
import { TopTracks, TopTracksSkeleton } from "@/components/TopTracks";
import { HOBBIES } from "@/content/hobbies";

export const revalidate = 3600;

const STRIPS = ["bg-bench", "bg-squat", "bg-deadlift"];

export default function HobbiesPage() {
  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Hobbies</h1>

      {/* Side by side on wide screens so the whole page fits without scrolling. */}
      <div className="mt-10 grid gap-3 lg:grid-cols-[1fr_20rem]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {HOBBIES.map((hobby, i) => (
            <li
              key={hobby.name}
              className="group relative flex flex-col border border-line p-5 transition-colors duration-200 hover:border-faint"
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-0.5 opacity-30 transition-opacity duration-200 group-hover:opacity-100 ${STRIPS[i % STRIPS.length]}`}
              />
              <span className="text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-3 font-display text-4xl font-medium text-chalk">{hobby.name}</h2>
              <p className="mt-2 text-sm text-muted">{hobby.blurb}</p>
              {hobby.link && (
                <Link
                  href={hobby.link.href}
                  className="mt-auto pt-5 text-xs text-muted transition-colors hover:text-chalk"
                >
                  {hobby.link.label} →
                </Link>
              )}
            </li>
          ))}
        </ul>

        <section className="relative flex flex-col border border-line p-5">
          <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-total opacity-30" />
          <div>
            <span className="text-xs text-faint">{String(HOBBIES.length + 1).padStart(2, "0")}</span>
            <h2 className="mt-3 font-display text-4xl font-medium text-chalk">Music</h2>
            <p className="mt-2 text-xs text-faint">Most player over the last 4 weeks</p>
          </div>

          <Suspense fallback={<TopTracksSkeleton />}>
            <TopTracks />
          </Suspense>

          <p className="mt-auto pt-3 text-xs text-faint">via Spotify</p>
        </section>
      </div>
    </>
  );
}
