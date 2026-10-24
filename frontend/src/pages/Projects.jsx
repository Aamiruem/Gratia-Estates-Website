import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

const filters = [
  "All",
  "Pre-Launch / New Launch",
  "Launched",
  "Ready to Move",
  "Under Development",
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
  return (
    <>
      <SEO
        title="Gurgaon Property Projects | Gratia Estates"
        description="Browse curated residential projects in Gurgaon including pre-launch, launched, under-development and ready-to-move properties."
        path="/projects"
      />
      <section className="bg-white py-20 text-charcoal">
        <div className="container-luxury">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-charcoal/45">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="text-gold">Projects</span>
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl">
            Gurgaon Projects
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal/60">
            Explore selected residential opportunities across Gurgaon. Filter by
            project stage and open a project for details.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-luxury">
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={18} className="mr-2 text-gold" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[.12em] transition ${filter === f ? "border-charcoal bg-charcoal text-white" : "border-black/10 bg-white hover:border-gold"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          {!filtered.length && (
            <div className="py-20 text-center text-black/50">
              No projects match this filter yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
