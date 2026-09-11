"use client";

import Link from "next/link";
import {
  ArrowRight,
  GitCompareArrows,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STORAGE_KEY = "collegefinder_compare";
const COMPARE_EVENT = "collegefinder_compare_change";
const LIMIT_EVENT = "collegefinder_compare_limit";

type CollegePreview = {
  id: string;
  name: string;
};

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

export default function CompareBar() {
  const [ids, setIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<CollegePreview[]>(
    []
  );
  const [showLimitMessage, setShowLimitMessage] =
    useState(false);

  useEffect(() => {
    const update = () => {
      setIds(getSelectedIds());
    };

    update();

    window.addEventListener(COMPARE_EVENT, update);

    window.addEventListener("storage", update);

    const handleLimit = () => {
      setShowLimitMessage(true);

      window.setTimeout(() => {
        setShowLimitMessage(false);
      }, 2500);
    };

    window.addEventListener(
      LIMIT_EVENT,
      handleLimit
    );

    return () => {
      window.removeEventListener(
        COMPARE_EVENT,
        update
      );

      window.removeEventListener("storage", update);

      window.removeEventListener(
        LIMIT_EVENT,
        handleLimit
      );
    };
  }, []);

useEffect(() => {
  let cancelled = false;

  async function loadCollegeNames() {
    if (ids.length === 0) {
      return;
    }

    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          const response = await fetch(
            `/api/colleges/${encodeURIComponent(id)}`
          );

          if (!response.ok) {
            return null;
          }

          const result = await response.json();

          if (!result.data) {
            return null;
          }

          return {
            id: result.data.id,
            name: result.data.name,
          };
        })
      );

      if (!cancelled) {
        setColleges(
          results.filter(
            (college): college is CollegePreview =>
              college !== null
          )
        );
      }
    } catch {
      if (!cancelled) {
        setColleges([]);
      }
    }
  }

  loadCollegeNames();

  return () => {
    cancelled = true;
  };
}, [ids]);

  function removeCollege(id: string) {
    const nextIds = ids.filter(
      (collegeId) => collegeId !== id
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextIds)
    );

    window.dispatchEvent(
      new CustomEvent(COMPARE_EVENT)
    );
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);

    window.dispatchEvent(
      new CustomEvent(COMPARE_EVENT)
    );
  }

  if (ids.length === 0) {
    return null;
  }

  const compareIds = colleges
    .map((college) => college.id)
    .join(",");

  return (
    <>
      {showLimitMessage && (
        <div className="fixed bottom-24 left-1/2 z-60 -translate-x-1/2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          You can compare a maximum of 3 colleges.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <GitCompareArrows size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-950">
                Compare colleges
              </p>

              <p className="text-xs text-slate-500">
                {ids.length}/3 selected
              </p>
            </div>

            <div className="hidden min-w-0 items-center gap-2 md:flex">
              {colleges.map((college) => (
                <div
                  key={college.id}
                  className="flex max-w-48 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <span className="truncate text-xs font-semibold text-slate-700">
                    {college.name}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeCollege(college.id)
                    }
                    aria-label={`Remove ${college.name}`}
                    className="group shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-95"
                  >
                    <X size={14} className="transition-transform duration-200 group-hover:rotate-90" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-500 active:scale-95"
            >
              Clear all
            </button>

            <Link
              href={
                colleges.length >= 2
                  ? `/compare?ids=${encodeURIComponent(
                      compareIds
                    )}`
                  : "#"
              }
              aria-disabled={colleges.length < 2}
              className={`group inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition active:scale-95 ${
                colleges.length >= 2
                  ? "bg-cyan-500 text-white hover:bg-cyan-600"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
              onClick={(event) => {
                if (colleges.length < 2) {
                  event.preventDefault();
                }
              }}
            >
              Compare
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}