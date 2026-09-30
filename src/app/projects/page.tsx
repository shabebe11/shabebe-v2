import Image from "next/image";
import { PROJECTS, type Project } from "@/content/projects";

const ROW = "grid grid-cols-[6rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[9rem_1fr_auto] sm:gap-6";

export default function ProjectsPage() {
  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Projects</h1>

      <ul className="mt-10 border-t border-line">
        {PROJECTS.map((project, i) => (
          <li key={project.slug} className="border-b border-line">
            {project.href ? (
              <a href={project.href} target="_blank" rel="noreferrer" className={`group outline-none ${ROW}`}>
                <ProjectDetails project={project} priority={i === 0} />
                <span aria-hidden className="text-faint transition-colors duration-150 group-hover:text-chalk group-focus-visible:text-chalk">
                  ↗
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <div className={ROW}>
                <ProjectDetails project={project} priority={i === 0} />
                <span className="text-xs text-faint">Decomissioned :(</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

function ProjectDetails({ project, priority }: { project: Project; priority: boolean }) {
  return (
    <>
      <span className="relative flex aspect-video items-center justify-center overflow-hidden border border-line">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 640px) 144px, 96px"
            className="object-cover"
            fetchPriority={priority ? "high" : undefined}
          />
        ) : (
          <span className="font-display text-2xl font-medium text-faint">{project.title[0]}</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-faint">{project.year}</span>
        <span className="mt-1 block font-display text-3xl font-medium text-muted transition-colors duration-150 group-hover:text-chalk group-focus-visible:text-chalk">
          {project.title}
        </span>
        <span className="mt-1 block text-sm text-faint">{project.summary}</span>
        <span className="mt-2 block text-xs text-faint">{project.stack.join(" · ")}</span>
      </span>
    </>
  );
}
