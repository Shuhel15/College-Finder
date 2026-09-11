"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SearchBarProps = {
  initialValue?: string;
};

export default function SearchBar({
  initialValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);

    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.push(`/?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60 transition-shadow focus-within:border-cyan-300 focus-within:shadow-xl focus-within:shadow-cyan-100/60 sm:flex-row sm:gap-0"
    >
      <div className="flex min-w-0 flex-1 items-center rounded-xl bg-slate-50 transition-colors focus-within:bg-white">
        <Search
          size={19}
          className="ml-4 shrink-0 text-cyan-500"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Search colleges"
          placeholder="Search by college name, city, or course..."
          className="w-full bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-cyan-200 transition-all hover:-translate-y-0.5 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-200/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:translate-y-0 sm:ml-2"
      >
        Search
      </button>
    </form>
  );
}