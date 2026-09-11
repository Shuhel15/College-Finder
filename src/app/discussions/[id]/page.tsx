import Link from "next/link";
import { ArrowLeft, MessageCircle, User } from "lucide-react";

import AnswerForm from "@/components/AnswerForm";
import FadeIn from "@/components/FadeIn";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type DiscussionAnswer = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
  };
};

type DiscussionQuestion = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
  };
  answers: DiscussionAnswer[];
};

export default async function DiscussionDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/questions/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Discussion not found
          </h1>

          <Link
            href="/discussions"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-500 hover:text-cyan-600 active:scale-95"
          >
            <ArrowLeft size={16} />
            Back to discussions
          </Link>
        </div>
      </main>
    );
  }

  const question = await response.json() as DiscussionQuestion;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/discussions"
          className="mb-8 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-cyan-600 hover:shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} />
          Back to discussions
        </Link>

        <FadeIn>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
              <User size={16} />

              <span>
                {question.user.name || "Anonymous"}
              </span>

              <span>•</span>

              <span>
                {new Date(
                  question.createdAt
                ).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {question.title}
            </h1>

            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {question.content}
            </p>
          </article>
        </FadeIn>

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-4">
            <MessageCircle
              size={20}
              className="text-cyan-500"
            />

            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {question.answers.length}{" "}
              {question.answers.length === 1
                ? "Answer"
                : "Answers"}
            </h2>
          </div>

          {question.answers.length > 0 && (
            <div className="space-y-4">
              {question.answers.map((answer, index) => (
                <FadeIn key={answer.id} delay={index * 0.06}>
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                      <User size={15} />

                      <span>
                        {answer.user.name || "Anonymous"}
                      </span>

                      <span>•</span>

                      <span>
                        {new Date(
                          answer.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {answer.content}
                    </p>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}

          <AnswerForm questionId={question.id} />
        </section>
      </div>
    </main>
  );
}