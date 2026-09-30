export type Project = {
  slug: string;
  title: string;
  year: number;
  summary: string;
  stack: string[];
  href: string | null;
  image: string | null;
};

export const PROJECTS: Project[] = [
  {
    slug: "wdcc-passport",
    title: "WDCC Passport",
    year: 2026,
    summary: "Badge, packs, and cards app for WDCC events",
    stack: ["Next.js", "TypeScript", "Tailwind", "Drizzle", "Neon"],
    href: "https://passport.wdcc.co.nz",
    image: "/passport.png",
  },
  {
    slug: "aa-portal",
    title: "A&A Accounting Client Portal",
    year: 2026,
    summary: "CRM and client portal for A&A Accounting",
    stack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    href: "https://aaaccountingportal.biz",
    image: null,
  },
  {
    slug: "rep-ranker",
    title: "Rep Ranker",
    year: 2025,
    summary: "Gym lift ranking app",
    stack: ["React", "Java Spring Boot", "CSS", "AWS S3", "AWS RDS"],
    href: null,
    image: null,
  },
];
