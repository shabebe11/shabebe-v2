"use client";

import Link from "next/link";
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
      className={`block py-1.5 pl-14 font-display text-xl font-medium outline-none transition-colors duration-150 hover:text-chalk focus-visible:text-chalk ${
        active ? "text-chalk" : "text-faint"
      }`}
    >
      {text}
    </Link>
  );
}

export default NestedButton;
