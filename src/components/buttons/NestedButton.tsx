"use client";

import Link from "next/link";
import { NAV_HIGHLIGHT, NAV_NUDGE, NavPointer } from "@/components/nav/NavPointer";
import { usePathname } from "next/navigation";
import { moveNavFocus } from "./SectionButton";

type NestedButtonProps = {
  href: string;
  text: string;
};

export function NestedButton({ href, text }: NestedButtonProps) {
  const active = usePathname() === href;

  return (
    <Link
      href={href}
      onKeyDown={moveNavFocus}
      data-nav-button
      aria-current={active ? "page" : undefined}
      className={`group relative block py-1.5 pl-14 font-display text-xl font-medium outline-none transition-colors duration-150 hover:text-chalk focus-visible:text-chalk before:left-11 ${NAV_HIGHLIGHT} ${
        active ? "text-chalk" : "text-faint"
      }`}
    >
      <NavPointer className="left-8" />
      <span className={`inline-block ${NAV_NUDGE}`}>{text}</span>
    </Link>
  );
}

export default NestedButton;
