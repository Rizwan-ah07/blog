"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, User, Home, Menu, X, Code2, Lock } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/about", label: "About", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 border border-purple-500/30 group-hover:bg-purple-600/30 group-hover:border-purple-500/60">
            <Code2 className="h-4 w-4 text-purple-400" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            Stage<span className="text-purple-400">Blog</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA & burger */}
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="hidden rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 md:inline-flex items-center gap-1.5 shadow-lg shadow-purple-900/30"
          >
            Read Posts
          </Link>
          <Link
            href="/admin"
            title="Admin"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-white/5 hover:text-purple-400 transition-colors"
          >
            <Lock className="h-4 w-4" />
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 hover:text-white md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#0a0a0a] px-4 pb-4 md:hidden">
          <ul className="mt-3 flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-purple-500/15 text-purple-400"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/blog"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-500"
          >
            Read Posts
          </Link>
        </div>
      )}
    </header>
  );
}
