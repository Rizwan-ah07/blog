/**
 * Seed MongoDB from existing JSON files.
 * Run once with:  npx tsx scripts/seed.ts
 *
 * Requires MONGODB_URI in .env.local (loaded via dotenv).
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { MongoClient } from "mongodb";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
if (!uri || uri.startsWith("mongodb+srv://...")) {
  console.error(
    "ERROR: Set a real MONGODB_URI in .env.local before seeding.\n" +
      "  Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/"
  );
  process.exit(1);
}

function readJson<T>(file: string): T {
  const raw = readFileSync(resolve(process.cwd(), file), "utf8");
  return JSON.parse(raw) as T;
}

async function main() {
  const client = new MongoClient(uri!);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("portfolio");

    // ── Posts ──────────────────────────────────────────────────────────────
    const postsData = readJson<object[]>("data/posts.json");
    const postsCol = db.collection("rizwan-posts");
    await postsCol.deleteMany({}); // clear existing
    if (postsData.length > 0) {
      await postsCol.insertMany(postsData as never[]);
      // unique index on slug
      await postsCol.createIndex({ slug: 1 }, { unique: true });
    }
    console.log(`Seeded ${postsData.length} posts → rizwan-posts`);

    // ── Tags ───────────────────────────────────────────────────────────────
    const tagsData = readJson<object[]>("data/tags.json");
    const tagsCol = db.collection("rizwan-tags");
    await tagsCol.deleteMany({});
    if (tagsData.length > 0) {
      await tagsCol.insertMany(tagsData as never[]);
      await tagsCol.createIndex({ name: 1 }, { unique: true });
    }
    console.log(`Seeded ${tagsData.length} tags → rizwan-tags`);

    // ── About ──────────────────────────────────────────────────────────────
    const aboutData = readJson<object>("data/about.json");
    const aboutCol = db.collection("rizwan-about");
    await aboutCol.deleteMany({});
    await aboutCol.insertOne(aboutData as never);
    console.log(`Seeded about doc → rizwan-about`);

    console.log("\nSeeding complete!");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
