"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Tag, X } from "lucide-react";
import BlogPostCard from "@/app/components/BlogPostCard";
import type { Post } from "@/lib/posts";
import {
  type TagEntry,
  buildTagColorMap,
  getFilterCls,
  getFilterActiveCls,
} from "@/lib/tagColors";

type Props = {
  posts: Post[];
  tagEntries: TagEntry[];
  isAdmin: boolean;
};

// Internship starts Monday 2 Feb 2026
const INTERNSHIP_START = new Date("2026-02-02T00:00:00.000Z");

function getWeekNumber(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00.000Z");
  const diffMs = d.getTime() - INTERNSHIP_START.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

function weekDateRange(weekNum: number): string {
  const start = new Date(INTERNSHIP_START.getTime() + (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function BlogFeed({ posts, tagEntries, isAdmin }: Props) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const tagColorMap = useMemo(() => buildTagColorMap(tagEntries), [tagEntries]);

  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const matchesTags =
          activeTags.length === 0 ||
          activeTags.some((tag) => post.tags.includes(tag));
        const matchesSearch =
          search.trim() === "" ||
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase());
        return matchesTags && matchesSearch;
      }),
    [activeTags, search, posts]
  );

  const toggleTag = (tag: string) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const hasFilters = activeTags.length > 0 || search.trim() !== "";
  const clear = () => {
    setActiveTags([]);
    setSearch("");
  };

  // Group filtered posts by week number (descending)
  const grouped = useMemo(() => {
    const map = new Map<number, Post[]>();
    for (const post of filtered) {
      const wk = getWeekNumber(post.date);
      if (!map.has(wk)) map.set(wk, []);
      map.get(wk)!.push(post);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">The Blog</h1>
          <p className="mt-1 text-sm text-gray-500">
            {posts.length} post{posts.length !== 1 ? "s" : ""} documenting my Stage/WPL internship journey.
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 shrink-0"
          >
            + New Post
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-white/4 py-2.5 pl-9 pr-4 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium uppercase tracking-widest">
              <Tag className="h-3 w-3" />
              Filter by tag
            </p>
            {hasFilters && (
              <button
                onClick={clear}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {tagEntries.map(({ name, color }) => {
              const isActive = activeTags.includes(name);
              const cls = isActive ? getFilterActiveCls(color) : getFilterCls(color);
              return (
                <button
                  key={name}
                  onClick={() => toggleTag(name)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${cls}`}
                >
                  {isActive && <span className="mr-1">✓</span>}
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        {filtered.length === posts.length
          ? `All ${posts.length} posts`
          : `${filtered.length} of ${posts.length} posts`}
        {activeTags.length > 0 && (
          <span className="ml-1 text-purple-400">· {activeTags.join(", ")}</span>
        )}
      </p>

      {/* Posts grouped by week */}
      {grouped.length > 0 ? (
        <div className="space-y-10">
          {grouped.map(([weekNum, weekPosts]) => (
            <section key={weekNum}>
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="text-xl font-bold text-white">Week {weekNum}</h2>
                <span className="text-xs text-gray-500">{weekDateRange(weekNum)}</span>
              </div>
              <div className="flex flex-col gap-3">
                {weekPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} tagColorMap={tagColorMap} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111111] py-20 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="font-semibold text-white">No posts found</p>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search.</p>
          <button
            onClick={clear}
            className="mt-4 rounded-lg bg-purple-600/20 border border-purple-500/30 px-4 py-2 text-sm text-purple-400 hover:bg-purple-600/30"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
