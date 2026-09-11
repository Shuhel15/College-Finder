import { BookOpen } from "lucide-react";

type Course = {
  id: string;
  name: string;
  createdAt: string;
};

export default function CourseList({
  courses,
}: {
  courses: Course[];
}) {
  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <BookOpen
          size={28}
          className="mx-auto mb-3 text-slate-400"
        />

        <p className="font-semibold text-slate-900">
          No courses available
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Course information is not available for this
          college yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-cyan-300"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <BookOpen size={17} />
          </div>

          <span className="text-sm font-semibold text-slate-800">
            {course.name}
          </span>
        </div>
      ))}
    </div>
  );
}