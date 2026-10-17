import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-luxury transition hover:-translate-y-1">
      <Link to={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={project.image}
            alt={`${project.name} ${project.type} property in ${project.location}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-4 top-4 rounded-full bg-charcoal/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-white">
            {project.status}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-2 flex items-center gap-2 text-xs text-black/50">
            <MapPin size={14} /> {project.location}
          </div>
          <h3 className="font-display text-2xl text-charcoal">
            {project.name}
          </h3>
          <p className="mt-2 text-sm text-black/50">{project.developer}</p>
          <div className="mt-5 flex items-end justify-between gap-3 border-t border-black/10 pt-5">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[.15em] text-black/40">
                Starting
              </span>
              <span className="mt-1 block font-semibold">{project.price}</span>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition group-hover:border-gold group-hover:bg-gold">
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
