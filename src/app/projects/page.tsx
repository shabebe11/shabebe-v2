import Link from "next/link";
import { PROJECTS } from "@/content/projects";

export default function ProjectsPage() {
  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Projects</h1>

      <ul className="mt-10 border-t border-line">
        {PROJECTS.map((project) => (
          <li key={project.slug} className="border-b border-line">
            <Link
              href={`/projects/${project.slug}`}
              className="group grid gap-2 py-6 outline-none sm:grid-cols-[4.5rem_1fr_auto] sm:items-baseline sm:gap-6"
            >
              <span className="text-sm text-faint">{project.year}</span>
              <span>
                <span className="block font-display text-3xl font-medium text-muted transition-colors duration-150 group-hover:text-chalk group-focus-visible:text-chalk">
                  {project.title}
                </span>
                <span className="mt-1 block text-sm text-faint">{project.summary}</span>
              </span>
              <span className="text-xs text-faint">{project.stack.join(" · ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
