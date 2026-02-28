import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/db";
import { formatDate } from "@/lib/posts";
import { logoutAction } from "@/app/actions";
import { PlusCircle, Pencil, LogOut, FileText, Tags } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const posts = await getAllPostsAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">{posts.length} post{posts.length !== 1 ? "s" : ""} in the database</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/tags"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 hover:border-purple-500/30 hover:text-purple-300"
          >
            <Tags className="h-4 w-4" />
            <span>Tags</span>
          </Link>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-500"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Post</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:border-white/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Posts — card list on mobile, table on sm+ */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#111111] py-16 text-center">
          <FileText className="mb-3 h-8 w-8 text-gray-700" />
          <p className="text-gray-500">No posts yet.</p>
          <Link href="/admin/new" className="mt-3 text-sm text-purple-400 hover:text-purple-300">
            Create your first post →
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <ul className="flex flex-col gap-3 sm:hidden">
            {posts.map((post) => (
              <li key={post.slug} className="rounded-2xl border border-white/5 bg-[#111111] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white leading-snug line-clamp-2">
                        {post.title}
                      </span>
                      {post.featured && (
                        <span className="shrink-0 rounded-full bg-purple-500/20 border border-purple-500/30 px-1.5 py-0.5 text-xs text-purple-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-600">/blog/{post.slug}</p>
                    <p className="mt-2 text-xs text-gray-500">{formatDate(post.date)}</p>
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.map((t) => (
                          <span key={t} className="rounded-full bg-white/5 border border-white/8 px-2 py-0.5 text-xs text-gray-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/blog/${post.slug}/edit`}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-purple-500/30 hover:text-purple-300"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden sm:block rounded-2xl border border-white/5 bg-[#111111] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-widest text-gray-600">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="hidden px-5 py-3 md:table-cell">Tags</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.slug}
                    className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white line-clamp-1">{post.title}</span>
                        {post.featured && (
                          <span className="shrink-0 rounded-full bg-purple-500/20 border border-purple-500/30 px-1.5 py-0.5 text-xs text-purple-400">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-600 line-clamp-1">/blog/{post.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                      {formatDate(post.date)}
                    </td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((t) => (
                          <span key={t} className="rounded-full bg-white/5 border border-white/8 px-2 py-0.5 text-xs text-gray-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/blog/${post.slug}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-purple-500/30 hover:text-purple-300"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
