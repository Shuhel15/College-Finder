"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogIn, LogOut, UserPlus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Compare", href: "/compare" },
  { name: "Saved", href: "/saved" },
  { name: "Q&A", href: "/discussions" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 lg:px-6">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/75 px-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2 transition-transform duration-200 active:scale-95"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 text-lg font-bold text-white shadow-sm shadow-cyan-500/30 transition-transform duration-200 group-hover:-translate-y-0.5">
            C
          </span>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            College<span className="text-cyan-500">Finder</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-xl bg-slate-100/70 p-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-cyan-600 hover:shadow-sm active:scale-95"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-100" />
          ) : session?.user ? (
            <>
              <div className="flex max-w-44 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-white shadow-lg shadow-black/20">
                  {session.user.name?.charAt(0).toUpperCase() ||
                    session.user.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>

                <span className="truncate text-sm font-medium text-slate-700">
                  {session.user.name || session.user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-red-500 hover:text-red-600 active:scale-95 active:shadow-none"
              >
                <LogOut size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-600 active:scale-95 active:shadow-none"
              >
                <LogIn size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                Login
              </Link>

              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 active:shadow-none"
              >
                <UserPlus size={16} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="group rounded-xl p-2 text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-600 active:scale-95 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X size={24} className="transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <Menu size={24} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/70 bg-white/90 px-4 py-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-600 active:scale-95"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            {status === "loading" ? (
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
            ) : session?.user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-white shadow-lg shadow-black/20">
                    {session.user.name?.charAt(0).toUpperCase() ||
                      session.user.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {session.user.name || "User"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-red-500 hover:text-red-600 active:scale-95 active:shadow-none"
                >
                  <LogOut size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 active:scale-95 active:shadow-none"
                >
                  <LogIn size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition hover:bg-cyan-600 active:scale-95 active:shadow-none"
                >
                  <UserPlus size={16} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
