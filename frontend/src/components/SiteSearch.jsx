import { ArrowRight, BookOpen, Building2, CornerDownLeft, FileText, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { projects } from "../data/projects";
import { posts } from "../data/blogs";

const PAGES = [
  { title: "All projects", to: "/projects", keywords: "projects flats homes property list browse" },
  { title: "Book a site visit", to: "/book-visit", keywords: "book visit site schedule appointment tour" },
  { title: "Property videos", to: "/videos", keywords: "videos walkthrough tour youtube" },
  { title: "Blog & buying guides", to: "/blog", keywords: "blog guides articles insights tips" },
  { title: "Contact Gratia Estates", to: "/contact", keywords: "contact phone call whatsapp email office address" },
  { title: "About Gratia Estates", to: "/about", keywords: "about company team advisory gratia estates" },
];

// Everything searchable, with the text each entry is matched against.
const INDEX = [
  ...projects.map((project) => ({
    group: "Projects",
    icon: Building2,
    title: project.name,
    subtitle: `${project.developer} · ${project.location} · ${project.status}`,
    meta: project.price,
    to: `/projects/${project.slug}`,
    primary: project.name,
    text: [project.developer, project.location, project.status, project.type, ...(project.highlights || [])].join(" "),
  })),
  ...posts.map((post) => ({
    group: "Guides",
    icon: BookOpen,
    title: post.title,
    subtitle: post.excerpt,
    to: `/blog/${post.slug}`,
    primary: post.title,
    text: post.excerpt || "",
  })),
  ...PAGES.map((page) => ({ group: "Pages", icon: FileText, title: page.title, to: page.to, primary: page.title, text: page.keywords })),
];

const normalise = (value) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
INDEX.forEach((entry) => {
  entry.primaryNorm = normalise(entry.primary);
  entry.textNorm = normalise(entry.text);
});

// Every word the visitor types must appear; matches in the name rank higher,
// and so do matches at the start of a word.
function search(query) {
  const words = normalise(query).split(" ").filter(Boolean);
  if (!words.length) return [];
  return INDEX.map((entry) => {
    let score = 0;
    for (const word of words) {
      const inName = entry.primaryNorm.indexOf(word);
      const inText = entry.textNorm.indexOf(word);
      if (inName === -1 && inText === -1) return null;
      if (inName !== -1) score += inName === 0 ? 6 : entry.primaryNorm[inName - 1] === " " ? 4 : 2;
      else score += entry.textNorm[inText - 1] === " " || inText === 0 ? 1.5 : 0.75;
    }
    return { ...entry, score: score + (entry.group === "Projects" ? 0.5 : 0) };
  })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

const SUGGESTIONS = ["DLF", "Sobha", "Ready to Move", "Sector 76", "Dwarka Expressway", "Site visit"];

export default function SiteSearch({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const results = useMemo(() => search(query), [query]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const go = (entry) => {
    if (!entry) return;
    setOpen(false);
    navigate(entry.to);
  };

  const onInputKey = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search projects and guides"
        className={`inline-flex items-center gap-2 rounded-full border border-[#e7e2d8] bg-[#f8f6f1] text-[#142536] transition hover:border-[#c9a45c] hover:text-[#9a7940] ${className}`}
      >
        <Search size={18} strokeWidth={2} aria-hidden="true" />
        <span className="hidden text-[13px] font-semibold lg:inline">Search</span>
        <kbd className="hidden rounded-md border border-[#e7e2d8] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#68737e] 2xl:inline">Ctrl K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-[#0b1621]/60 px-4 pt-[10vh] backdrop-blur-sm"
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search Gratia Estates"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_90px_rgba(0,0,0,.35)]">
            <div className="flex items-center gap-3 border-b border-[#eee9df] px-5">
              <Search size={20} className="shrink-0 text-[#9a7940]" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search projects, developers, sectors or guides…"
                aria-label="Search"
                aria-controls="site-search-results"
                aria-activedescendant={results[active] ? `search-result-${active}` : undefined}
                className="h-16 min-w-0 flex-1 bg-transparent text-base text-[#142536] outline-none placeholder:text-[#9ba2a9] focus-visible:outline-none"
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close search" className="grid size-9 place-items-center rounded-full text-[#68737e] hover:bg-[#f4f0e7] hover:text-[#142536]">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {!query.trim() ? (
                <div className="p-3">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#9a7940]">Popular searches</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setQuery(suggestion)}
                        className="rounded-full border border-[#e7e2d8] bg-[#fbfaf7] px-3.5 py-1.5 text-sm font-medium text-[#263746] transition hover:border-[#c9a45c] hover:bg-[#fbf6ea]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-semibold text-[#142536]">No matches for “{query}”</p>
                  <p className="mt-1 text-sm text-[#68737e]">Try a developer (DLF, Godrej), a sector number or a project stage.</p>
                </div>
              ) : (
                <ul id="site-search-results" role="listbox" className="grid gap-1">
                  {results.map((entry, index) => {
                    const Icon = entry.icon;
                    const selected = index === active;
                    return (
                      <li key={entry.to} id={`search-result-${index}`} role="option" aria-selected={selected}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(index)}
                          onClick={() => go(entry)}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${selected ? "bg-[#fbf6ea]" : "hover:bg-[#fbfaf7]"}`}
                        >
                          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${selected ? "bg-[#142536] text-[#e1c98f]" : "bg-[#f4f0e7] text-[#9a7940]"}`}>
                            <Icon size={18} aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline gap-2">
                              <span className="truncate font-semibold text-[#142536]">{entry.title}</span>
                              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[.12em] text-[#9aa3ac]">{entry.group}</span>
                            </span>
                            {entry.subtitle && <span className="mt-0.5 block truncate text-xs text-[#68737e]">{entry.subtitle}</span>}
                          </span>
                          {entry.meta && <span className="hidden shrink-0 text-xs font-semibold text-[#263746] sm:block">{entry.meta}</span>}
                          {selected ? <CornerDownLeft size={15} className="shrink-0 text-[#9a7940]" aria-hidden="true" /> : <ArrowRight size={15} className="shrink-0 text-[#c4c9ce]" aria-hidden="true" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
