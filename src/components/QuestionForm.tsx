"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuestionForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }

    if (content.trim().length < 10) {
      setError("Question must be at least 10 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      router.push(`/discussions/${data.id}`);
      router.refresh();
    } catch {
      setError("Unable to create question.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Ask a question
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Get help from students and the community.
        </p>
      </div>

      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What would you like to ask?"
          maxLength={150}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your question..."
          rows={6}
          maxLength={5000}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition hover:bg-cyan-600 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />

          {loading ? "Posting..." : "Post question"}
        </button>
      </div>
    </form>
  );
}