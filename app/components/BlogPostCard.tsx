import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

const tagColors: Record<string, string> = {
  "Power BI": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  SAP: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Migration: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Lessons Learned": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Fails: "bg-red-500/15 text-red-400 border-red-500/25",
  Wins: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Teambuilding: "bg-pink-500/15 text-pink-400 border-pink-500/25",
};

type Props = {
  post: Post;
  featured?: boolean;
};

export default function BlogPostCard({ post, featured = false }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#111111] transition-colors hover:border-purple-500/30 hover:bg-[#141414] ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <div className={`flex flex-1 flex-col justify-between p-5 ${featured ? "md:p-6" : ""}`}>
        <div>
          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                  tagColors[tag] ?? "bg-purple-500/15 text-purple-400 border-purple-500/25"
                }`}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3
            className={`font-bold leading-snug text-white ${
              featured ? "text-xl sm:text-2xl mb-3" : "text-base sm:text-lg mb-2"
            }`}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-white/5 pt-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
        </div>
      </div>
    </Link>
  );
}
