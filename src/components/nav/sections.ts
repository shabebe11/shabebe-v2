import { PROJECTS } from "@/content/projects";

export type Section = {
  href: string;
  text: string;
  attempt: 1 | 2 | 3;
  ordinal: string;
  nested?: { href: string; text: string }[];
};

export const SECTIONS: Section[] = [
  {
    href: "/about",
    text: "About",
    attempt: 1,
    ordinal: "1st",
    nested: [
      { href: "/about", text: "Personal" },
      { href: "/about/hobbies", text: "Hobbies" },
      { href: "/about/skills", text: "Skills" },
      { href: "/about/friends", text: "Friends" },
    ],
  },
  {
    href: "/projects",
    text: "Projects",
    attempt: 2,
    ordinal: "2nd",
    nested: [
      { href: "/projects", text: "All projects" },
      ...PROJECTS.map((project) => ({ href: `/projects/${project.slug}`, text: project.title })),
    ],
  },
  {
    href: "/trainingLog",
    text: "Training log",
    attempt: 3,
    ordinal: "3rd",
    nested: [
      { href: "/trainingLog", text: "PRs" },
      { href: "/trainingLog/history", text: "PR history" },
      { href: "/trainingLog/workouts", text: "Workouts" },
    ],
  },
];
