import { getAllPosts, getAllTags } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import BlogFeed from "./BlogFeed";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [posts, allTags, admin] = await Promise.all([
    Promise.resolve(getAllPosts()),
    Promise.resolve(getAllTags()),
    isAdmin(),
  ]);

  return <BlogFeed posts={posts} allTags={allTags} isAdmin={admin} />;
}
