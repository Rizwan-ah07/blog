import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { createPostAction } from "@/app/actions";
import { getAllAvailableTags } from "@/lib/db";
import PostForm from "@/app/components/PostForm";

export default async function NewPostPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const availableTags = getAllAvailableTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">New Post</h1>
        <p className="mt-1 text-sm text-gray-500">Write a new blog post entry.</p>
      </div>
      <PostForm
        action={createPostAction}
        availableTags={availableTags}
        submitLabel="Publish Post"
        backHref="/admin"
      />
    </div>
  );
}
