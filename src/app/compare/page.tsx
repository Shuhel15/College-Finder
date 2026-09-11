import Link from "next/link";
import {
  ArrowLeft,
  GitCompareArrows,
} from "lucide-react";

import CollegeComparisonTable from "@/components/CollegeComparisonTable";

type College = {
  id: string;
  name: string;
  slug: string;
  location: string;
  fees: number;
  rating: number;
  averagePlacement: number;
  highestPlacement: number;
};

type CompareResponse = {
  success: boolean;
  data?: College;
};

async function getCollege(
  id: string
): Promise<College | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/colleges/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: CompareResponse =
      await response.json();

    return result.data ?? null;
  } catch (error) {
    console.error(
      "Compare college error:",
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    return null;
  }
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{
    ids?: string;
  }>;
}) {
  const params = await searchParams;

  const ids = [
    ...new Set(
      (params.ids || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ].slice(0, 3);

  if (ids.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-600"
          >
            <ArrowLeft size={17} />
            Back to colleges
          </Link>

          <div className="mt-20 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <GitCompareArrows size={26} />
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight">
              Nothing to compare yet
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Select at least two colleges from the
              college listing to start comparing them.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-600"
            >
              Explore colleges
              <ArrowLeft
                size={16}
                className="rotate-180"
              />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const colleges = (
    await Promise.all(ids.map(getCollege))
  ).filter(
    (college): college is College => college !== null
  );

  if (colleges.length < 2) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-600"
          >
            <ArrowLeft size={17} />
            Back to colleges
          </Link>

          <div className="mt-20 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <GitCompareArrows size={26} />
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight">
              Not enough colleges
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              At least two valid colleges are required
              for comparison.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-500"
            >
              Choose colleges
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-600"
          >
            <ArrowLeft size={17} />
            Back to colleges
          </Link>

          <div className="mt-8 flex items-end justify-between gap-6">
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-cyan-600">
                <GitCompareArrows size={18} />
                College comparison
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Compare colleges
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Compare fees, ratings, location and
                placement information side by side.
              </p>
            </div>

            <span className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 sm:block">
              {colleges.length} colleges
            </span>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <CollegeComparisonTable colleges={colleges} />
      </section>
    </main>
  );
}