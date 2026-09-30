"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NestedButton } from "@/components/buttons/NestedButton";
import { moveNavFocus, SectionButton } from "@/components/buttons/SectionButton";
import { SECTIONS } from "./sections";

export function SectionSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections">
      <ul>
        <li className="border-b border-line">
          <Link
            href="/"
            onKeyDown={moveNavFocus}
            data-nav-button
            className="group grid grid-cols-[3.5rem_1fr] items-center py-4 outline-none"
          >
            <span className="text-faint transition-colors duration-150 group-hover:text-chalk group-focus-visible:text-chalk">
              ←
            </span>
            <span className="font-display text-3xl font-medium text-muted transition-colors duration-150 group-hover:text-chalk group-focus-visible:text-chalk">
              Home
            </span>
          </Link>
        </li>
        {SECTIONS.map(({ nested, ...section }) => {
          const open = pathname === section.href || pathname.startsWith(`${section.href}/`);
          return (
            <li key={section.href} className="border-b border-line">
              <SectionButton {...section} size="compact" />
              {open && nested && (
                <ul className="pb-4">
                  {nested.map((item) => (
                    <li key={item.href}>
                      <NestedButton {...item} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
