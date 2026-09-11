"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnswerForm({
  questionId,
}: {
  questionId: string;
}) {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (content.trim().length < 2) {
      setError("Answer must be at least 2 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/questions/${questionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to post answer.");
        return;
      }

      setContent("");
      router.refresh();
    } catch {
      setError("Unable to post answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h3 className="mb-1 text-lg font-bold text-slate-900">
        Add an answer
      </h3>

      <p className="mb-5 text-sm text-slate-500">
        Share your knowledge with the community.
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer..."
        rows={5}
        maxLength={5000}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
      />

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-cyan-500 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition hover:border-cyan-600 hover:bg-cyan-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} />

        {loading ? "Posting..." : "Post answer"}
      </button>
    </form>
  );
}