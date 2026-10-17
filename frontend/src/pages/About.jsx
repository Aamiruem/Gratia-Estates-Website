import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  GitCompare,
  Handshake,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Target,
  Users,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const highlights = [
  {
    icon: Building2,
    title: "Curated Project Choices",
    text: "Explore residential projects selected around your budget, preferred location and goals.",
  },
  {
    icon: MapPin,
    title: "Gurgaon-Focused Expertise",
    text: "Understand neighbourhoods, connectivity, lifestyle options and local developments.",
  },
  {
    icon: Users,
    title: "Personalised Advisory",
    text: "Get one-to-one guidance shaped around your priorities and buying timeline.",
  },
  {
    icon: ShieldCheck,
    title: "Clear, Informed Decisions",
    text: "Compare important details and ask the right questions before taking your next step.",
  },
];

const projectTypes = [
  {
    icon: Sparkles,
    number: "01",
    title: "Pre-launch Opportunities",
    description:
      "Explore early-stage residential opportunities and understand the available information before deciding.",
  },
  {
    icon: Building2,
    number: "02",
    title: "New Launches",
    description:
      "Compare newly launched projects, locations, configurations and project features.",
  },
  {
    icon: Home,
    number: "03",
    title: "Ready-to-move Homes",
    description:
      "Discover completed residences that may suit your lifestyle and preferred timeline.",
  },
];

