"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  ViewTransition,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

const LIGHTS_MS = 350;

const LIGHT_DELAYS = [
  "",
  "group-hover:delay-100 group-focus-visible:delay-100",
  "group-hover:delay-200 group-focus-visible:delay-200",
];

const SIZES = {
  large: {
    row: "grid-cols-[4.5rem_1fr_auto] border-b border-line py-7 sm:grid-cols-[6rem_1fr_auto]",
    text: "text-4xl sm:text-5xl",
    lights: "gap-3",
    light: "size-4",
  },
  compact: {
    row: "grid-cols-[3.5rem_1fr_auto] py-4",
    text: "text-3xl",
    lights: "gap-2",
    light: "size-3",
  },
};

type SectionButtonProps = {
  href: string;
  text: string;
  attempt: 1 | 2 | 3;
  ordinal: string;
  size?: keyof typeof SIZES;
};

export function SectionButton({ href, text, attempt, ordinal, size = "large" }: SectionButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const litAt = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const selected = pendingFrom === pathname;
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const on = selected || active;
  const s = SIZES[size];

  function select(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (size === "compact") return;
    e.preventDefault();
    if (selected) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    setPendingFrom(pathname);
    router.prefetch(href);
    const remaining = Math.max(0, LIGHTS_MS - (performance.now() - litAt.current));
    timer.current = window.setTimeout(() => router.push(href), remaining);
  }

  function lightUp() {
    litAt.current = performance.now();
    router.prefetch(href);
  }

  function focus(e: FocusEvent<HTMLAnchorElement>) {
    if (e.currentTarget.matches(":focus-visible")) lightUp();
  }

  return (
    <ViewTransition name={`section${href.replaceAll("/", "-")}`} share="morph" default="none">
    <Link
      href={href}
      onClick={select}
      onPointerEnter={lightUp}
      onFocus={focus}
      onKeyDown={moveNavFocus}
      data-nav-button
      aria-current={active ? "page" : undefined}
      className={`group grid items-center outline-none ${s.row}`}
    >
      <span className="text-faint">{ordinal}</span>
      <span
        className={`font-display font-medium transition-colors duration-150 group-hover:text-chalk group-focus-visible:text-chalk ${s.text} ${
          on ? "text-chalk" : "text-muted"
        }`}
      >
        {text}
      </span>
      <span aria-hidden className={`flex ${s.lights}`}>
        {LIGHT_DELAYS.map((delay, i) => (
          <span
            key={i}
            className={`rounded-full border-[1.5px] transition-colors duration-150 ${s.light} ${delay} ${lightClasses(
              i < attempt ? "white" : "red",
              on,
            )}`}
          />
        ))}
      </span>
    </Link>
    </ViewTransition>
  );
}

export function moveNavFocus(e: KeyboardEvent<HTMLAnchorElement>) {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  e.preventDefault();
  const buttons = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-button]"));
  const index = buttons.indexOf(e.currentTarget);
  const step = e.key === "ArrowDown" ? 1 : -1;
  buttons[(index + step + buttons.length) % buttons.length]?.focus();
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
