import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  MapPin,
  Phone,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import ProjectCard from "../components/ProjectCard";
import { projects as projectData } from "../data/projects";

const WHATSAPP_NUMBER = "919109776155";
const PHONE_NUMBER = "+919109776155";
const MAX_FEATURED = 8;

const projects = Array.isArray(projectData) ? projectData : [];
const heroSlides = projects.slice(0, MAX_FEATURED);

const trustPoints = [
  {
    Icon: ShieldCheck,
    title: "Trust",
    description:
      "Clear communication and guidance throughout your property journey.",
  },
  {
    Icon: Sparkles,
    title: "Curated options",
    description:
      "Residential opportunities selected around your goals and budget.",
  },
  {
    Icon: TrendingUp,
    title: "Local expertise",
    description:
      "Focused knowledge of Gurgaon sectors, launches, and communities.",
  },
];

const guidancePoints = [
  {
    Icon: ShieldCheck,
    title: "Gurgaon expertise",
    description:
      "Local market knowledge helps you explore suitable sectors and communities.",
  },
  {
    Icon: Search,
    title: "Clear comparisons",
    description:
      "Compare location, project details, developer information, and indicative pricing.",
  },
  {
    Icon: Users,
    title: "Guidance that listens",
    description:
      "Recommendations shaped around your needs, budget, and buying timeline.",
  },
  {
    Icon: Check,
    title: "Focused choices",
    description:
      "Explore pre-launch, new-launch, and ready-to-move residential projects.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Understand",
    description:
      "We learn your budget, preferred location, lifestyle needs, and timeline.",
  },
  {
    number: "02",
    title: "Shortlist",
    description:
      "We compare suitable Gurgaon projects on location, developer, features, and value.",
  },
  {
    number: "03",
    title: "Guide",
    description:
      "We support you from your initial enquiry to project visits and informed decisions.",
  },
];

