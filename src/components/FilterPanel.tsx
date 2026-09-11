"use client";

import { Filter, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type FilterPanelProps = {
  initialLocation?: string;
  initialMinFees?: string;
  initialMaxFees?: string;
  initialMinRating?: string;
};

export default function FilterPanel({
  initialLocation = "",
  initialMinFees = "",
  initialMaxFees = "",
  initialMinRating = "",
}: FilterPanelProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [minFees, setMinFees] = useState(initialMinFees);
  const [maxFees, setMaxFees] = useState(initialMaxFees);
  const [minRating, setMinRating] = useState(initialMinRating);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);

    if (location.trim()) {
      params.set("location", location.trim());
    } else {
      params.delete("location");
    }

    if (minFees) {
      params.set("minFees", minFees);
    } else {
      params.delete("minFees");
    }

    if (maxFees) {
      params.set("maxFees", maxFees);
    } else {
      params.delete("maxFees");
    }

    if (minRating) {
      params.set("minRating", minRating);
    } else {
      params.delete("minRating");
    }

    params.set("page", "1");

    router.push(`/?${params.toString()}`);
  }

  function resetFilters() {
    const params = new URLSearchParams();

    const search = new URLSearchParams(
      window.location.search
    ).get("search");

    const sort = new URLSearchParams(
      window.location.search
    ).get("sort");

    if (search) {
      params.set("search", search);
    }

    if (sort) {
      params.set("sort", sort);
    }

    router.push(params.toString()
      ? `/?${params.toString()}`
      : "/");
  }

  return (
    <form
      onSubmit={applyFilters}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <Filter size={18} />
          </span>

          <div>
            <h3 className="font-bold text-slate-950">Refine your results</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Narrow colleges by your preferences
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <label
            htmlFor="location"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Location
          </label>

          <input
            id="location"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            placeholder="e.g. Delhi"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="minFees"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Min fees
          </label>

          <input
            id="minFees"
            type="number"
            min="0"
            value={minFees}
            onChange={(event) =>
              setMinFees(event.target.value)
            }
            placeholder="₹50,000"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="maxFees"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Max fees
          </label>

          <input
            id="maxFees"
            type="number"
            min="0"
            value={maxFees}
            onChange={(event) =>
              setMaxFees(event.target.value)
            }
            placeholder="₹500,000"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="minRating"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Minimum rating
          </label>

          <select
            id="minRating"
            value={minRating}
            onChange={(event) =>
              setMinRating(event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          >
            <option value="">Any rating</option>
            <option value="4.5">4.5+</option>
            <option value="4">4.0+</option>
            <option value="3.5">3.5+</option>
            <option value="3">3.0+</option>
            <option value="2.5">2.5+</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="w-full rounded-xl bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-slate-300 transition-all hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-200/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:translate-y-0 sm:w-auto"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
}