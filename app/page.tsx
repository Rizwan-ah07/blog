import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, BarChart3, Database, Cloud } from "lucide-react";
import BlogPostCard from "./components/BlogPostCard";
import { getAllPosts, getFeaturedPost, getAllAvailableTags } from "@/lib/db";
import { buildTagColorMap } from "@/lib/tagColors";

export const dynamic = "force-dynamic";

const highlights = [
  {
    icon: BarChart3,
    label: "Power BI",
    desc: "Building dashboards and reports, learning DAX, and turning raw data into visual insights.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Database,
    label: "SAP",
    desc: "Navigating the SAP ecosystem — modules, transactions, and how the business runs behind the scenes.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Cloud,
    label: "Cloud Platform Integration",
    desc: "Exploring cloud services and how they connect with on-premise systems in a real business environment.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
];

export default async function HomePage() {
  const [allPosts, featured, tagEntries] = await Promise.all([
    getAllPosts(),
    getFeaturedPost(),
    getAllAvailableTags(),
  ]);
  const latest = allPosts.slice(0, 1);
  const tagColorMap = buildTagColorMap(tagEntries);

  return (
    <div className="space-y-12 md:space-y-20">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-6 pb-4 sm:pt-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-purple-700/10 blur-3xl"
        />
        <div className="relative flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            Internship 2026
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Every Sprint.{" "}
            <span className="gradient-text">Every Lesson.</span>
            <br />
            Documented.
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed">
            Welcome to my internship portfolio blog. I&apos;m documenting the
            journey of my internship. Where I am learning Power BI, navigating SAP,
            and exploring cloud platform integrations in a real business environment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 hover:bg-purple-500 active:scale-95"
            >
              <BookOpen className="h-4 w-4" />
              Explore the Blog
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-white/20 hover:bg-white/8 hover:text-white active:scale-95"
            >
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* ── What You'll Find ── */}
      <section>
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="text-2xl font-bold text-white">What You&apos;ll Find Here</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`rounded-2xl border p-5 ${bg} flex flex-col gap-3`}>
              <div className={`w-fit rounded-lg border p-2 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="font-semibold text-white">{label}</p>
                <p className="mt-1 text-sm text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Post ── */}
      {featured && (
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-y-2">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Post</h2>
            <p className="mt-1 text-sm text-gray-500">Start here.</p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1">
            All posts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <BlogPostCard post={featured} featured tagColorMap={tagColorMap} />
      </section>
      )}

      {/* ── Latest Posts ── */}
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-y-2">
          <div>
            <h2 className="text-2xl font-bold text-white">Latest Posts</h2>
            <p className="mt-1 text-sm text-gray-500">{allPosts.length} posts and counting.</p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {latest.map((post) => (
            <BlogPostCard key={post.slug} post={post} tagColorMap={tagColorMap} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent p-5 sm:p-8 text-center">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-purple-700/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-700/10 blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Follow the Journey</h2>
          <p className="mt-3 text-gray-400 max-w-lg mx-auto">
            New posts every week documenting progress, setbacks, and everything in between during my intership.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 hover:bg-purple-500"
            >
              Explore All Posts <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-white/20 hover:text-white"
            >
              Read My Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
