import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  GraduationCap,
  IndianRupee,
  MapPin,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";

import CourseList from "@/components/CourseList";
import SaveButton from "@/components/SaveButton";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Course = {
  id: string;
  name: string;
  createdAt: string;
};

type Review = {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
  };
};

type College = {
  id: string;
  name: string;
  slug: string;
  location: string;
  fees: number;
  rating: number;
  averagePlacement: number;
  highestPlacement: number;
  overview: string;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
  reviews: Review[];
};

function formatAmount(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function getCollege(slug: string): Promise<College | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const listingResponse = await fetch(
      `${baseUrl}/api/colleges?limit=50`,
      {
        cache: "no-store",
      }
    );

    if (!listingResponse.ok) {
      return null;
    }

    const listing = await listingResponse.json();

    const college = listing.data?.find(
      (item: College) => item.slug === slug
    );

    if (!college) {
      return null;
    }

    const detailResponse = await fetch(
      `${baseUrl}/api/colleges/${college.id}`,
      {
        cache: "no-store",
      }
    );

    if (!detailResponse.ok) {
      return null;
    }

    const detail = await detailResponse.json();

    return detail.data ?? null;
  } catch (error) {
    console.error(
      "College detail error:",
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    return null;
  }
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await getCollege(slug);

  if (!college) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <Building2
            size={40}
            className="mx-auto mb-5 text-slate-300"
          />

          <h1 className="text-3xl font-bold text-slate-950">
            College not found
          </h1>

          <p className="mt-3 text-slate-500">
            The college you&apos;re looking for doesn&apos;t exist or
            is no longer available.
          </p>

          <Link
            href="/"
            className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 active:scale-95"
          >
            <ArrowLeft size={17} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to colleges
          </Link>
        </div>
      </main>
    );
  }

  const session = await getServerSession(authOptions);
  const savedCollege = session?.user?.id
    ? await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: {
            userId: session.user.id,
            collegeId: college.id,
          },
        },
        select: {
          id: true,
        },
      })
    : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-500 transition hover:bg-cyan-50 hover:text-cyan-600 active:scale-95"
          >
            <ArrowLeft size={17} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to colleges
          </Link>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Building2 size={27} />
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600">
                  <Star
                    size={15}
                    fill="currentColor"
                  />
                  {college.rating.toFixed(1)} / 5
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                  <MapPin size={14} />
                  {college.location}
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {college.name}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
                {college.overview}
              </p>
            </div>

            <div className="self-end lg:border-l lg:border-slate-200 lg:pl-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Overall rating
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Star
                  size={26}
                  className="text-amber-500"
                  fill="currentColor"
                />

                <span className="text-4xl font-black">
                  {college.rating.toFixed(1)}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Based on available reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <IndianRupee size={20} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Annual fees
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {formatAmount(college.fees)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <TrendingUp size={20} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average placement
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {formatAmount(college.averagePlacement)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <Trophy size={20} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Highest placement
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {formatAmount(college.highestPlacement)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <GraduationCap size={20} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Courses
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {college.courses.length}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div>

            <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                  About
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  About {college.name}
                </h2>
              </div>

              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                {college.overview}
              </p>
            </section>

            <section className="mt-8">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                  Academics
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Courses offered
                </h2>
              </div>

              <CourseList courses={college.courses} />
            </section>

            <section className="mt-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                    Student feedback
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    Reviews
                  </h2>
                </div>

                <span className="text-sm text-slate-400">
                  {college.reviews.length}{" "}
                  {college.reviews.length === 1
                    ? "review"
                    : "reviews"}
                </span>
              </div>

              {college.reviews.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                  <p className="font-semibold text-slate-900">
                    No reviews yet
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Reviews for this college will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {college.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {review.user.name ||
                              "Anonymous student"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600">
                          <Star
                            size={14}
                            fill="currentColor"
                          />
                          {review.rating.toFixed(1)}
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-7 text-slate-600">
                        {review.content}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside>
            <div className="sticky top-6 rounded-xl border border-slate-200 bg-slate-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Quick overview
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                {college.name}
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm text-slate-400">
                    Location
                  </span>

                  <span className="max-w-42.5 text-right text-sm font-medium">
                    {college.location}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm text-slate-400">
                    Fees
                  </span>

                  <span className="text-sm font-semibold">
                    {formatAmount(college.fees)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm text-slate-400">
                    Rating
                  </span>

                  <span className="flex items-center gap-1 text-sm font-semibold">
                    <Star
                      size={14}
                      className="text-amber-400"
                      fill="currentColor"
                    />
                    {college.rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Courses
                  </span>

                  <span className="text-sm font-semibold">
                    {college.courses.length}
                  </span>
                </div>
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <SaveButton
                  collegeId={college.id}
                  initialSaved={Boolean(savedCollege)}
                />

                <Link
                  href="/"
                  className="group mt-3 flex items-center justify-between rounded-lg bg-cyan-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-400 active:scale-95"
                >
                  Explore more colleges

                  <ArrowUpRight size={18} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}