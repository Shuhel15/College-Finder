import Link from "next/link";
import {
  ArrowUpRight,
  IndianRupee,
  MapPin,
  Star,
  TrendingUp,
  Trophy,
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
};

type CollegeComparisonTableProps = {
  colleges: College[];
};

function formatAmount(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600">
      <Star
        size={14}
        fill="currentColor"
      />
      {value.toFixed(1)}
    </span>
  );
}

export default function CollegeComparisonTable({
  colleges,
}: CollegeComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-190 w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="w-48 px-6 py-6 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Compare
              </th>

              {colleges.map((college) => (
                <th
                  key={college.id}
                  className="min-w-60 border-l border-slate-200 px-6 py-6 text-left align-top"
                >
                  <h2 className="text-lg font-bold leading-6 text-slate-950">
                    {college.name}
                  </h2>

                  <Link
                    href={`/colleges/${college.slug}`}
                    className="group mt-3 inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold text-cyan-600 transition hover:bg-cyan-50 hover:text-cyan-700 active:scale-95"
                  >
                    View details
                    <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-slate-200">
              <td className="px-6 py-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin
                    size={17}
                    className="text-cyan-500"
                  />
                  Location
                </div>
              </td>

              {colleges.map((college) => (
                <td
                  key={college.id}
                  className="border-l border-slate-200 px-6 py-6 text-sm text-slate-600"
                >
                  {college.location}
                </td>
              ))}
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-6 py-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <IndianRupee
                    size={17}
                    className="text-cyan-500"
                  />
                  Annual fees
                </div>
              </td>

              {colleges.map((college) => (
                <td
                  key={college.id}
                  className="border-l border-slate-200 px-6 py-6 text-base font-bold text-slate-950"
                >
                  {formatAmount(college.fees)}
                </td>
              ))}
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-6 py-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Star
                    size={17}
                    className="text-amber-500"
                  />
                  Rating
                </div>
              </td>

              {colleges.map((college) => (
                <td
                  key={college.id}
                  className="border-l border-slate-200 px-6 py-6"
                >
                  <Rating value={college.rating} />
                </td>
              ))}
            </tr>

            <tr className="border-b border-slate-200">
              <td className="px-6 py-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <TrendingUp
                    size={17}
                    className="text-cyan-500"
                  />
                  Average placement
                </div>
              </td>

              {colleges.map((college) => (
                <td
                  key={college.id}
                  className="border-l border-slate-200 px-6 py-6 text-base font-bold text-slate-950"
                >
                  {formatAmount(
                    college.averagePlacement
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-6 py-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Trophy
                    size={17}
                    className="text-cyan-500"
                  />
                  Highest placement
                </div>
              </td>

              {colleges.map((college) => (
                <td
                  key={college.id}
                  className="border-l border-slate-200 px-6 py-6 text-base font-bold text-slate-950"
                >
                  {formatAmount(
                    college.highestPlacement
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}