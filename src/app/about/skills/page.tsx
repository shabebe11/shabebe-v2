import type { CSSProperties } from "react";
import { SKILLS } from "@/content/skills";

export default function SkillsPage() {
  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Skills</h1>

      <div className="mt-10 border-t border-line">
        {SKILLS.map(({ group, items }) => (
          <section
            key={group}
            className="grid gap-4 border-b border-line py-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
          >
            <h2 className="flex items-baseline justify-between text-sm text-faint sm:flex-col sm:justify-start sm:gap-1">
              {group}
              <span className="font-display text-2xl text-line">{String(items.length).padStart(2, "0")}</span>
            </h2>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((skill) => (
                <li
                  key={skill.name}
                  style={{ "--brand": skill.colour } as CSSProperties}
                  className="group flex items-center gap-3 border border-line px-3 py-3 transition-colors duration-200 hover:border-faint"
                >
                  <span
                    aria-hidden
                    style={{ maskImage: `url(${skill.icon})`, WebkitMaskImage: `url(${skill.icon})` }}
                    className="size-6 shrink-0 bg-current text-faint transition-colors duration-200 mask-contain mask-center mask-no-repeat group-hover:text-(--brand)"
                  />
                  <span className="text-sm text-muted transition-colors duration-200 group-hover:text-chalk">
                    {skill.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
