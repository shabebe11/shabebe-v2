"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SECTIONS } from "./sections";

const PAGES = [
  ...new Set(["/", ...SECTIONS.flatMap((section) => section.nested?.map((item) => item.href) ?? [section.href])]),
];

export function KeyboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']")) return;

      const navButton = target.closest<HTMLElement>("[data-nav-button]");
      if (event.key === "ArrowRight" && navButton) {
        event.preventDefault();
        navButton.click();
        return;
      }

      if (event.key === "ArrowLeft" && pathname !== "/") {
        event.preventDefault();
        router.push("/");
        return;
      }

      if (event.key === "ArrowRight") {
        const parent = PAGES.filter((page) => page !== "/" && pathname.startsWith(`${page}/`)).at(-1);
        const index = PAGES.indexOf(PAGES.includes(pathname) ? pathname : (parent ?? ""));
        const next = index === -1 ? undefined : PAGES[index + 1];
        if (!next) return;
        event.preventDefault();
        router.push(next);
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (navButton) return;
        if (document.documentElement.scrollHeight > window.innerHeight) return;
        const buttons = [...document.querySelectorAll<HTMLElement>("[data-nav-button]")];
        const start = buttons.findLast((b) => b.getAttribute("aria-current") === "page") ?? buttons[0];
        if (!start) return;
        event.preventDefault();
        start.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);

  return null;
}
