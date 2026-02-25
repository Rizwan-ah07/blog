import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, Pencil } from "lucide-react";
import { getPostBySlug, getAllPosts, getAllAvailableTags } from "@/lib/db";
import { formatDate } from "@/lib/posts";
import { isAdmin } from "@/lib/auth";
import { deletePostAction } from "@/app/actions";
import DeleteButton from "@/app/components/DeleteButton";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import { buildTagColorMap } from "@/lib/tagColors";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const [admin, tagEntries] = await Promise.all([isAdmin(), Promise.resolve(getAllAvailableTags())]);
  const tagColorMap = buildTagColorMap(tagEntries);
  const deleteWithSlug = deletePostAction.bind(null, slug);

  const related = getAllPosts()
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back + admin controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {admin && (
          <div className="flex items-center gap-2">
            <Link
              href={`/blog/${slug}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-purple-500/30 hover:text-purple-300 transition-all"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
            <DeleteButton action={deleteWithSlug} title={post.title} />
          </div>
        )}
      </div>

      {/* Post header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                tagColorMap[tag] ?? "bg-purple-500/15 text-purple-400 border-purple-500/25"
              }`}
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug tracking-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(post.date)}
          </span>
        </div>

        <p className="rounded-xl border-l-2 border-purple-500/50 bg-purple-500/5 py-3 pl-4 pr-3 text-sm text-gray-400 italic">
          {post.excerpt}
        </p>
      </div>

      <div className="h-px bg-white/5" />

      {/* Content */}
      <MarkdownRenderer content={post.content} />

      <div className="h-px bg-white/5" />

      {/* Related posts */}
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">Related Posts</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((rpost) => (
              <Link
                key={rpost.slug}
                href={`/blog/${rpost.slug}`}
                className="group rounded-xl border border-white/5 bg-[#111111] p-4 hover:border-purple-500/30 transition-all"
              >
                <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                  {rpost.title}
                </p>
                <p className="mt-1 text-xs text-gray-500">{formatDate(rpost.date)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-center pt-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-purple-500/30 hover:text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Posts
        </Link>
      </div>
    </div>
  );
}

