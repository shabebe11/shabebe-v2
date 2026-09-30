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
  ordinal: string;
};

export function SectionButton({ href, text, attempt, ordinal }: SectionButtonProps) {
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
      className="group grid grid-cols-[4.5rem_1fr_auto] items-center border-b border-line py-7 outline-none sm:grid-cols-[6rem_1fr_auto]"
    >
      <span className="text-faint">{ordinal}</span>
      <span
        className={`font-display text-4xl font-medium transition-colors duration-150 group-hover:text-chalk group-focus-visible:text-chalk sm:text-5xl ${
          selected ? "text-chalk" : "text-muted"
        }`}
      >
        {text}
      </span>
      <span aria-hidden className="flex gap-3">
        {LIGHT_DELAYS.map((delay, i) => (
          <span
            key={i}
            className={`size-4 rounded-full border-[1.5px] transition-colors duration-150 ${delay} ${lightClasses(
              i < attempt ? "white" : "red",
              selected,
            )}`}
          />
        ))}
      </span>
    </Link>
  );
}

function lightClasses(colour: "white" | "red", on: boolean) {
  if (colour === "white") {
    return on
      ? "border-chalk bg-chalk"
      : "border-faint group-hover:border-chalk group-hover:bg-chalk group-focus-visible:border-chalk group-focus-visible:bg-chalk";
  }
  return on
    ? "border-squat bg-squat"
    : "border-faint group-hover:border-squat group-hover:bg-squat group-focus-visible:border-squat group-focus-visible:bg-squat";
}

export default SectionButton;
