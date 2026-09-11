"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "collegefinder_compare";
const COMPARE_EVENT = "collegefinder_compare_change";
const MAX_COMPARE = 3;

function getSelectedIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function saveSelectedIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));

  window.dispatchEvent(new CustomEvent(COMPARE_EVENT));
}

export default function CompareButton({ collegeId }: { collegeId: string }) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setSelected(getSelectedIds().includes(collegeId));
    };

    updateState();

    window.addEventListener(COMPARE_EVENT, updateState);

    window.addEventListener("storage", updateState);

    return () => {
      window.removeEventListener(COMPARE_EVENT, updateState);

      window.removeEventListener("storage", updateState);
    };
  }, [collegeId]);

  function toggleCompare() {
    const ids = getSelectedIds();

    if (ids.includes(collegeId)) {
      saveSelectedIds(ids.filter((id) => id !== collegeId));

      return;
    }

    if (ids.length >= MAX_COMPARE) {
      window.dispatchEvent(new CustomEvent("collegefinder_compare_limit"));

      return;
    }

    saveSelectedIds([...ids, collegeId]);

    setSelected(true);
  }

  return (
    <button
      type="button"
      onClick={toggleCompare}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
        selected
          ? "border-cyan-500 bg-cyan-50 text-cyan-700"
          : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-600"
      }`}
    >
      {selected ? <Check size={16} /> : <GitCompareArrows size={16} />}

      {selected ? "Compared" : "Compare"}
    </button>
  );
}
