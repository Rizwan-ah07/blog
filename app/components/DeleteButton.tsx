"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

type Props = {
  action: () => Promise<void>;
  title: string;
};

export default function DeleteButton({ action, title }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
        <span className="text-xs text-red-400">Delete &ldquo;{title.slice(0, 30)}&rdquo;?</span>
        <form action={async () => { setPending(true); await action(); }}>
          <button
            type="submit"
            disabled={pending}
            className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Yes, delete"}
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="text-gray-600 hover:text-gray-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:border-red-500/30 hover:text-red-400 transition-all"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
