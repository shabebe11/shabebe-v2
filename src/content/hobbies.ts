export type Hobby = {
  name: string;
  blurb: string;
  link: { label: string; href: string } | null;
};

export const HOBBIES: Hobby[] = [
  { name: "Gym", blurb: "", link: { label: "Training log", href: "/trainingLog" } },
  { name: "Basketball", blurb: "", link: null },
  { name: "Baking", blurb: "", link: null },
];
