import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  MapPin,
  Star,
} from "lucide-react";

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

function formatAmount(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function CollegeCard({
  college,
}: {
  college: College;
}) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 transition-all duration-200 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-200/50">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <Building2 size={21} />
        </div>

        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
          <Star
            size={16}
            className="text-amber-500"
            fill="currentColor"
          />
          {college.rating.toFixed(1)}
        </div>
      </div>

      {/* College info */}
      <div className="mt-5">
        <h3 className="text-xl font-bold tracking-tight text-slate-950">
          {college.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={15} />
          {college.location}
        </div>
      </div>

      {/* Overview */}
      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
        {college.overview}
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
        <div>
          <p className="text-xs text-slate-400">
            Annual fees
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {formatAmount(college.fees)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Avg. placement
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {formatAmount(college.averagePlacement)}
          </p>
        </div>
      </div>

      {/* Highest placement */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Highest placement
        </span>

        <span className="text-sm font-semibold text-slate-900">
          {formatAmount(college.highestPlacement)}
        </span>
      </div>

      {/* Action */}
      <div className="mt-auto pt-6">
        <Link
          href={`/colleges/${college.slug}`}
          className="flex items-center justify-between border-t border-slate-100 pt-5 text-sm font-semibold text-slate-900 transition-colors hover:text-cyan-600"
        >
          <span>View college details</span>

          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 transition-all group-hover:bg-cyan-50 group-hover:text-cyan-600">
            <ArrowUpRight
              size={17}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </div>
    </article>
  );
}