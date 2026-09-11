import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="border-t border-slate-200 py-20 text-center">
      <SearchX
        size={34}
        className="mx-auto mb-5 text-slate-400"
      />

      <h2 className="text-2xl font-bold text-slate-950">
        No colleges found
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        There are no colleges available to display right now.
        Please check back again shortly.
      </p>
    </div>
  );
}