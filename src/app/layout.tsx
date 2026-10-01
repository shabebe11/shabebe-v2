import type { Metadata } from "next";
import { Big_Shoulders, Martian_Mono } from "next/font/google";
import { KeyboardNav } from "@/components/nav/KeyboardNav";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  axes: ["opsz"],
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shuaib Al Khudairi",
  description: "Shuaib Al Khudairi portfolio",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${martianMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono">
        {children}
        <KeyboardNav />
      </body>
    </html>
  );
}
