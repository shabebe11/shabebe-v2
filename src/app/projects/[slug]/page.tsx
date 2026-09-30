import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, PROJECTS } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await props.params).slug);
  return { title: project ? `${project.title} · Shuaib Al Khudairi` : "Project" };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const project = getProject((await props.params).slug);
  if (!project) notFound();

  return (
    <article className="max-w-2xl">
      <Link href="/projects" className="text-sm text-faint transition-colors hover:text-chalk">
        ← all projects
      </Link>

      <h1 className="mt-6 font-display text-6xl font-medium text-chalk">{project.title}</h1>
      <p className="mt-4 text-lg text-muted">{project.summary}</p>

      {project.images.length > 0 && (
        <ul className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto">
          {project.images.map((image, i) => (
            <li
              key={image.src}
              className="relative aspect-video w-[min(100%,42vh)] shrink-0 snap-start overflow-hidden border border-line"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 42vh, 100vw"
                className="object-cover"
                fetchPriority={i === 0 ? "high" : undefined}
              />
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-8 grid gap-6 border-y border-line py-6 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-faint">year</dt>
          <dd className="mt-1 text-chalk">{project.year}</dd>
        </div>
        <div>
          <dt className="text-faint">stack</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="border border-line px-2 py-0.5 text-xs text-muted">
                {tech}
              </span>
            ))}
          </dd>
        </div>
        {project.links.length > 0 && (
          <div>
            <dt className="text-faint">links</dt>
            <dd className="mt-1 flex flex-col gap-1">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-chalk underline decoration-line underline-offset-4 transition-colors hover:decoration-chalk"
                >
                  {link.label} ↗
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-10 space-y-5 leading-relaxed text-muted">
        {project.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
