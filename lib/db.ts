import path from "path";
import fs from "fs";
import type { Post } from "./posts";

const DB_PATH = path.join(process.cwd(), "data", "posts.json");
const TAGS_PATH = path.join(process.cwd(), "data", "tags.json");

// ── helpers ──────────────────────────────────────────────────────────────────

function readPosts(): Post[] {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Post[];
  } catch {
    return [];
  }
}

function writePosts(posts: Post[]): void {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(posts, null, 2), "utf-8");
}

// ── public API ────────────────────────────────────────────────────────────────

export function getAllPosts(): Post[] {
  return readPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return readPosts().find((p) => p.slug === slug);
}

export function getFeaturedPost(): Post | undefined {
  const posts = readPosts();
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  readPosts().forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet);
}

// ── tag store (data/tags.json) ────────────────────────────────────────────────

export function getAllAvailableTags(): string[] {
  if (!fs.existsSync(TAGS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(TAGS_PATH, "utf-8")) as string[];
  } catch {
    return [];
  }
}

export function addTag(tag: string): void {
  const tags = getAllAvailableTags();
  const trimmed = tag.trim();
  if (!trimmed || tags.includes(trimmed)) return;
  tags.push(trimmed);
  fs.mkdirSync(path.dirname(TAGS_PATH), { recursive: true });
  fs.writeFileSync(TAGS_PATH, JSON.stringify(tags, null, 2), "utf-8");
}

export function deleteTag(tag: string): void {
  const tags = getAllAvailableTags().filter((t) => t !== tag);
  fs.mkdirSync(path.dirname(TAGS_PATH), { recursive: true });
  fs.writeFileSync(TAGS_PATH, JSON.stringify(tags, null, 2), "utf-8");
}

export function createPost(post: Post): void {
  const posts = readPosts();
  if (posts.find((p) => p.slug === post.slug)) {
    throw new Error(`Slug "${post.slug}" already exists`);
  }
  posts.unshift(post);
  writePosts(posts);
}

export function updatePost(slug: string, updates: Partial<Post>): Post {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) throw new Error("Post not found");
  posts[idx] = { ...posts[idx], ...updates };
  writePosts(posts);
  return posts[idx];
}

export function deletePost(slug: string): void {
  const posts = readPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (filtered.length === posts.length) throw new Error("Post not found");
  writePosts(filtered);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
