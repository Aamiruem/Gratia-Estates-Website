import {
  ArrowRight,
  Building2,
  CalendarCheck,
  FileCheck2,
  Landmark,
  MapPin,
  Phone,
  Scale,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import ProjectCard from "../components/ProjectCard";
import SEO from "../components/SEO";
import { projects } from "../data/projects";

const filters = [
  "All",
  "Pre-Launch / New Launch",
  "Launched",
  "Ready to Move",
  "Under Development",
];

const developerCount = new Set(projects.map((p) => p.developer)).size;
const sectorCount = new Set(projects.map((p) => p.location)).size;

const buyingTips = [
  {
    icon: Wallet,
    title: "Fix your all-in budget",
    text: "Include stamp duty, registration, GST and other charges, not just the headline price.",
  },
  {
    icon: FileCheck2,
    title: "Check HRERA registration",
    text: "Confirm the project's registration and approvals before paying any booking amount.",
  },
  {
    icon: Scale,
    title: "Compare like for like",
    text: "Compare carpet area, possession timeline and payment plans across your shortlist.",
  },
];

export default function Projects() {
  // ?stage=... (used by the home page stage cards) preselects a filter.
  const [searchParams] = useSearchParams();
  const requestedStage = searchParams.get("stage");
  const [filter, setFilter] = useState(
    filters.includes(requestedStage) ? requestedStage : "All",
  );
  const filtered = useMemo(
    () =>
      filter === "All" ? projects : projects.filter((p) => p.status === filter),
    [filter],
  );
  const countFor = (f) =>
    f === "All" ? projects.length : projects.filter((p) => p.status === f).length;

  return (
    <>
      <SEO
        title="Gurgaon Property Projects | New Launch & Ready-to-Move Flats | Gratia Estates"
        description="Browse curated residential projects in Gurgaon from DLF, SOBHA, Godrej, M3M and more, including pre-launch, launched, under-construction and ready-to-move homes."
        path="/projects"
      />
      <PageHero
        crumb="Projects"
        eyebrow="Curated residential projects"
        title="Gurgaon Projects"
        text="Explore selected new-launch, under-construction and ready-to-move homes across Gurgaon. Filter by project stage and open any project for highlights, amenities and location."
        aside={
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Building2, value: projects.length, label: "Projects" },
              { icon: Landmark, value: developerCount, label: "Developers" },
              { icon: MapPin, value: sectorCount, label: "Sectors" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#e7e2d8] bg-white p-4 text-center shadow-sm sm:p-5"
              >
                <span className="mx-auto grid size-11 place-items-center rounded-xl bg-[#142536] text-[#e1c98f]">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <strong className="mt-3 block font-display text-3xl font-bold text-[#142536]">
                  {value}
                </strong>
                <span className="text-[11px] font-bold uppercase tracking-[.14em] text-[#80602b]">
                  {label}
                </span>
              </div>
            ))}
            <a
              href="tel:+919109776155"
              className="col-span-3 flex items-center justify-between gap-3 rounded-2xl bg-[#142536] p-4 text-white transition hover:bg-[#1f3a52] sm:p-5"
            >
              <span className="text-sm">
                Need help shortlisting?
                <strong className="block text-[#e1c98f]">
                  Call +91 91097 76155
                </strong>
              </span>
              <span className="grid size-11 place-items-center rounded-full bg-[#c9a45c] text-[#142536]">
                <Phone size={18} aria-hidden="true" />
              </span>
            </a>
          </div>
        }
      />

      <section className="py-12 sm:py-16">
        <div className="container-luxury">
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={18} className="mr-2 text-[#9a7940]" aria-hidden="true" />
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[.12em] transition ${filter === f ? "border-[#142536] bg-[#142536] text-white" : "border-[#e7e2d8] bg-white text-[#142536] hover:border-[#c9a45c]"}`}
              >
                {f}
                <span
                  className={`rounded-full px-1.5 text-[10px] ${filter === f ? "bg-[#c9a45c] text-[#142536]" : "bg-[#f3ead8] text-[#80602b]"}`}
                >
                  {countFor(f)}
                </span>
              </button>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          {!filtered.length && (
            <div className="rounded-2xl border border-dashed border-[#d9dce0] bg-white py-16 text-center text-[#5e6872]">
              No projects match this filter yet.
            </div>
          )}
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container-luxury grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-[#e7e2d8] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#80602b]">
              Before you shortlist
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-[#142536] sm:text-3xl">
              Three checks for every Gurgaon project
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {buyingTips.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-2xl bg-[#f7f4ed] p-5">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-[#142536]">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#5e6872]">{text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative isolate flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1b2a] via-[#142536] to-[#24405a] p-6 text-white sm:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 -z-10 size-56 rounded-full bg-[#c9a45c]/25 blur-3xl"
              aria-hidden="true"
            />
            <div>
              <span className="grid size-12 place-items-center rounded-2xl bg-[#c9a45c] text-[#142536]">
                <CalendarCheck size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold !text-white sm:text-3xl">
                Can't find the right fit?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Tell us your budget, preferred sector and timeline. We'll
                suggest relevant options and help arrange site visits.
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#c9a45c] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#142536] transition hover:bg-[#e1c98f]"
            >
              Share your requirement <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
