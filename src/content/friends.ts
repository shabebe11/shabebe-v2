export type Friend = {
  name: string;
  tagline: string;
  met: string;
  links: { label: string; href: string }[];
  image: string | null;
};

export const FRIENDS: Friend[] = [
   {
    name: "Aleck Shen",
    tagline: "Code lover",
    met: "University",
    links: [{ label: "Site", href: "https://aleckshen.com/" }],
    image: null,
  },
  {
    name: "Anton Garay",
    tagline: "Gave me a 20 comment PR review :(",
    met: "University",
    links: [{ label: "Site", href: "https://www.antga.dev" }],
    image: null,
  },
  {
    name: "Koutaro Yumiba",
    tagline: "My goat fr",
    met: "University",
    links: [{ label: "Site", href: "https://koutaroyumiba.com/" }],
    image: null,
  },
];
