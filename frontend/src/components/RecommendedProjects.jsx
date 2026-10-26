import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { recommendForVisitor } from "../utils/recommender";

// "Recommended for you": shown only once the visitor has viewed a project,
// so the list is genuinely personalised rather than a generic default.
export default function RecommendedProjects({ excludeSlug, className = "py-12 sm:py-16" }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    setResult(recommendForVisitor(3, excludeSlug));
  }, [excludeSlug]);

  if (!result?.personalised || result.items.length === 0) return null;

  return (
    <section className={className}>
      <div className="container-luxury">
        <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-gold">
          <Sparkles size={13} aria-hidden="true" /> Picked for you
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">Recommended for you</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
          Based on the projects you have explored: similar budget, location,
          stage and features.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.items.map(({ project, reasons }) => (
            <ProjectCard key={project.slug} project={project} reasons={reasons} />
          ))}
        </div>
      </div>
    </section>
  );
}
