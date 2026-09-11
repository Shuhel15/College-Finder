import Link from "next/link";
import { MessageCircle, User } from "lucide-react";

type QuestionCardProps = {
  question: {
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
};

export default function QuestionCard({
  question,
}: QuestionCardProps) {
  return (
    <Link
      href={`/discussions/${question.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md sm:p-6"
    >
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
        <User size={15} />
        <span>{question.user.name || "Anonymous"}</span>

        <span>•</span>

        <span>
          {new Date(question.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-bold text-slate-900 transition group-hover:text-cyan-500">
        {question.title}
      </h3>

      <p className="line-clamp-2 text-sm leading-6 text-slate-500">
        {question.content}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <MessageCircle size={16} />

        {question._count.answers}{" "}
        {question._count.answers === 1 ? "answer" : "answers"}
      </div>
    </Link>
  );
}