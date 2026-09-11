"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type PaginationProps = {
  page: number;
  totalPages: number;
};

export default function Pagination({
  page,
  totalPages,
}: PaginationProps) {
  const router = useRouter();

  if (totalPages <= 1) {
    return null;
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(
      window.location.search
    );

    params.set("page", String(nextPage));

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-cyan-600 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <div className="text-sm text-slate-500">
        Page{" "}
        <span className="font-semibold text-slate-950">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-950">
          {totalPages}
        </span>
      </div>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-cyan-600 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}