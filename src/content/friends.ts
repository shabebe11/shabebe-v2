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
    name: "Jos Badenas",
    tagline: "Instagram influencer",
    href: "https://www.josbadenas.com",
    image: "/jos.png",
  },
  {
    name: "Koutaro Yumiba",
    tagline: "da goat",
    href: "https://koutaroyumiba.com/",
    image: "/kot.png",
  },
  {
    name: "Nicholas Garcia-Scholtz",
    tagline: "#1 C++ dev",
    href: "https://www.nicholasgarciascholtz.com",
    image: "/nic.png",
  },
];
