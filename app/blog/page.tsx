import { getAllPosts, getAllAvailableTags } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import BlogFeed from "./BlogFeed";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [posts, tagEntries, admin] = await Promise.all([
    Promise.resolve(getAllPosts()),
    Promise.resolve(getAllAvailableTags()),
    isAdmin(),
  ]);

  return <BlogFeed posts={posts} tagEntries={tagEntries} isAdmin={admin} />;
}
