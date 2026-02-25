"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Tag, X } from "lucide-react";
import BlogPostCard from "@/app/components/BlogPostCard";
import type { Post, Tag as PostTag } from "@/lib/posts";

const tagColors: Record<string, string> = {
  "Power BI": "bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25",
  SAP: "bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25",
  Migration: "bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/25",
  "Lessons Learned": "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25",
  Fails: "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25",
  Wins: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25",
  Teambuilding: "bg-pink-500/15 text-pink-400 border-pink-500/30 hover:bg-pink-500/25",
};

const activeTagColors: Record<string, string> = {
  "Power BI": "bg-purple-500/30 text-purple-300 border-purple-400/60",
  SAP: "bg-blue-500/30 text-blue-300 border-blue-400/60",
  Migration: "bg-orange-500/30 text-orange-300 border-orange-400/60",
  "Lessons Learned": "bg-amber-500/30 text-amber-300 border-amber-400/60",
  Fails: "bg-red-500/30 text-red-300 border-red-400/60",
  Wins: "bg-emerald-500/30 text-emerald-300 border-emerald-400/60",
  Teambuilding: "bg-pink-500/30 text-pink-300 border-pink-400/60",
};

type Props = {
  posts: Post[];
  allTags: PostTag[];
  isAdmin: boolean;
};

export default function BlogFeed({ posts, allTags, isAdmin }: Props) {
  const [activeTags, setActiveTags] = useState<PostTag[]>([]);
  const [search, setSearch] = useState("");

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

  const toggleTag = (tag: PostTag) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const hasFilters = activeTags.length > 0 || search.trim() !== "";
  const clear = () => { setActiveTags([]); setSearch(""); };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">The Blog</h1>
          <p className="mt-1 text-sm text-gray-500">
            {posts.length} posts documenting my Stage/WPL internship journey.
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
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
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
              <button onClick={clear} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isActive = activeTags.includes(tag);
              const cls = isActive
                ? activeTagColors[tag] ?? "bg-purple-500/30 text-purple-300 border-purple-400/60"
                : tagColors[tag] ?? "bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25";
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${cls}`}
                >
                  {isActive && <span className="mr-1">✓</span>}
                  {tag}
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

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111111] py-20 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="font-semibold text-white">No posts found</p>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search.</p>
          <button onClick={clear} className="mt-4 rounded-lg bg-purple-600/20 border border-purple-500/30 px-4 py-2 text-sm text-purple-400 hover:bg-purple-600/30">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
