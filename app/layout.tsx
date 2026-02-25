import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StageBlog — Internship Portfolio",
  description:
    "A professional internship portfolio blog documenting the journey, lessons learned, wins, and honest fails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0a0a0a] text-gray-100 antialiased`}
      >
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-white/5 bg-[#0a0a0a] py-8 text-center text-sm text-gray-600">
          <p>
            Built with{" "}
            <span className="text-purple-400">Next.js</span> &{" "}
            <span className="text-purple-400">Tailwind CSS</span> during internship
          </p>
        </footer>
      </body>
    </html>
  );
}
