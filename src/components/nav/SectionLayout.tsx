import type { ReactNode } from "react";
import { SectionSidebar } from "./SectionSidebar";

export function SectionLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid w-full flex-1 items-start gap-12 px-6 py-16 md:grid-cols-[20rem_1fr] md:gap-16 md:px-12 lg:gap-24">
      <div className="md:sticky md:top-16">
        <SectionSidebar />
      </div>
      <div className="max-w-4xl">{children}</div>
    </main>
  );
}
