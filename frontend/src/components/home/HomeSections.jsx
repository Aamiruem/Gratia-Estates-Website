import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarCheck,
  Hammer,
  KeyRound,
  Landmark,
  Layers,
  Play,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BlogCard } from "../blog";
import { posts } from "../../data/blog";
import { projects } from "../../data/projects";

const developers = [...new Set(projects.map((p) => p.developer).filter(Boolean))];

const stages = [
  {
    status: "Ready to Move",
    icon: KeyRound,
    blurb: "Move in sooner, in an established community.",
  },
  {
    status: "Launched",
    icon: Rocket,
    blurb: "Newly launched towers with current pricing.",
  },
  {
    status: "Under Development",
    icon: Hammer,
    blurb: "Construction-stage homes with planned possession.",
  },
  {
    status: "Pre-Launch / New Launch",
    icon: Sparkles,
    blurb: "Early access to upcoming Gurgaon launches.",
  },
].map((stage) => {
  const matches = projects.filter((p) => p.status === stage.status);
  return { ...stage, count: matches.length, image: matches[0]?.image };
});

function SectionHeading({ eyebrow, title, text, light = false }) {
  return (
    <div className="max-w-2xl">
      <div className="gold-line mb-5" />
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.25em] sm:text-[11px] ${light ? "text-[#e1c98f]" : "text-[#80602b]"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl ${light ? "text-white" : "text-[#142536]"}`}
      >
        {title}
      </h2>
      {text && (
        <p
          className={`mt-4 text-sm leading-7 sm:text-base ${light ? "text-white/70" : "text-[#5e6872]"}`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

// Navy band of real figures taken from the project data, plus developers.
export function StatsBand() {
  const stats = [
    { icon: Building2, value: `${projects.length}+`, label: "Curated projects" },
    { icon: Landmark, value: `${developers.length}`, label: "Leading developers" },
    { icon: Layers, value: `${stages.filter((s) => s.count).length}`, label: "Project stages covered" },
    { icon: Users, value: "1:1", label: "Personal advisory" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#142536] py-14 text-white sm:py-16">
      <div
        className="pointer-events-none absolute -left-24 top-0 -z-10 size-80 rounded-full bg-[#c9a45c]/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-luxury">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-5"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-3xl font-bold text-[#e1c98f]">
                  {value}
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
                  {label}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 lg:flex-row lg:items-center">
          <p className="shrink-0 text-[11px] font-bold uppercase tracking-[.2em] text-[#e1c98f]">
            Projects from
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {developers.map((name) => (
              <li
                key={name}
                className="rounded-full border border-white/15 bg-white/[.06] px-4 py-2 text-sm font-semibold text-white/90"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// Image cards for each project stage, linking to the filtered project list.
export function BrowseByStage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Find your fit"
          title="Browse by project stage"
          text="Whether you want to move in now or buy early in a new launch, start with the stage that suits your plans."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map(({ status, icon: Icon, blurb, count, image }) => (
            <Link
              key={status}
              to={`/projects?stage=${encodeURIComponent(status)}`}
              className="group relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl bg-[#142536] p-6 text-white shadow-luxury"
            >
              {image && (
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105"
                />
              )}
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/60 to-transparent"
                aria-hidden="true"
              />
              <span className="mb-auto grid size-12 place-items-center rounded-2xl bg-[#c9a45c] text-[#142536] shadow-lg">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[.16em] text-[#e1c98f]">
                {count} {count === 1 ? "project" : "projects"}
              </span>
              <span className="mt-1 font-display text-2xl font-semibold">
                {status}
              </span>
              <span className="mt-2 text-sm leading-6 text-white/75">{blurb}</span>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#e1c98f]">
                View projects
                <ArrowUpRight
                  size={15}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Teaser for the videos page.
export function VideoTeaser() {
  const cover = projects[1]?.image || projects[0]?.image;
  return (
    <section className="bg-[#f7f4ed] py-16 sm:py-24">
      <div className="container-luxury grid items-center gap-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#142536] via-[#1b3247] to-[#24405a] p-6 text-white sm:p-10 lg:grid-cols-2 lg:p-14">
        <div>
          <SectionHeading
            light
            eyebrow="Gratia Estates media"
            title="Watch before you visit"
            text="Project introductions, walkthroughs and buyer stories in one place, so you can shortlist with confidence."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/videos"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#c9a45c] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#142536] transition hover:bg-[#e1c98f]"
            >
              <Play size={16} fill="currentColor" aria-hidden="true" /> Watch videos
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white transition hover:border-[#c9a45c] hover:text-[#e1c98f]"
            >
              <CalendarCheck size={16} aria-hidden="true" /> Book a site visit
            </Link>
          </div>
        </div>
        <Link
          to="/videos"
          className="group relative block aspect-video overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
          aria-label="Open the video library"
        >
          {cover && (
            <img
              src={cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 bg-[#0d1b2a]/35" aria-hidden="true" />
          <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#c9a45c] text-[#142536] shadow-xl ring-8 ring-white/20 transition group-hover:scale-110">
            <Play size={30} fill="currentColor" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}

// Latest three blog articles.
export function LatestInsights() {
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  if (!latest.length) return null;
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-luxury">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Property insights"
            title="Read before you buy"
            text="Practical guides on Gurgaon locations, project stages, costs and paperwork."
          />
          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#142536] transition hover:text-[#96713b]"
          >
            <BookOpen size={16} aria-hidden="true" /> All articles
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
