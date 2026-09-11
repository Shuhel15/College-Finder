import Link from "next/link";
import { Bookmark, MapPin, Star } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SaveButton from "@/components/SaveButton";
import FadeIn from "@/components/FadeIn";

export default async function SavedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const savedColleges = await prisma.savedCollege.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      college: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-cyan-500">
            <Bookmark size={20} />

            <span className="text-sm font-semibold uppercase tracking-wider">
              Your collection
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Saved Colleges
          </h1>

          <p className="mt-2 text-slate-500">
            Colleges you&apos;ve saved for later.
          </p>
        </FadeIn>

        {savedColleges.length === 0 ? (
          <FadeIn delay={0.1} className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
              <Bookmark size={26} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No saved colleges
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Start exploring colleges and save the ones
              you&apos;re interested in.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 hover:shadow-lg active:scale-95"
            >
              Explore Colleges
            </Link>
          </FadeIn>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedColleges.map(({ college }, index) => (
              <FadeIn key={college.id} delay={index * 0.08}>
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/colleges/${college.slug}`}
                        className="line-clamp-2 text-lg font-bold text-slate-900 transition hover:text-cyan-500"
                      >
                        {college.name}
                      </Link>

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={15} />
                        <span className="truncate">
                          {college.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-600">
                      <Star
                        size={14}
                        fill="currentColor"
                      />
                      {college.rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="group inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-cyan-500 transition hover:bg-cyan-50 hover:text-cyan-600 active:scale-95"
                    >
                      View details
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </Link>

                    <SaveButton
                      collegeId={college.id}
                      initialSaved
                    />
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}