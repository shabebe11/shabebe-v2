export type Hobby = {
  name: string;
  blurb: string;
  link: { label: string; href: string } | null;
};

export const HOBBIES: Hobby[] = [
  { name: "Gym", blurb: "Placeholder: powerlifting, what you're training for.", link: { label: "Training log", href: "/trainingLog" } },
  { name: "Cars", blurb: "Placeholder: what you drive, or what you'd drive.", link: null },
  { name: "Baking", blurb: "Placeholder: what you make most.", link: null },
];
