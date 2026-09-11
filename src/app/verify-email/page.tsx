"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  MailCheck,
  RefreshCw,
} from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid verification code.");
        return;
      }

      setSuccess(
        "Email verified successfully. Redirecting to login...",
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setError(
        "Unable to verify your email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await fetch(
        "/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to resend verification code.",
        );
        return;
      }

      setSuccess("A new verification code has been sent.");
    } catch {
      setError(
        "Unable to resend the verification code.",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight transition-transform duration-200 active:scale-95"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-lg text-white">
              C
            </span>

            <span className="text-slate-900">
              College<span className="text-cyan-500">Finder</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
            <MailCheck size={28} />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Verify your email
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We sent a 6-digit verification code to
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-slate-700">
              {email}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Verification code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6),
                  )
                }
                placeholder="000000"
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xl font-semibold tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:bg-slate-50"
              />

              <p className="mt-2 text-center text-xs text-slate-400">
                Code expires in 10 minutes.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify email"}

              {!loading && <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />}
            </button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="group mx-auto mt-5 flex items-center gap-2 text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={15} className="transition-transform duration-200 group-hover:-rotate-45" />
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </div>
    </main>
  );
}