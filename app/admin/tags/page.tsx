import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getAllAvailableTags } from "@/lib/db";
import { addTagAction, deleteTagAction } from "@/app/actions";
import { ArrowLeft, Tags, X, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const TAG_COLORS: Record<string, string> = {
  "Power BI": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  SAP: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Migration: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Lessons Learned": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Fails: "bg-red-500/15 text-red-400 border-red-500/25",
  Wins: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Teambuilding: "bg-pink-500/15 text-pink-400 border-pink-500/25",
};

export default async function ManageTagsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const tags = getAllAvailableTags();

  return (
    <div className="space-y-8 max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Tags className="h-5 w-5 text-purple-400" />
              Manage Tags
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">{tags.length} tag{tags.length !== 1 ? "s" : ""} available</p>
          </div>
        </div>
      </div>

      {/* Add tag form */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Add new tag</p>
        <form action={addTagAction} className="flex gap-2">
          <input
            name="tag"
            type="text"
            required
            placeholder="e.g. Excel, Power Apps…"
            className="flex-1 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>
      </div>

      {/* Tag list */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden">
        <div className="border-b border-white/5 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">Current tags</p>
        </div>
        {tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Tags className="mb-3 h-7 w-7 text-gray-700" />
            <p className="text-sm text-gray-500">No tags yet. Add one above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {tags.map((tag) => {
              const deleteWithTag = deleteTagAction.bind(null, tag);
              const color = TAG_COLORS[tag] ?? "bg-purple-500/15 text-purple-400 border-purple-500/25";
              return (
                <li key={tag} className="flex items-center justify-between px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${color}`}
                  >
                    {tag}
                  </span>
                  <form action={deleteWithTag}>
                    <button
                      type="submit"
                      title={`Delete "${tag}"`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs text-gray-600">
        Deleting a tag removes it from the available list but does <strong className="text-gray-500">not</strong> remove it from existing posts.
      </p>
    </div>
  );
}
