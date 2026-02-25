import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "@/app/actions";
import { Lock } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10">
            <Lock className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">StageBlog CMS</p>
        </div>

        {/* Form */}
        <form
          action={loginAction}
          className="space-y-4 rounded-2xl border border-white/5 bg-[#111111] p-6"
        >
          {hasError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              Incorrect password. Try again.
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-white outline-none placeholder-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 active:scale-95"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