function safeText(value, fallback = "") {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function projectSearchText(project) {
  const highlights = Array.isArray(project?.highlights)
    ? project.highlights
    : [];
  return [
    project?.name,
    project?.developer,
    project?.location,
    project?.type,
    project?.status,
    project?.price,
    project?.description,
    ...highlights,
  ]
    .map((value) => safeText(value))
    .join(" ")
    .toLowerCase();
}

function HomeContactPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [requirement, setRequirement] = useState("");
  const nameInputRef = useRef(null);

  useEffect(() => {
    // Delay the enquiry prompt so visitors can first see the page.
    const timer = window.setTimeout(() => setIsOpen(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameInputRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const submitEnquiry = (event) => {
    event.preventDefault();

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) return;

    const message = [
      "Hello Gratia Estates, I would like to know more about Gurgaon properties.",
      `Name: ${name.trim()}`,
      `Phone: ${cleanPhone}`,
      `Requirement: ${requirement.trim()}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-charcoal/70 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <section
        aria-labelledby="home-contact-popup-title"
        aria-modal="true"
        className="relative my-auto w-full max-w-[540px] rounded-3xl border border-charcoal/10 bg-white text-charcoal shadow-2xl"
        role="dialog"
      >
        <button
          type="button"
          aria-label="Close contact form"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-charcoal/5 transition hover:bg-charcoal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <X size={19} />
        </button>

        <div className="px-5 pb-6 pt-7 sm:px-8 sm:pb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Gratia Estates
          </p>
          <h2
            id="home-contact-popup-title"
            className="mb-2 pr-12 font-display text-2xl font-bold sm:text-3xl"
          >
            Let’s find your next address
          </h2>
          <p className="mb-6 text-sm leading-6 text-charcoal/65">
            {/* Share your requirement and our team can follow up with relevant
            Gurgaon projects. */}
          </p>

          <form onSubmit={submitEnquiry} className="space-y-4">
            <label className="block" htmlFor="home-popup-name">
              <span className="mb-1.5 block text-sm font-semibold">
                Full name *
              </span>
              <input
                ref={nameInputRef}
                id="home-popup-name"
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={80}
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="h-12 w-full rounded-xl border border-charcoal/15 px-4 text-sm outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
              />
            </label>

            <label className="block" htmlFor="home-popup-phone">
              <span className="mb-1.5 block text-sm font-semibold">
                Mobile number *
              </span>
              <input
                id="home-popup-phone"
                type="tel"
                autoComplete="tel-national"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
                required
                className="h-12 w-full rounded-xl border border-charcoal/15 px-4 text-sm outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
              />
            </label>

            <label className="block" htmlFor="home-popup-requirement">
              <span className="mb-1.5 block text-sm font-semibold">
                Your requirement *
              </span>
              <textarea
                id="home-popup-requirement"
                rows={3}
                maxLength={1000}
                placeholder="Preferred location, budget, property type, or timeline"
                value={requirement}
                onChange={(event) => setRequirement(event.target.value)}
                required
                className="w-full rounded-xl border border-charcoal/15 px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10"
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-5 text-sm font-bold text-white transition hover:bg-gold hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Send size={17} aria-hidden="true" />
              Continue on WhatsApp
            </button>
          </form>

          <div className="mt-5 border-t border-charcoal/10 pt-4 text-center">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-charcoal transition hover:bg-charcoal hover:text-white"
            >
              <Phone size={17} aria-hidden="true" />
              Call +91 91097 76155
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedProjectSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || heroSlides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  if (heroSlides.length === 0) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-charcoal p-8 text-center text-white sm:min-h-[500px]">
        <div>
          <MapPin className="mx-auto mb-4 text-gold" size={34} />
          <h2 className="font-display text-2xl">
            Gurgaon property opportunities
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Featured projects will appear here once project data is added.
          </p>
          <Link
            to="/projects"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold"
          >
            Explore projects <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const activeProject = heroSlides[activeIndex] || heroSlides[0];

  return (
    <div
      className="relative h-[430px] overflow-hidden rounded-3xl bg-charcoal shadow-luxury sm:h-[540px]"
      aria-roledescription="carousel"
      aria-label="Featured Gurgaon properties"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {heroSlides.map((project, index) => (
        <img
          key={project.slug || `${project.name}-${index}`}
          src={project.image || "/assets/property-placeholder.jpg"}
          alt={`${safeText(project.name, "Featured property")}, ${safeText(project.type, "residential property")} in ${safeText(project.location, "Gurgaon")}`}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          aria-hidden={activeIndex !== index}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
            activeIndex === index
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />

      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2 sm:left-6 sm:right-6 sm:top-6">
        <span className="max-w-[55%] rounded-full border border-white/30 bg-black/40 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur sm:px-4">
          {safeText(activeProject.status, "Featured project")}
        </span>
        <span className="rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-charcoal sm:px-4">
          {safeText(activeProject.price, "Price on request")}
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-7 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-8">
        <div className="min-w-0 text-white">
          <p className="inline-block rounded-full bg-gold/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal shadow-sm">
            {safeText(activeProject.developer, "Gurgaon residential")}
          </p>
          <h2 className="mt-2 line-clamp-2 font-display text-2xl font-semibold !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-3xl">
            {safeText(activeProject.name, "Featured property")}
          </h2>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-white/85 sm:text-sm">
            <MapPin size={14} aria-hidden="true" />
            {safeText(activeProject.location, "Gurgaon")}
          </p>
        </div>

        <Link
          to={
            activeProject.slug
              ? `/projects/${activeProject.slug}`
              : "/projects"
          }
          className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold uppercase tracking-wide text-charcoal transition hover:bg-gold"
        >
          View project <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {heroSlides.map((project, index) => (
          <button
            key={project.slug || `${project.name}-dot-${index}`}
            type="button"
            aria-label={`Show ${safeText(project.name, `property ${index + 1}`)}`}
            aria-current={activeIndex === index ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === index
                ? "w-6 bg-gold"
                : "w-1.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [projectQuery, setProjectQuery] = useState("");
  const navigate = useNavigate();
  const featured = projects.slice(0, MAX_FEATURED);

  const searchResults = useMemo(() => {
    const terms = projectQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (!terms.length) return [];

    return projects
      .filter((project) => {
        const searchableText = projectSearchText(project);
        return terms.every((term) => searchableText.includes(term));
      })
      .slice(0, 6);
  }, [projectQuery]);

  const submitProjectSearch = (event) => {
    event.preventDefault();
    if (!searchResults.length) {
      navigate("/projects");
      return;
    }

    const firstResult = searchResults[0];
    if (firstResult.slug) navigate(`/projects/${firstResult.slug}`);
    else navigate("/projects");
    setProjectQuery("");
  };

  return (
    <>
      <SEO
        title="Gratia Estates | Premium Real Estate Advisory in Gurgaon"
        description="Explore Gurgaon residential projects with Gratia Estates. Compare pre-launch, new-launch, and ready-to-move homes with focused local guidance."
      />

      <HomeContactPopup />

      <section className="relative overflow-hidden bg-[#f7f4ed]">
        <div className="container-luxury grid min-h-[640px] items-center gap-10 py-14 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div className="relative z-10">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#96713b] sm:text-[11px] sm:tracking-[0.34em]">
              Gurgaon · Premium Real Estate Advisory
            </p>
            <h1 className="max-w-2xl font-display text-4xl leading-[1.08] text-charcoal sm:text-5xl lg:text-6xl">
              Find the right address for your next chapter.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-charcoal/65 sm:mt-7 sm:text-lg sm:leading-8">
              Curated residential opportunities across Gurgaon — from pre-launch
              and new launches to premium ready-to-move homes.
            </p>

            <div className="mt-7 flex max-w-xl items-start gap-2 sm:gap-3">
              <form
                role="search"
                onSubmit={submitProjectSearch}
                className="relative min-w-0 flex-1"
              >
                <label htmlFor="home-project-search" className="sr-only">
                  Search projects by name, developer, location, status, price,
                  or features
                </label>
                <div className="flex h-14 items-center rounded-full border border-charcoal/15 bg-white p-1.5 shadow-[0_8px_24px_rgba(20,37,54,0.08)] transition focus-within:border-gold focus-within:ring-4 focus-within:ring-gold/10">
                  <input
                    id="home-project-search"
                    type="search"
                    value={projectQuery}
                    onChange={(event) => setProjectQuery(event.target.value)}
                    placeholder="Search Gurgaon projects..."
                    autoComplete="off"
                    aria-controls="home-project-search-results"
                    aria-expanded={Boolean(projectQuery.trim())}
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm text-charcoal outline-none placeholder:text-charcoal/45 focus:ring-0 sm:px-5"
                  />
                  <button
                    type="submit"
                    aria-label="Search projects"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-charcoal text-white transition hover:bg-gold hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    <Search size={19} aria-hidden="true" />
                  </button>
                </div>

                {projectQuery.trim() && (
                  <div
                    id="home-project-search-results"
                    aria-live="polite"
                    className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-black/10 bg-white py-1 shadow-xl"
                  >
                    {searchResults.length ? (
                      searchResults.map((project, index) => (
                        <Link
                          key={project.slug || `${project.name}-${index}`}
                          to={
                            project.slug
                              ? `/projects/${project.slug}`
                              : "/projects"
                          }
                          onClick={() => setProjectQuery("")}
                          className="flex flex-col gap-1 border-b border-black/5 px-5 py-4 last:border-0 hover:bg-[#f7f4ed] sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="flex items-center justify-between gap-3 font-semibold text-charcoal">
                            {safeText(project.name, "Residential project")}
                            <ArrowUpRight
                              size={16}
                              className="shrink-0 text-gold"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="text-xs text-charcoal/60">
                            {safeText(project.location, "Gurgaon")} ·{" "}
                            {safeText(project.status, "Details available")}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="px-5 py-4 text-sm text-charcoal/65">
                        No matching projects found. Try a project name, sector,
                        developer, or price.
                      </p>
                    )}
                  </div>
                )}
              </form>

              <Link
                to="/projects"
                className="inline-flex min-h-14 shrink-0 items-center justify-center gap-1.5 rounded-full bg-charcoal px-3 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-gold hover:text-charcoal sm:gap-2 sm:px-5 sm:text-xs"
              >
                Explore <span className="hidden sm:inline">projects</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-2 sm:mt-12 sm:gap-3">
              <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-5">
                <strong className="font-display text-2xl text-[#96713b] sm:text-3xl">
                  {projects.length}+
                </strong>
                <span className="mt-1 block text-[9px] font-bold uppercase leading-4 tracking-wide text-charcoal/65 sm:text-[10px]">
                  Projects listed
                </span>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-5">
                <strong className="font-display text-2xl text-[#96713b] sm:text-3xl">
                  100%
                </strong>
                <span className="mt-1 block text-[9px] font-bold uppercase leading-4 tracking-wide text-charcoal/65 sm:text-[10px]">
                  Gurgaon focus
                </span>
              </div>
              <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-5">
                <strong className="font-display text-2xl text-[#96713b] sm:text-3xl">
                  1:1
                </strong>
                <span className="mt-1 block text-[9px] font-bold uppercase leading-4 tracking-wide text-charcoal/65 sm:text-[10px]">
                  Personal advice
                </span>
              </div>
            </div>
          </div>

          <FeaturedProjectSlider />
        </div>
      </section>

      <section className="border-y border-charcoal/10 bg-[#f5f1e8] text-charcoal">
        <div className="container-luxury grid gap-4 py-12 sm:grid-cols-3 sm:gap-6 sm:py-16">
          {trustPoints.map(({ Icon, title, description }) => (
            <article
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-white/85 p-5 shadow-sm sm:p-6"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold/15">
                <Icon className="text-[#96713b]" size={24} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold sm:text-2xl">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-charcoal/70">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-luxury">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
            <div>
              <div className="gold-line mb-5" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50 sm:text-[11px]">
                Curated opportunities
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-5xl">
                Featured Gurgaon Projects
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/60">
                Explore selected residential projects and compare the details
                that matter to you.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal transition hover:text-[#96713b]"
            >
              View all projects <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {featured.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((project, index) => (
                <ProjectCard
                  key={project.slug || `${project.name}-${index}`}
                  project={project}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-charcoal/10 bg-[#f7f4ed] p-8 text-center">
              <p className="font-semibold text-charcoal">
                Project listings are being prepared.
              </p>
              <p className="mt-2 text-sm text-charcoal/60">
                Please check back soon or contact our team for current
                opportunities.
              </p>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 font-bold text-[#96713b]"
              >
                Contact an advisor <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#eef2f5] py-16 text-[#142536] sm:py-24">
        <div className="container-luxury grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <div className="gold-line mb-5" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#80602b] sm:text-[11px]">
              Gurgaon property, made clearer
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Local insight for a more confident move.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#3d4b59] sm:text-base sm:leading-8">
              Finding the right home starts with the right guidance. We help
              bring Gurgaon projects into focus with straightforward
              comparisons, relevant options, and personal support.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#142536]/25 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] transition hover:border-[#142536] hover:bg-[#142536] hover:text-white"
            >
              Know more <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {guidancePoints.map(({ Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-[#142536]/10 bg-white p-5 shadow-[0_12px_30px_rgba(20,37,54,0.07)] transition duration-200 hover:-translate-y-1 sm:p-6"
              >
                <span className="mb-5 grid size-11 place-items-center rounded-xl bg-[#f5f1e8]">
                  <Icon
                    className="text-[#96713b]"
                    size={21}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="font-display text-xl font-semibold leading-snug">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#4b5966]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-luxury grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="gold-line mb-5" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/50 sm:text-[11px]">
              Our approach
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl">
              Your property. Our expertise.
            </h2>
            <div className="mt-8 space-y-6">
              {processSteps.map(({ number, title, description }) => (
                <div className="flex gap-5" key={number}>
                  <span className="font-display text-2xl text-[#96713b]">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-charcoal/60">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-[#f5f1e8]">
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85"
              alt="Contemporary premium residential interior"
              className="h-[320px] w-full object-cover sm:h-[480px]"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ed] py-16 sm:py-24">
        <div className="container-luxury">
          <div className="mx-auto max-w-2xl text-center">
            <Quote
              className="mx-auto mb-5 text-[#96713b]"
              size={32}
              aria-hidden="true"
            />
            <h2 className="font-display text-3xl sm:text-4xl">
              A more considered property journey
            </h2>
            <p className="mt-4 text-sm leading-7 text-charcoal/60">
              We aim to make your property search clearer with focused options,
              transparent conversations, and a local perspective.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3 sm:mt-12">
            {[
              {
                title: "Relevant options",
                description:
                  "Discuss your requirements and explore projects that fit your search.",
              },
              {
                title: "Clear conversations",
                description:
                  "Understand project details, pricing information, and next steps.",
              },
              {
                title: "Local perspective",
                description:
                  "Narrow your shortlist with Gurgaon-focused project guidance.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-charcoal/5 bg-white p-6 shadow-sm sm:p-7"
              >
                <h3 className="font-display text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/65">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-charcoal/45">
            Experiences and outcomes vary. Project details, prices,
            availability, and timelines should be verified before making a
            decision.
          </p>
        </div>
      </section>

      <section className="bg-gold py-14 sm:py-20">
        <div className="container-luxury flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/60 sm:text-[11px]">
              Start your search
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl text-charcoal sm:text-4xl">
              Looking for a property in Gurgaon?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-charcoal/75">
              Tell us what you are looking for and speak with a property
              advisor.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-charcoal px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-charcoal"
          >
            Speak with an advisor <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
