import {
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

import CollegeCard from "@/components/CollegeCard";
import EmptyState from "@/components/EmptyState";
import FilterPanel from "@/components/FilterPanel";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import SortDropdown from "@/components/SortDropdown";
import CompareBar from "@/components/CompareBar";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SearchParams = {
  search?: string;
  location?: string;
  minFees?: string;
  maxFees?: string;
  minRating?: string;
  sort?: string;
  page?: string;
  limit?: string;
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
};

type CollegeResponse = {
  success: boolean;
  cached?: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: College[];
};

async function getColleges(
  searchParams: SearchParams
): Promise<CollegeResponse> {
  const params = new URLSearchParams();

  if (searchParams.search) {
    params.set("search", searchParams.search);
  }

  if (searchParams.location) {
    params.set("location", searchParams.location);
  }

  if (searchParams.minFees) {
    params.set("minFees", searchParams.minFees);
  }

  if (searchParams.maxFees) {
    params.set("maxFees", searchParams.maxFees);
  }

  if (searchParams.minRating) {
    params.set("minRating", searchParams.minRating);
  }

  params.set(
    "sort",
    searchParams.sort || "rating_desc"
  );

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 9;

  params.set("page", String(page));
  params.set("limit", String(limit));

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  try {
    const response = await fetch(
      `${baseUrl}/api/colleges?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch colleges");
    }

    return response.json();
  } catch (error) {
    console.error(
      "College listing error:",
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    return {
      success: false,
      page,
      limit,
      total: 0,
      totalPages: 0,
      data: [],
    };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const result = await getColleges(params);

  const session = await getServerSession(authOptions);
  const savedColleges = session?.user?.id
    ? await prisma.savedCollege.findMany({
        where: {
          userId: session.user.id,
          collegeId: {
            in: result.data.map((college) => college.id),
          },
        },
        select: {
          collegeId: true,
        },
      })
    : [];

  const savedCollegeIds = new Set(
    savedColleges.map((savedCollege) => savedCollege.collegeId),
  );

  const hasFilters =
    Boolean(params.search) ||
    Boolean(params.location) ||
    Boolean(params.minFees) ||
    Boolean(params.maxFees) ||
    Boolean(params.minRating);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16 lg:px-8 lg:pb-16 lg:pt-20">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-cyan-600">
              <Sparkles size={17} />
              College discovery made simple
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Find the college
              <br />
              <span className="text-cyan-500">
                that fits you.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Search, filter and compare colleges using the
              information that actually matters.
            </p>
          </div>

          <div className="mt-10 max-w-3xl">
            <SearchBar initialValue={params.search} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <FilterPanel
          initialLocation={params.location}
          initialMinFees={params.minFees}
          initialMaxFees={params.maxFees}
          initialMinRating={params.minRating}
        />

        <div className="mt-10 flex flex-col justify-between gap-5 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
              {hasFilters ? "Search results" : "Explore"}
            </p>

            <h2 className="text-3xl font-bold tracking-tight">
              {hasFilters
                ? "Matching colleges"
                : "Featured colleges"}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={15} />

              {result.total}{" "}
              {result.total === 1
                ? "college"
                : "colleges"}{" "}
              found
            </div>
          </div>

          <SortDropdown
            initialSort={params.sort || "rating_desc"}
          />
        </div>

        <div className="mt-2">
          {!result.success ? (
            <div className="border-t border-slate-200 py-20 text-center">
              <Search
                size={30}
                className="mx-auto mb-4 text-slate-400"
              />

              <h3 className="text-xl font-bold">
                Unable to load colleges
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Please refresh the page and try again.
              </p>
            </div>
          ) : result.data.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid gap-6 pt-6 md:grid-cols-2 xl:grid-cols-3">
                {result.data.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    initialSaved={savedCollegeIds.has(college.id)}
                  />
                ))}
              </div>

              <Pagination
                page={result.page}
                totalPages={result.totalPages}
              />
            </>
          )}
        </div>
      </section>
      <CompareBar />
    </main>
  );
}