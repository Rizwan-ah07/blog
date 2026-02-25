import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getPostBySlug, getAllAvailableTags } from "@/lib/db";
import { updatePostAction } from "@/app/actions";
import PostForm from "@/app/components/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { slug } = await params;
  const [post, availableTags] = [getPostBySlug(slug), getAllAvailableTags()];
  if (!post) notFound();

  const actionWithSlug = updatePostAction.bind(null, slug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Edit Post</h1>
        <p className="mt-1 text-sm text-gray-500 truncate">/blog/{slug}</p>
      </div>
      <PostForm
        action={actionWithSlug}
        availableTags={availableTags}
        defaultValues={{
          slug: post.slug,
          title: post.title,
          date: post.date,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags,
          featured: post.featured,
        }}
        submitLabel="Save Changes"
        backHref={`/blog/${slug}`}
      />
    </div>
  );
}
