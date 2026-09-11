import { Search, MessageSquare } from "lucide-react";

import QuestionCard from "@/components/QuestionCard";
import QuestionForm from "@/components/QuestionForm";
import FadeIn from "@/components/FadeIn";

type SearchParams = Promise<{
  search?: string;
  page?: string;
}>;

type DiscussionQuestion = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
  };
  _count: {
    answers: number;
  };
};

type DiscussionsResponse = {
  questions: DiscussionQuestion[];
  pagination: {
    page: number;
    totalPages: number;
  };
};

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const search = params.search || "";
  const page = Number(params.page) || 1;

  const query = new URLSearchParams({
    page: String(page),
    limit: "10",
  });

  if (search) {
    query.set("search", search);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/questions?${query}`,
    {
      cache: "no-store",
    }
  );

  const data: DiscussionsResponse = response.ok
    ? (await response.json() as DiscussionsResponse)
    : {
        questions: [],
        pagination: {
          page: 1,
          totalPages: 1,
        },
      };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-cyan-500">
            <MessageSquare size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Community
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            College Discussions
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Ask questions, share your experience and learn from other
            students.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-10">
          <QuestionForm />
        </FadeIn>

        <FadeIn delay={0.15}>
          <form className="mb-6 flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                name="search"
                defaultValue={search}
                placeholder="Search discussions..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
              />
            </div>

            <button
              type="submit"
              className="shrink-0 rounded-xl border border-cyan-500 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition hover:border-cyan-600 hover:bg-cyan-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/20 active:scale-95"
            >
              Search
            </button>
          </form>
        </FadeIn>

        {data.questions.length === 0 ? (
          <FadeIn className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <MessageSquare
              size={32}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-5 font-bold text-slate-900">
              No discussions found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Be the first person to start a discussion.
            </p>
          </FadeIn>
        ) : (
          <div className="space-y-4">
            {data.questions.map((question, index) => (
              <FadeIn key={question.id} delay={index * 0.06}>
                <QuestionCard question={question} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}