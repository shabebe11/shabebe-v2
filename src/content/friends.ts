export type Friend = {
  name: string;
  tagline: string;
  href: string | null;
  image: string | null;
  met?: string;
};

export const FRIENDS: Friend[] = [
  {
    name: "Aleck Shen",
    tagline: "Code lover",
    href: "https://aleckshen.com/",
    image: "/aleck.png",
  },
  {
    name: "Anton Garay",
    tagline: "Gave me a 20 comment PR review :(",
    href: "https://www.antga.dev",
    image: "/anton.png",
  },
  {
    name: "Koutaro Yumiba",
    tagline: "My goat fr",
    href: "https://koutaroyumiba.com/",
    image: "/kot.png",
  },
];
