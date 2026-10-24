import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Shared two-column page header: breadcrumb, title and intro on the left,
// supporting content (stats, links, summary) on the right.
export default function PageHero({ crumb, eyebrow, title, text, aside, children }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#e7e2d8] bg-gradient-to-br from-[#fbf8f2] via-[#f6efe2] to-[#efe4cf]">
      <div
        className="pointer-events-none absolute -bottom-32 right-0 -z-10 size-[26rem] rounded-full bg-[#c9a45c]/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-luxury grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-[#68717a]"
          >
            <Link to="/" className="transition hover:text-[#9a7940]">
              Home
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-[#9a7940]" aria-current="page">
              {crumb}
            </span>
          </nav>
          {eyebrow && (
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[.22em] text-[#80602b]">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-[#142536] sm:text-5xl">
            {title}
          </h1>
          {text && (
            <p className="mt-5 max-w-2xl border-l-4 border-[#c9a45c] pl-4 text-base leading-7 text-[#4b5966] sm:text-lg sm:leading-8">
              {text}
            </p>
          )}
          {children}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}
