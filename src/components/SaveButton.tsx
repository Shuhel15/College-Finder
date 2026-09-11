"use client";

import { Bookmark, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  collegeId: string;
  initialSaved?: boolean;
}

export default function SaveButton({
  collegeId,
  initialSaved = false,
}: SaveButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (status === "loading") {
      return;
    }

    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      if (saved) {
        const response = await fetch(`/api/saved/${collegeId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to remove college");
        }

        setSaved(false);
      } else {
        const response = await fetch("/api/saved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collegeId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to save college");
        }

        setSaved(true);
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Save college error:",
        error instanceof Error ? error.message : "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={loading || status === "loading"}
      aria-label={saved ? "Remove college from saved" : "Save college"}
      aria-pressed={saved}
      title={saved ? "Remove from saved colleges" : "Save college"}
      className={`group inline-flex h-10 w-10 items-center justify-center rounded-xl border p-0 transition-all duration-200 active:scale-95 ${
        saved
          ? "border-amber-300 bg-amber-50 text-amber-500 hover:bg-amber-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-600"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? (
        <Loader2 size={17} className="animate-spin" />
      ) : (
        <Bookmark
          size={17}
          fill={saved ? "currentColor" : "none"}
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />
      )}
    </button>
  );
}
