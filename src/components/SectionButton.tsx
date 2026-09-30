"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

const NAVIGATE_DELAY_MS = 450;

const LIGHT_DELAYS = [
  "",
  "group-hover:delay-100 group-focus-visible:delay-100",
  "group-hover:delay-200 group-focus-visible:delay-200",
];

type SectionButtonProps = {
  href: string;
  text: string;
  attempt: 1 | 2 | 3;
};

export function SectionButton({ href, text, attempt }: SectionButtonProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function select(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (selected) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    setSelected(true);
    router.prefetch(href);
    timer.current = window.setTimeout(() => router.push(href), NAVIGATE_DELAY_MS);
  }

  function moveFocus(e: KeyboardEvent<HTMLAnchorElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const buttons = Array.from(document.querySelectorAll<HTMLElement>("[data-section-button]"));
    const index = buttons.indexOf(e.currentTarget);
    const step = e.key === "ArrowDown" ? 1 : -1;
    buttons[(index + step + buttons.length) % buttons.length]?.focus();
  }

  return (
    <Link
      href={href}
      onClick={select}
      onKeyDown={moveFocus}
      data-section-button
      className="group flex w-full items-center justify-between gap-5 py-1 outline-none"
    >
      <span
        className={`text-2xl uppercase tracking-wide transition-colors duration-150 group-hover:text-[#EDEBE4] group-focus-visible:text-[#EDEBE4] ${
          selected ? "text-[#EDEBE4]" : "text-[#888780]"
        }`}
      >
        {text}
      </span>
      <span aria-hidden className="flex gap-1.5">
        {LIGHT_DELAYS.map((delay, i) => (
          <span
            key={i}
            className={`size-2 rounded-full border transition-colors duration-150 ${delay} ${lightClasses(
              i < attempt ? "white" : "red",
              selected,
            )}`}
          />
        ))}
      </span>
    </Link>
  );
}

// Full class strings so Tailwind can see them at build time.
function lightClasses(colour: "white" | "red", on: boolean) {
  if (colour === "white") {
    return on
      ? "border-[#EDEBE4] bg-[#EDEBE4]"
      : "border-[#5F5E5A] group-hover:border-[#EDEBE4] group-hover:bg-[#EDEBE4] group-focus-visible:border-[#EDEBE4] group-focus-visible:bg-[#EDEBE4]";
  }
  return on
    ? "border-[#E24B4A] bg-[#E24B4A]"
    : "border-[#5F5E5A] group-hover:border-[#E24B4A] group-hover:bg-[#E24B4A] group-focus-visible:border-[#E24B4A] group-focus-visible:bg-[#E24B4A]";
}

export default SectionButton;
