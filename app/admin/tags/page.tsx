import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getAllAvailableTags } from "@/lib/db";
import { addTagAction, updateTagColorAction, deleteTagAction } from "@/app/actions";
import { COLOR_PRESETS, getCardCls } from "@/lib/tagColors";
import { ArrowLeft, Tags, X, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManageTagsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const tags = await getAllAvailableTags();

  return (
    <div className="space-y-8 max-w-xl">
      {/* Header */}
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
          <p className="mt-0.5 text-sm text-gray-500">
            {tags.length} tag{tags.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      {/* Add tag form */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Add new tag
        </p>
        <form action={addTagAction} className="space-y-3">
          <div className="flex gap-2">
            <input
              name="tag"
              type="text"
              required
              placeholder="e.g. Excel, Power Apps…"
              className="flex-1 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 active:scale-95 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* Color picker */}
          <div>
            <p className="mb-2 text-xs text-gray-500">Choose a colour</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset, i) => (
                <label
                  key={preset.key}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/8 px-3 py-1.5 text-xs text-gray-400 hover:border-white/20 hover:text-white has-[:checked]:border-purple-500/50 has-[:checked]:text-white has-[:checked]:bg-white/5"
                >
                  <input
                    type="radio"
                    name="color"
                    value={preset.key}
                    defaultChecked={i === 0}
                    className="sr-only"
                  />
                  <span className={`h-2.5 w-2.5 rounded-full ${preset.dot}`} />
                  {preset.label}
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Tag list */}
      <div className="rounded-2xl border border-white/5 bg-[#111111] overflow-hidden">
        <div className="border-b border-white/5 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
            Current tags
          </p>
        </div>

        {tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Tags className="mb-3 h-7 w-7 text-gray-700" />
            <p className="text-sm text-gray-500">No tags yet. Add one above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {tags.map((tag) => {
              const deleteAction = deleteTagAction.bind(null, tag.name);
              const updateAction = updateTagColorAction.bind(null, tag.name);
              return (
                <li key={tag.name} className="px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getCardCls(tag.color)}`}
                    >
                      {tag.name}
                    </span>
                    <form action={deleteAction}>
                      <button
                        type="submit"
                        title={`Delete "${tag.name}"`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>

                  <form action={updateAction} className="flex flex-wrap gap-1.5 items-center">
                    {COLOR_PRESETS.map((preset) => (
                      <label
                        key={preset.key}
                        className="flex cursor-pointer items-center gap-1 rounded-full border border-white/5 px-2 py-1 text-xs text-gray-500 hover:border-white/15 hover:text-gray-300 has-[:checked]:border-purple-500/40 has-[:checked]:text-white has-[:checked]:bg-white/5"
                      >
                        <input
                          type="radio"
                          name="color"
                          value={preset.key}
                          defaultChecked={tag.color === preset.key}
                          className="sr-only"
                        />
                        <span className={`h-2 w-2 rounded-full ${preset.dot}`} />
                        {preset.label}
                      </label>
                    ))}
                    <button
                      type="submit"
                      className="ml-1 rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-gray-400 hover:text-white hover:border-white/20"
                    >
                      Save colour
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs text-gray-600">
        Deleting a tag removes it from the available list but does{" "}
        <strong className="text-gray-500">not</strong> remove it from existing posts.
      </p>
    </div>
  );
}
