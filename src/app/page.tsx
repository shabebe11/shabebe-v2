import Image from "next/image";
import { SectionButton } from "@/components/SectionButton";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <main>
         <div>
         <p>Shuaib Al Khudairi</p>
         </div>

         <SectionButton href="/about" text="About" attempt={1} />
         <SectionButton href="/projects" text="Projects" attempt={2} />
        <SectionButton href="/trainingLog" text="Training Log" attempt={3} />
      </main>
    </div>
  );
}
