export type Project = {
  slug: string;
  title: string;
  year: number;
  summary: string;
  stack: string[];
  links: { label: string; href: string }[];
  // src is the path inside public/ with a leading slash, e.g. "/passport.png"; leave [] for no images.
  images: { src: string; alt: string }[];
  body: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "wdcc-passport",
    title: "WDCC Passport",
    year: 2026,
    summary: "Badge, packs, and cards app for WDCC events",
    stack: ["Next.js", "TypeScript", "Tailwind", "Drizzle", "Neon"],
    links: [{ label: "WDCC Passport", href: "https://passport.wdcc.co.nz" }],
    images: [{ src: "/passport.png", alt: "WDCC Passport" }, { src: "/passport2.png", alt: "passport2" }],
    body: [],
  },
  {
    slug: "aa-portal",
    title: "A&A Accounting Client Portal",
    year: 2026,
    summary: "CRM and client portal for A&A Accounting",
    stack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    links: [{ label: "A&A Accounting Client Portal", href: "https://aaaccountingportal.biz" }],
    images: [],
    body: [],
  },
  {
    slug: "rep-ranker",
    title: "Rep Ranker",
    year: 2025,
    summary: "Gym lift ranking app",
    stack: ["React", "Java Spring Boot", "CSS", "AWS S3", "AWS RDS",],
    links: [{ label: "Rep Ranker", href: "" }],
    images: [],
    body: ["Site has unfortunately been decommissioned"],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}
