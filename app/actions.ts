"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createPost,
  updatePost,
  deletePost,
  slugify,
  addTag,
  deleteTag,
  updateTagColor,
  saveAbout,
  type AboutData,
} from "@/lib/db";
import {
  verifyPassword,
  generateToken,
  buildAuthCookie,
  buildLogoutCookie,
  isAdmin,
  COOKIE_NAME,
} from "@/lib/auth";

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const password = formData.get("password")?.toString() ?? "";
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(COOKIE_NAME, generateToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/");
}

// ── Posts ─────────────────────────────────────────────────────────────────────

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createPostAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");

  const title = formData.get("title")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() || slugify(title);
  const date = formData.get("date")?.toString() ?? new Date().toISOString().slice(0, 10);
  const excerpt = formData.get("excerpt")?.toString().trim() ?? "";
  const content = formData.get("content")?.toString() ?? "";
  const tagsRaw = formData.get("tags")?.toString() ?? "";
  const featured = formData.get("featured") === "on";

  createPost({ slug, title, date, excerpt, tags: parseTags(tagsRaw), content, featured });

  revalidatePath("/blog");
  revalidatePath("/");
  redirect(`/blog/${slug}`);
}

export async function updatePostAction(slug: string, formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");

  const title = formData.get("title")?.toString().trim() ?? "";
  const date = formData.get("date")?.toString() ?? "";
  const excerpt = formData.get("excerpt")?.toString().trim() ?? "";
  const content = formData.get("content")?.toString() ?? "";
  const tagsRaw = formData.get("tags")?.toString() ?? "";
  const featured = formData.get("featured") === "on";
  const newSlug = formData.get("slug")?.toString().trim() || slug;

  updatePost(slug, {
    slug: newSlug,
    title,
    date,
    excerpt,
    tags: parseTags(tagsRaw),
    content,
    featured,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/blog/${newSlug}`);
  revalidatePath("/");
  redirect(`/blog/${newSlug}`);
}

export async function deletePostAction(slug: string) {
  if (!(await isAdmin())) redirect("/admin/login");
  deletePost(slug);
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/blog");
}

// ── Tags ────────────────────────────────────────────────────────────────────────────────

export async function addTagAction(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const name  = formData.get("tag")?.toString().trim()   ?? "";
  const color = formData.get("color")?.toString().trim() ?? "purple";
  if (name) addTag(name, color);
  revalidatePath("/admin/tags");
}

export async function updateTagColorAction(name: string, formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const color = formData.get("color")?.toString().trim() ?? "purple";
  updateTagColor(name, color);
  revalidatePath("/admin/tags");
}

export async function deleteTagAction(tag: string) {
  if (!(await isAdmin())) redirect("/admin/login");
  deleteTag(tag);
  revalidatePath("/admin/tags");
}

// ── About ─────────────────────────────────────────────────────────────────────

export async function saveAboutAction(data: AboutData) {
  if (!(await isAdmin())) redirect("/admin/login");
  saveAbout(data);
  revalidatePath("/about");
}
