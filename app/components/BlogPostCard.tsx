import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

type Props = {
  post: Post;
  featured?: boolean;
  tagColorMap?: Record<string, string>;
};

const DEFAULT_TAG_CLS = "bg-purple-500/15 text-purple-400 border-purple-500/25";

export default function BlogPostCard({ post, featured = false, tagColorMap = {} }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#111111] p-5 transition-all hover:border-purple-500/30 hover:bg-[#141414] ${
        featured ? "sm:flex-row sm:gap-6 sm:p-6" : ""
      }`}
    >
      {/* Tags row */}
      <div className={`flex flex-wrap gap-1.5 ${featured ? "sm:hidden" : ""}`}>
        {post.tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
              tagColorMap[tag] ?? DEFAULT_TAG_CLS
            }`}
          >
            <Tag className="h-2.5 w-2.5" />
            {tag}
          </span>
        ))}
      </div>

      {/* Featured: left column with tags */}
      {featured && (
        <div className="hidden sm:flex sm:flex-col sm:justify-between sm:w-48 sm:shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                  tagColorMap[tag] ?? DEFAULT_TAG_CLS
                }`}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-gray-500 mt-auto pt-4">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`font-bold leading-snug text-white group-hover:text-purple-200 transition-colors ${
                featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
              }`}
            >
              {post.title}
            </h3>
            {featured && (
              <span className="hidden sm:inline shrink-0 rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-xs text-purple-300">
                Featured
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-gray-400 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {!featured && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-white/5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
        )}
        {featured && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-white/5 sm:hidden">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
        )}
      </div>
    </Link>
  );
}
