import { SectionLayout } from "@/components/nav/SectionLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout>{children}</SectionLayout>;
}
