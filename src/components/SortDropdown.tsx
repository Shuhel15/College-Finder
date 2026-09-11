"use client";

import { ArrowDownUp } from "lucide-react";
import { useRouter } from "next/navigation";

type SortDropdownProps = {
  initialSort: string;
};

export default function SortDropdown({
  initialSort,
}: SortDropdownProps) {
  const router = useRouter();

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const params = new URLSearchParams(
      window.location.search
    );

    const value = event.target.value;

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    params.set("page", "1");

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl px-2 transition-colors hover:bg-slate-50">
      <ArrowDownUp
        size={17}
        className="text-slate-400 transition-transform duration-200 group-hover:-translate-y-0.5"
      />

      <label
        htmlFor="sort"
        className="text-sm font-medium text-slate-500"
      >
        Sort by
      </label>

      <select
        id="sort"
        value={initialSort}
        onChange={handleChange}
        className="cursor-pointer border-0 bg-transparent py-2 text-sm font-semibold text-slate-900 outline-none"
      >
        <option value="rating_desc">
          Rating: High to Low
        </option>

        <option value="rating_asc">
          Rating: Low to High
        </option>

        <option value="fees_low">
          Fees: Low to High
        </option>

        <option value="fees_high">
          Fees: High to Low
        </option>

        <option value="placement_high">
          Placement: High to Low
        </option>

        <option value="name_asc">
          Name: A to Z
        </option>
      </select>
    </div>
  );
}