const process = [
  {
    number: "01",
    icon: Search,
    title: "Understand Your Needs",
    description:
      "We start with your budget, preferred locations, lifestyle priorities and timeline.",
  },
  {
    number: "02",
    icon: Home,
    title: "Shortlist Projects",
    description:
      "We narrow the options to residential opportunities that fit your requirements.",
  },
  {
    number: "03",
    icon: GitCompare,
    title: "Compare with Clarity",
    description:
      "Review location, project features, pricing details and other decision-making factors.",
  },
  {
    number: "04",
    icon: Handshake,
    title: "Plan Your Next Step",
    description:
      "Get clear guidance as you decide how you want to proceed with your property search.",
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Gratia Estates | Gurgaon Real Estate Advisory"
        description="Get to know Gratia Estates, a Gurgaon-focused real estate advisory helping buyers explore and compare residential projects with clarity."
        path="/about"
      />

      <main className="overflow-hidden bg-white text-[#17283a]">
        {/* HERO */}
        <section className="relative isolate flex min-h-[540px] items-center bg-[#142536] py-20 sm:min-h-[600px] sm:py-24">
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85')",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101e2d]/95 via-[#142536]/80 to-[#142536]/35" />

          <div className="container-luxury relative">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/65"
            >
              <Link to="/" className="transition hover:text-[#e0bd78]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#e0bd78]">About Us</span>
            </nav>

            <div className="mt-12 max-w-3xl">
              <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#e0bd78]">
                <span className="h-px w-8 bg-[#e0bd78]" />
                Gurgaon · Premium Real Estate Advisory
              </p>
              <h1 className="mt-6 font-display text-4xl leading-[1.08] text-white sm:text-6xl lg:text-7xl">
                A better way to find
                <span className="block text-[#e0bd78]">your next address.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                Property decisions feel easier when the options are relevant. We
                help you explore residential opportunities in Gurgaon with a
                focused, informed and personal approach.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/projects"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#c9a45c] px-6 py-3 text-sm font-bold text-[#142536] transition hover:bg-white"
                >
                  Explore Projects <ArrowRight size={17} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#e0bd78] hover:text-[#e0bd78]"
                >
                  Talk to an Advisor
                </Link>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent" />
        </section>

        {/* ABOUT INTRODUCTION */}
        <section className="bg-[#f8f6f1] py-16 sm:py-24">
          <div className="container-luxury grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7940]">
                Who We Are
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Real estate guidance, centred around you.
              </h2>
              <div className="mt-6 h-1 w-16 rounded-full bg-[#c9a45c]" />
            </div>
            <div className="space-y-5 text-[15px] leading-7 text-[#5e6872] sm:text-base">
              <p>
                At Gratia Estates, we believe choosing a home or property should
                begin with understanding—not pressure or an endless list of
                options.
              </p>
              <p>
                Our focus is residential real estate in Gurgaon, including
                pre-launch opportunities, new launches and ready-to-move homes.
                We help buyers understand their options and compare the details
                that matter to them.
              </p>
              <p>
                Every buyer has different priorities. Our approach starts by
                listening, then making the search more focused through relevant
                project information and personal advisory.
              </p>
              <div className="flex items-start gap-3 border-t border-[#ded8cc] pt-5">
                <CheckCircle2
                  className="mt-1 shrink-0 text-[#b28b43]"
                  size={21}
                />
                <div>
                  <p className="font-semibold text-[#17283a]">Our approach</p>
                  <p className="mt-1 text-sm leading-6 text-[#68717a]">
                    Relevant options, clear communication and a considered
                    property-search experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY GRATIA */}
        <section className="py-16 sm:py-24">
          <div className="container-luxury">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7940]">
                The Gratia Difference
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                Professional guidance. More confident choices.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#68717a] sm:text-base">
                A focused process designed to make property discovery clearer
                and more useful for you.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="group rounded-xl border border-[#e8e3d9] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/70 hover:shadow-[0_16px_38px_rgba(20,37,54,0.09)] sm:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f5efe3] text-[#a7803d] transition group-hover:bg-[#c9a45c] group-hover:text-[#142536]">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-display text-xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#68717a]">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PROPERTY TYPES */}
        <section className="bg-[#f8f6f1] py-16 sm:py-24">
          <div className="container-luxury">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7940]">
                Find Your Fit
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-[#17283a] sm:text-4xl">
                Explore the right kind of opportunity.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5e6872] sm:text-base">
                Start with the property stage that matches your preferences and
                timeline.
              </p>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {projectTypes.map(
                ({ title, description, icon: Icon, number }) => (
                  <article
                    key={title}
                    className="relative overflow-hidden rounded-xl border border-[#e8e3d9] bg-white p-6 transition hover:-translate-y-1 hover:border-[#c9a45c]/70 hover:shadow-[0_16px_38px_rgba(20,37,54,0.09)] sm:p-7"
                  >
                    <span className="absolute right-5 top-3 font-display text-5xl text-[#17283a]/[0.08]">
                      {number}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f5efe3] text-[#a7803d]">
                      <Icon size={21} />
                    </div>
                    <h3 className="mt-6 font-display text-xl text-[#17283a]">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#5e6872]">
                      {description}
                    </p>
                  </article>
                ),
              )}
            </div>
            <p className="mt-5 text-xs leading-5 text-[#68717a]">
              Availability, project details and terms should be confirmed for
              each opportunity before making a decision.
            </p>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-16 sm:py-24">
          <div className="container-luxury">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7940]">
                Our Purpose
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                Built on trust, expertise and relationships.
              </h2>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-2">
              <article className="rounded-xl border border-[#e8e3d9] bg-[#f8f6f1] p-7 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c9a45c]/20 text-[#9a7940]">
                  <Target size={23} />
                </div>
                <h3 className="mt-6 font-display text-2xl">Our Mission</h3>
                <p className="mt-3 text-sm leading-7 text-[#68717a] sm:text-base">
                  To make property discovery simpler through relevant project
                  knowledge, thoughtful comparisons and clear, personal
                  advisory.
                </p>
              </article>
              <article className="rounded-xl border border-[#e8e3d9] bg-[#f8f6f1] p-7 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c9a45c]/20 text-[#9a7940]">
                  <Eye size={23} />
                </div>
                <h3 className="mt-6 font-display text-2xl">Our Vision</h3>
                <p className="mt-3 text-sm leading-7 text-[#68717a] sm:text-base">
                  To become a trusted real estate advisory known for
                  understanding buyer needs and delivering a professional,
                  customer-first experience.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="bg-[#f8f6f1] py-16 sm:py-24">
          <div className="container-luxury">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7940]">
                How We Work
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                Four steps. A more focused search.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {process.map(({ number, icon: Icon, title, description }) => (
                <article
                  key={number}
                  className="rounded-xl border border-[#e5dfd4] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(20,37,54,0.08)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl text-[#b28b43]">
                      {number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5efe3] text-[#a7803d]">
                      <Icon size={19} />
                    </div>
                  </div>
                  <h3 className="mt-6 font-display text-xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#68717a]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#c9a45c] py-12 sm:py-16">
          <div className="container-luxury flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#142536]/70">
                Your Property Search Starts Here
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-[#142536] sm:text-4xl">
                Looking for a property in Gurgaon?
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#142536]/75 sm:text-base">
                Tell us what matters to you. We’ll help you explore relevant
                residential opportunities.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#b6bcc3] px-6 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#142536]"
            >
              Talk to an Advisor <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
