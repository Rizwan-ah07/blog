"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import { getFormCls } from "@/lib/tagColors";
import type { TagEntry } from "@/lib/tagColors";

type Props = {
  action: (formData: FormData) => Promise<void>;
  availableTags?: TagEntry[];
  defaultValues?: {
    slug?: string;
    title?: string;
    date?: string;
    excerpt?: string;
    content?: string;
    tags?: string[];
    featured?: boolean;
  };
  submitLabel?: string;
  backHref?: string;
};

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function PostForm({
  action,
  availableTags = [],
  defaultValues = {},
  submitLabel = "Save Post",
  backHref = "/admin",
}: Props) {
  const [title, setTitle] = useState(defaultValues.title ?? "");
  const [slug, setSlug] = useState(defaultValues.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!defaultValues.slug);
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState(defaultValues.content ?? "");

  useEffect(() => {
    if (!slugManual) setSlug(toSlug(title));
  }, [title, slugManual]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    await action(fd);
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-60 active:scale-95"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: core fields */}
        <div className="space-y-5 lg:col-span-2">
          {/* Title */}
          <Field label="Title" required>
            <input
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className={inputCls}
            />
          </Field>

          {/* Slug */}
          <Field label="Slug (URL)" hint="/blog/[slug]">
            <input
              name="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManual(true);
              }}
              placeholder="auto-generated-from-title"
              className={inputCls}
            />
            {!slugManual && (
              <p className="mt-1 text-xs text-gray-600">
                Auto-generated. Edit to override.
              </p>
            )}
          </Field>

          {/* Excerpt */}
          <Field label="Excerpt" hint="Shown in cards and previews" required>
            <textarea
              name="excerpt"
              required
              rows={2}
              defaultValue={defaultValues.excerpt}
              placeholder="One or two sentences summarising the post..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Content */}
          <Field label="Content" hint="Markdown supported">
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreview(false)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium ${!preview ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(true)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium ${preview ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                >
                  Preview
                </button>
              </div>

              {preview ? (
                <div className="min-h-[280px] rounded-xl border border-white/8 bg-[#0d0d0d] p-4">
                  {content
                    ? <MarkdownRenderer content={content} />
                    : <span className="text-sm text-gray-700">Nothing to preview yet…</span>
                  }
                </div>
              ) : (
                <textarea
                  name="content"
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"## My Heading\n\nStart writing your post here. **Bold**, `inline code`, and ## headings are supported."}
                  className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
                />
              )}
              {/* hidden field for preview mode */}
              {preview && <input type="hidden" name="content" value={content} />}
            </div>
          </Field>
        </div>

        {/* Right: meta */}
        <div className="space-y-5">
          {/* Date */}
          <Field label="Date" required>
            <input
              name="date"
              type="date"
              required
              defaultValue={defaultValues.date ?? new Date().toISOString().slice(0, 10)}
              className={inputCls}
            />
          </Field>

          {/* Tags */}
          <Field label="Tags">
            {/* Hidden combined value */}
            <TagSelector defaultTags={defaultValues.tags ?? []} availableTags={availableTags} />
          </Field>

          {/* Featured */}
          <div className="rounded-xl border border-white/5 bg-[#0d0d0d] p-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">Featured Post</p>
                <p className="text-xs text-gray-500">Shown prominently on the homepage</p>
              </div>
              <input
                name="featured"
                type="checkbox"
                defaultChecked={defaultValues.featured}
                className="h-4 w-4 rounded accent-purple-500"
              />
            </label>
          </div>

          {/* Markdown cheatsheet */}
          <div className="rounded-xl border border-white/5 bg-[#0d0d0d] p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">Markdown</p>
            <div className="space-y-1 text-xs text-gray-500 font-mono">
              <p>## Heading 2</p>
              <p>### Heading 3</p>
              <p>**bold text**</p>
              <p>`inline code`</p>
              <p>- bullet item</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          {label}
          {required && <span className="ml-0.5 text-purple-500">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-700">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TagSelector({ defaultTags, availableTags }: { defaultTags: string[]; availableTags: TagEntry[] }) {
  const [selected, setSelected] = useState<string[]>(defaultTags);

  const toggle = (tag: string) =>
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  return (
    <div className="space-y-2">
      <input type="hidden" name="tags" value={selected.join(", ")} />
      <div className="flex flex-wrap gap-2">
        {availableTags.map(({ name, color }) => {
          const active = selected.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                active
                  ? getFormCls(color) + " ring-1 ring-current/20"
                  : "border-white/8 text-gray-600 hover:border-white/15 hover:text-gray-400"
              }`}
            >
              {active && <span className="mr-1">✓</span>}
              {name}
            </button>
          );
        })}
        {availableTags.length === 0 && (
          <p className="text-xs text-gray-600">No tags yet. <a href="/admin/tags" className="text-purple-400 hover:underline">Manage tags →</a></p>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30";
