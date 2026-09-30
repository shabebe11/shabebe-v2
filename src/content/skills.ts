export type Skill = {
  name: string;
  // SVG in public/icons/skills/, drawn as a single-colour silhouette.
  icon: string;
  // Brand colour the icon lights up in on hover.
  colour: string;
};

export const SKILLS: { group: string; items: Skill[] }[] = [
  {
    group: "languages",
    items: [
      { name: "JavaScript", icon: "/icons/skills/javascript.svg", colour: "#F0DB4F" },
      { name: "TypeScript", icon: "/icons/skills/typescript.svg", colour: "#3178C6" },
      { name: "Java", icon: "/icons/skills/java.svg", colour: "#EA2D2E" },
      { name: "SQL", icon: "/icons/skills/sql.svg", colour: "#00758F" },
    ],
  },
  {
    group: "frontend",
    items: [
      { name: "React", icon: "/icons/skills/react.svg", colour: "#61DAFB" },
      { name: "Next.js", icon: "/icons/skills/nextjs.svg", colour: "#EDEBE4" },
    ],
  },
  {
    group: "backend",
    items: [
      { name: "Node.js", icon: "/icons/skills/nodejs.svg", colour: "#5FA04E" },
      { name: "Express", icon: "/icons/skills/express.svg", colour: "#EDEBE4" },
      { name: "Spring Boot", icon: "/icons/skills/springboot.svg", colour: "#6DB33F" },
    ],
  },
  {
    group: "data",
    items: [
      { name: "Supabase", icon: "/icons/skills/supabase.svg", colour: "#3ECF8E" },
      { name: "Neon", icon: "/icons/skills/neon.svg", colour: "#00E599" },
      { name: "Drizzle", icon: "/icons/skills/drizzle.svg", colour: "#C5F74F" },
    ],
  },
  {
    group: "cloud & tools",
    items: [
      { name: "AWS", icon: "/icons/skills/aws.svg", colour: "#FF9900" },
      { name: "Git", icon: "/icons/skills/git.svg", colour: "#F34F29" },
    ],
  },
];
