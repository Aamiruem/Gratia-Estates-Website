import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarCheck,
  Car,
  ChevronDown,
  Compass,
  Dumbbell,
  FileCheck2,
  Hammer,
  HandCoins,
  KeyRound,
  Landmark,
  Layers,
  MapPin,
  MessagesSquare,
  Play,
  Quote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trees,
  Users,
  Wallet,
  Waves,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BlogCard, JsonLd } from "../blog";
import { posts } from "../../data/blog";
import { SITE_URL as SITE } from "../../config/site";
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
    <section className="bg-white py-12 sm:py-16">
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
    <section className="bg-[#f7f4ed] py-8 sm:py-10">
      <div className="container-luxury grid items-center gap-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#142536] via-[#1b3247] to-[#24405a] p-6 text-white sm:p-10 lg:grid-cols-2">
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
              to="/book-visit"
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
    <section className="bg-white py-12 sm:py-16">
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


// Redesigned "considered property journey": image + numbered pillars.
export function JourneySection() {
  const pillars = [
    {
      icon: Compass,
      title: "Relevant options",
      text: "Share your budget, location and lifestyle needs, and explore only the projects that fit your search.",
      tone: "from-[#c9a45c] to-[#e1c98f] text-[#142536]",
    },
    {
      icon: MessagesSquare,
      title: "Clear conversations",
      text: "Understand project details, pricing information and next steps in plain language, without pressure.",
      tone: "from-[#142536] to-[#2b4a66] text-[#e1c98f]",
    },
    {
      icon: MapPin,
      title: "Local perspective",
      text: "Narrow your shortlist with Gurgaon-focused guidance on sectors, connectivity and project stages.",
      tone: "from-[#0f766e] to-[#14b8a6] text-white",
    },
  ];
  const image = projects[5]?.image || projects[0]?.image;

  return (
    <section className="relative isolate overflow-hidden bg-white py-12 sm:py-16">
      <div
        className="pointer-events-none absolute -right-40 top-10 -z-10 size-[30rem] rounded-full bg-[#f3ead8] blur-3xl"
        aria-hidden="true"
      />
      <div className="container-luxury grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
        <div className="relative pb-10 sm:pb-0">
          <div className="overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(20,37,54,.18)]">
            {image && (
              <img
                src={image}
                alt="Premium residential home in Gurgaon"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5] lg:max-h-[620px]"
              />
            )}
          </div>
          <figure className="absolute bottom-0 left-4 right-4 rounded-2xl bg-[#142536] p-5 text-white shadow-2xl sm:-bottom-6 sm:left-auto sm:right-6 sm:w-80">
            <Quote size={26} className="text-[#c9a45c]" aria-hidden="true" />
            <blockquote className="mt-2 text-sm leading-6 text-white/85">
              The right home starts with the right questions, asked early and
              answered clearly.
            </blockquote>
            <figcaption className="mt-3 text-[11px] font-bold uppercase tracking-[.16em] text-[#e1c98f]">
              Gratia Estates advisory
            </figcaption>
          </figure>
        </div>

        <div>
          <SectionHeading
            eyebrow="How we work"
            title="A more considered property journey"
            text="We aim to make your Gurgaon property search clearer with focused options, transparent conversations and a local perspective."
          />
          <ol className="mt-10 space-y-4">
            {pillars.map(({ icon: Icon, title, text, tone }, index) => (
              <li
                key={title}
                className="flex gap-5 rounded-2xl border border-[#e7e2d8] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#c9a45c]/60 hover:shadow-[0_18px_45px_rgba(20,37,54,.10)] sm:p-6"
              >
                <span
                  className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-md ${tone}`}
                >
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-sm font-bold text-[#c9a45c]">
                      0{index + 1}
                    </span>
                    <span className="font-display text-xl font-semibold text-[#142536]">
                      {title}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-6 text-[#5e6872]">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#68717a]">
            <BadgeCheck
              size={15}
              className="mt-0.5 shrink-0 text-[#9a7940]"
              aria-hidden="true"
            />
            Experiences and outcomes vary. Project details, prices, availability
            and timelines should be verified before making a decision.
          </p>
        </div>
      </div>
    </section>
  );
}

// One card per project location: keyword-rich internal links for SEO.
export function PopularLocations() {
  const locations = Object.values(
    projects.reduce((all, project) => {
      const key = project.location;
      all[key] ??= { location: key, image: project.image, projects: [] };
      all[key].projects.push(project);
      return all;
    }, {}),
  ).slice(0, 8);

  return (
    <section className="bg-[#f7f4ed] py-12 sm:py-16">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Popular locations"
          title="Residential projects across Gurgaon sectors"
          text="Explore new launch, under-construction and ready-to-move flats in Gurgaon, sector by sector."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map(({ location, image, projects: here }) => (
            <article
              key={location}
              className="group overflow-hidden rounded-2xl border border-[#e7e2d8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-luxury"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={image}
                  alt={`Residential property in ${location}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#142536] shadow">
                  <MapPin
                    size={13}
                    className="text-[#c9a45c]"
                    aria-hidden="true"
                  />
                  {location}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[.14em] text-[#80602b]">
                  Projects in {location.replace(", Gurgaon", "")}
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {here.map((project) => (
                    <li key={project.slug}>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="flex items-center justify-between gap-2 text-sm font-semibold text-[#142536] transition hover:text-[#9a7940]"
                      >
                        {project.name} by {project.developer}
                        <ArrowUpRight
                          size={14}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Colourful icon grid of what buyers typically compare.
export function AmenitiesShowcase() {
  const items = [
    { icon: Trees, title: "Green open spaces", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    { icon: Waves, title: "Pool and clubhouse", tone: "bg-sky-50 text-sky-700 ring-sky-100" },
    { icon: Dumbbell, title: "Fitness and wellness", tone: "bg-rose-50 text-rose-700 ring-rose-100" },
    { icon: ShieldCheck, title: "Gated security", tone: "bg-indigo-50 text-indigo-700 ring-indigo-100" },
    { icon: Car, title: "Parking and access roads", tone: "bg-amber-50 text-amber-700 ring-amber-100" },
    { icon: MapPin, title: "Expressway connectivity", tone: "bg-teal-50 text-teal-700 ring-teal-100" },
    { icon: FileCheck2, title: "RERA registration", tone: "bg-violet-50 text-violet-700 ring-violet-100" },
    { icon: HandCoins, title: "Payment plans", tone: "bg-orange-50 text-orange-700 ring-orange-100" },
  ];
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-luxury grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="What to compare"
            title="Everything buyers check before booking"
            text="We help you compare Gurgaon projects on the details that shape daily life and long-term value, from amenities and connectivity to approvals and payment plans."
          />
          <Link
            to="/blog/pre-launch-vs-launched-projects"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#142536] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white transition hover:bg-[#c9a45c] hover:text-[#142536]"
          >
            Read the buying guide <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map(({ icon: Icon, title, tone }) => (
            <li
              key={title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-[#eee9df] bg-[#fbfaf7] p-5 text-center transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <span
                className={`grid size-14 place-items-center rounded-2xl ring-4 ${tone}`}
              >
                <Icon size={24} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold leading-5 text-[#142536]">
                {title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Which are the popular areas to buy residential property in Gurgaon?",
    a: "Buyers often look at the Dwarka Expressway sectors, Golf Course Extension Road, the Southern Peripheral Road belt, New Gurgaon and Sohna. The right choice depends on your budget, commute, possession timeline and preferred project stage.",
  },
  {
    q: "Should I buy a pre-launch, under-construction or ready-to-move flat in Gurgaon?",
    a: "Pre-launch and new-launch projects can offer early pricing and flexible payment plans but involve a longer wait. Ready-to-move homes let you see the finished product and move in sooner. Compare possession dates, developer track record and total cost before deciding.",
  },
  {
    q: "What should I check before booking a property in Gurgaon?",
    a: "Verify the project's HRERA registration, approvals, developer track record, carpet area, total cost including charges and taxes, payment plan and possession timeline. Read the builder-buyer agreement carefully before paying a booking amount.",
  },
  {
    q: "How can Gratia Estates help me find a property?",
    a: "Share your budget, preferred location and timeline. Our team helps you shortlist relevant Gurgaon projects, compare details and coordinate site visits. Call +91 91097 76155 or message us on WhatsApp to start.",
  },
];

// FAQ with FAQPage structured data for Google rich results.
export function HomeFaq() {
  return (
    <section className="bg-[#f7f4ed] py-12 sm:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
      <div className="container-luxury grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Buyer questions"
            title="Gurgaon property FAQs"
            text="Quick answers to the questions we hear most from home buyers and investors in Gurgaon."
          />
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c9a45c] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#142536] transition hover:bg-[#142536] hover:text-white"
          >
            Ask an advisor <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="space-y-3">
          {faqs.map(({ q, a }, index) => (
            <details
              key={q}
              open={index === 0}
              className="group rounded-2xl border border-[#e7e2d8] bg-white p-5 shadow-sm open:shadow-md sm:p-6"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-base font-semibold text-[#142536] sm:text-lg [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown
                  size={20}
                  className="mt-1 shrink-0 text-[#c9a45c] transition group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm leading-7 text-[#5e6872]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Organization + featured-project list structured data for the home page.
export function HomeStructuredData() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Gratia Estates",
          url: `${SITE}/`,
          logo: `${SITE}/assets/logo-primary.png`,
          image: `${SITE}/assets/logo-primary.png`,
          telephone: "+91-9109776155",
          email: "purwarmanish@gmail.com",
          description:
            "Gurgaon-focused real estate advisory for new launch, under-construction and ready-to-move residential projects.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Iworkk Coworking Office Space, 90 IDC",
            addressLocality: "Gurgaon",
            addressRegion: "Haryana",
            addressCountry: "IN",
          },
          areaServed: { "@type": "City", name: "Gurgaon" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Featured residential projects in Gurgaon",
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE}/projects/${project.slug}`,
            name: project.name,
          })),
        }}
      />
    </>
  );
}

// Home-only closing block: pick a budget and get a shortlist on WhatsApp.
const BUDGETS = ["Under ₹2 Cr", "₹2–3 Cr", "₹3–5 Cr", "₹5 Cr+"];

export function ShortlistCTA() {
  const link = (budget) =>
    `https://wa.me/919109776155?text=${encodeURIComponent(
      `Hello Gratia Estates, please share a shortlist of Gurgaon projects in my budget: ${budget}.`,
    )}`;
  return (
    <section className="bg-[#c9a45c] py-10 sm:py-12">
      <div className="container-luxury grid items-center gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#142536]/70">
            Quick shortlist
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[#142536] sm:text-3xl">
            What's your budget? We'll send matching projects.
          </h2>
          <p className="mt-2 text-sm text-[#142536]/75">
            Tap a range and WhatsApp opens with your request ready to send.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2.5">
          {BUDGETS.map((budget) => (
            <li key={budget}>
              <a
                href={link(budget)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#142536] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-white hover:text-[#142536]"
              >
                <Wallet size={16} className="text-[#e1c98f]" aria-hidden="true" />
                {budget}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
