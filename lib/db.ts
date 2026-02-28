import clientPromise from "./mongodb";
import type { Post } from "./posts";
import type { TagEntry } from "./tagColors";
import { defaultColor } from "./tagColors";

// ── collection helpers ────────────────────────────────────────────────────────

async function postsCol() {
  const client = await clientPromise;
  return client.db("portfolio").collection("rizwan-posts");
}

async function tagsCol() {
  const client = await clientPromise;
  return client.db("portfolio").collection("rizwan-tags");
}

async function aboutCol() {
  const client = await clientPromise;
  return client.db("portfolio").collection("rizwan-about");
}

function stripId<T>(doc: T & { _id?: unknown }): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = doc as Record<string, unknown>;
  return rest as T;
}

// ── Posts ─────────────────────────────────────────────────────────────────────

/** Public feed — hides posts dated in the future. */
export async function getAllPosts(): Promise<Post[]> {
  const col = await postsCol();
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const docs = await col.find({ date: { $lte: today } }).toArray();
  return docs
    .map((d) => stripId(d) as unknown as Post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Admin feed — shows all posts including future-dated ones. */
export async function getAllPostsAdmin(): Promise<Post[]> {
  const col = await postsCol();
  const docs = await col.find({}).toArray();
  return docs
    .map((d) => stripId(d) as unknown as Post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const col = await postsCol();
  const doc = await col.findOne({ slug });
  return doc ? (stripId(doc) as unknown as Post) : undefined;
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.featured) ?? posts[0];
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet);
}

export async function createPost(post: Post): Promise<void> {
  const col = await postsCol();
  const existing = await col.findOne({ slug: post.slug });
  if (existing) throw new Error(`Slug "${post.slug}" already exists`);
  await col.insertOne(post as Record<string, unknown>);
}

export async function updatePost(
  slug: string,
  updates: Partial<Post>
): Promise<Post> {
  const col = await postsCol();
  const result = await col.findOneAndUpdate(
    { slug },
    { $set: updates },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Post not found");
  return stripId(result) as unknown as Post;
}

export async function deletePost(slug: string): Promise<void> {
  const col = await postsCol();
  const result = await col.deleteOne({ slug });
  if (result.deletedCount === 0) throw new Error("Post not found");
}

// ── Tags ──────────────────────────────────────────────────────────────────────

export async function getAllAvailableTags(): Promise<TagEntry[]> {
  const col = await tagsCol();
  const docs = await col.find({}).toArray();
  return docs.map((d, i) => {
    const stripped = stripId(d) as Record<string, unknown>;
    return {
      name: String(stripped.name ?? ""),
      color: String(stripped.color ?? defaultColor(i)),
    };
  });
}

export async function addTag(name: string, color: string): Promise<void> {
  const col = await tagsCol();
  const trimmed = name.trim();
  if (!trimmed) return;
  const existing = await col.findOne({ name: trimmed });
  if (existing) return;
  await col.insertOne({ name: trimmed, color });
}

export async function updateTagColor(
  name: string,
  color: string
): Promise<void> {
  const col = await tagsCol();
  await col.updateOne({ name }, { $set: { color } });
}

export async function deleteTag(name: string): Promise<void> {
  const col = await tagsCol();
  await col.deleteOne({ name });
}

// ── About ─────────────────────────────────────────────────────────────────────

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

const ABOUT_DEFAULTS: AboutData = {
  name: "Your Name",
  role: "Business & Data Intern",
  period: "Internship 2026",
  linkedinUrl: "https://linkedin.com/in/your-profile",
  company: "[Company Name]",
  location: "[City, Country]",
  locationSub: "On-site / Hybrid",
  jobTitle: "Business & Data Intern",
  jobSub: "Internship position",
  duration: "Feb – Jun 2026",
  durationSub: "5 months",
  story: ["I'm a student completing my internship as part of my ICT programme."],
  skills: [{ label: "Power BI & DAX", level: 60 }],
  learningGoals: ["Build functional Power BI dashboards from real business data"],
};

export async function getAbout(): Promise<AboutData> {
  const col = await aboutCol();
  const doc = await col.findOne({});
  if (!doc) return ABOUT_DEFAULTS;
  return stripId(doc) as unknown as AboutData;
}

export async function saveAbout(data: AboutData): Promise<void> {
  const col = await aboutCol();
  const count = await col.countDocuments({});
  if (count === 0) {
    await col.insertOne(data as unknown as Record<string, unknown>);
  } else {
    await col.replaceOne({}, data as unknown as Record<string, unknown>);
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
