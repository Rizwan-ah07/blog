import path from "path";
import fs from "fs";
import type { Post } from "./posts";
import type { TagEntry } from "./tagColors";
import { defaultColor } from "./tagColors";

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

/** Public feed — hides posts dated in the future. */
export function getAllPosts(): Post[] {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // include posts dated today
  return readPosts()
    .filter((p) => new Date(p.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Admin feed — shows all posts including future-dated ones. */
export function getAllPostsAdmin(): Post[] {
  return readPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return readPosts().find((p) => p.slug === slug);
}

export function getFeaturedPost(): Post | undefined {
  const posts = getAllPosts(); // respects publish date
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  readPosts().forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet);
}

// ── tag store (data/tags.json) ────────────────────────────────────────────────

function readTags(): TagEntry[] {
  if (!fs.existsSync(TAGS_PATH)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(TAGS_PATH, "utf-8"));
    // Handle legacy string[] format
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") {
      return (raw as string[]).map((name, i) => ({ name, color: defaultColor(i) }));
    }
    return raw as TagEntry[];
  } catch {
    return [];
  }
}

function writeTags(tags: TagEntry[]): void {
  fs.mkdirSync(path.dirname(TAGS_PATH), { recursive: true });
  fs.writeFileSync(TAGS_PATH, JSON.stringify(tags, null, 2), "utf-8");
}

export function getAllAvailableTags(): TagEntry[] {
  return readTags();
}

export function addTag(name: string, color: string): void {
  const tags = readTags();
  const trimmed = name.trim();
  if (!trimmed || tags.some((t) => t.name === trimmed)) return;
  tags.push({ name: trimmed, color });
  writeTags(tags);
}

export function updateTagColor(name: string, color: string): void {
  const tags = readTags();
  const entry = tags.find((t) => t.name === name);
  if (entry) {
    entry.color = color;
    writeTags(tags);
  }
}

export function deleteTag(name: string): void {
  writeTags(readTags().filter((t) => t.name !== name));
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

// ── About page data ──────────────────────────────────────────────────────────

export interface AboutData {
  name: string;
  role: string;
  period: string;
  linkedinUrl: string;
  company: string;
  location: string;
  locationSub: string;
  jobTitle: string;
  jobSub: string;
  duration: string;
  durationSub: string;
  story: string[];
  skills: { label: string; level: number }[];
  learningGoals: string[];
}

const ABOUT_PATH = path.join(process.cwd(), "data", "about.json");

const ABOUT_DEFAULTS: AboutData = {
  name: "Your Name",
  role: "Business & Data Intern",
  period: "Stage / WPL 2026",
  linkedinUrl: "https://linkedin.com/in/your-profile",
  company: "[Company Name]",
  location: "[City, Country]",
  locationSub: "On-site / Hybrid",
  jobTitle: "Business & Data Intern",
  jobSub: "Stage / WPL position",
  duration: "Feb – Jun 2026",
  durationSub: "5 months",
  story: [
    "I'm a student currently completing my Stage/WPL internship as part of my ICT programme.",
  ],
  skills: [{ label: "Power BI & DAX", level: 60 }],
  learningGoals: ["Build functional Power BI dashboards from real business data"],
};

export function getAbout(): AboutData {
  if (!fs.existsSync(ABOUT_PATH)) return ABOUT_DEFAULTS;
  try {
    return JSON.parse(fs.readFileSync(ABOUT_PATH, "utf-8")) as AboutData;
  } catch {
    return ABOUT_DEFAULTS;
  }
}

export function saveAbout(data: AboutData): void {
  fs.mkdirSync(path.dirname(ABOUT_PATH), { recursive: true });
  fs.writeFileSync(ABOUT_PATH, JSON.stringify(data, null, 2), "utf-8");
}
