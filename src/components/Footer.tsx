import Link from "next/link";
import {
  ArrowUp,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

const exploreLinks = [
  { name: "Find colleges", href: "/" },
  { name: "Compare colleges", href: "/compare" },
  { name: "Saved colleges", href: "/saved" },
];

const communityLinks = [
  { name: "Discussions", href: "/discussions" },
  { name: "Register", href: "/register" },
  { name: "Login", href: "/login" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))_minmax(0,1.2fr)] md:gap-8">
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 transition-transform active:scale-95"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-lg font-bold text-white shadow-md shadow-cyan-500/20 transition-transform group-hover:-translate-y-0.5">
                C
              </span>

              <span className="text-xl font-bold tracking-tight text-slate-900">
                College<span className="text-cyan-500">Finder</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Find, compare and choose the college that fits your future.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Explore
            </h2>

            <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Explore links">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-500 transition hover:translate-x-0.5 hover:text-cyan-600"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Community
            </h2>

            <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Community links">
              {communityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-500 transition hover:translate-x-0.5 hover:text-cyan-600"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Get in touch
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <p className="flex items-start gap-2">
                <MapPin size={17} className="mt-0.5 shrink-0 text-cyan-500" />
                <span>Helping students find their best fit.</span>
              </p>

              <a
                href="mailto:hello@collegefinder.com"
                className="flex items-center gap-2 transition hover:text-cyan-600"
              >
                <Mail size={17} className="shrink-0 text-cyan-500" />
                hello@collegefinder.com
              </a>

              <Link
                href="/discussions"
                className="inline-flex items-center gap-2 transition hover:text-cyan-600"
              >
                <MessageCircle size={17} className="shrink-0 text-cyan-500" />
                Ask the community
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} CollegeFinder. All rights reserved.
          </p>

          <p className="flex items-center justify-center gap-1">
            Made with <Heart size={14} className="fill-cyan-500 text-cyan-500" /> for students
          </p>

          <a
            href="#top"
            className="group inline-flex items-center justify-center gap-2 self-center rounded-xl border border-slate-200 px-3 py-2 font-medium text-slate-600 transition hover:border-cyan-500 hover:text-cyan-600 active:scale-95 sm:self-auto"
          >
            Back to top
            <ArrowUp size={15} className="transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
