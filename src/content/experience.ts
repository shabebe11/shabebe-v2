export type Role = {
  title: string;
  start: string;
  end: string | null;
  summary?: string;
};

export type Experience = {
  org: string;
  link?: string;
  logo?: string;
  roles: Role[];
};

export const EXPERIENCE: Experience[] = [
  {
    org: "Atlassian",
    link: "https://www.atlassian.com",
    logo: "/atlassian.png",
    roles: [{ title: "Software Engineering Intern", start: "2026-11", end: null }],
  },
  {
    org: "Web, Design, and Coding Club (WDCC)",
    link: "https://wdcc.co.nz",
    logo: "/wdcc.png",
    roles: [
      { title: "Co-President", start: "2026-09", end: null },
      { title: "Technical Executive", start: "2025-11", end: null },
    ],
  },
  {
    org: "A&A Accounting",
    logo: "/aa.png",
    roles: [{ title: "Computer Science Intern", start: "2026-02", end: "2026-09" }],
  },
];
