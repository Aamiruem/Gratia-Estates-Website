import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  ChevronDown,
  CircleCheck,
  ClipboardCheck,
  Copy,
  Headset,
  HelpCircle,
  Layers,
  Lightbulb,
  ListOrdered,
  MapPin,
  MessageCircle,
  Play,
  PlayCircle,
  Search,
  UserRound,
} from "lucide-react";
import CallIcon from "./CallIcon";
import { getAuthor, getCategoryLabel, getPostType } from "../data/blog";
import { projects } from "../data/projects";
import { formatDate } from "../utils/format";
import { getReadingTime } from "../utils/blog";

const TYPE_META = {
  article: { label: "Article", icon: BookOpen, tone: "bg-white/95 text-[#142536]", cta: "Read article" },
  video: { label: "Video guide", icon: PlayCircle, tone: "bg-rose-600 text-white", cta: "Watch video" },
  checklist: { label: "Checklist", icon: ClipboardCheck, tone: "bg-emerald-600 text-white", cta: "Open checklist" },
};

function PostCard({ post, featured = false }) {
  const type = TYPE_META[getPostType(post)] ?? TYPE_META.article;
  const TypeIcon = type.icon;
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[#e7e2d8] bg-white shadow-[0_12px_35px_rgba(20,37,54,.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(20,37,54,.12)] ${featured ? "md:grid md:grid-cols-2" : ""}`}
    >
      <Link to={`/blog/${post.slug}`} className="relative block overflow-hidden">
        <img
          src={post.image}
          alt={post.imageAlt ?? post.title}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${featured ? "min-h-72" : "aspect-[16/10]"}`}
          loading="lazy"
        />
        <span className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.1em] shadow ${type.tone}`}>
          <TypeIcon size={13} aria-hidden="true" /> {type.label}
        </span>
        {post.video && (
          <span className="absolute inset-0 grid place-items-center bg-[#0d1b2a]/25">
            <span className="grid size-16 place-items-center rounded-full bg-white/95 text-rose-600 shadow-xl ring-8 ring-white/25 transition group-hover:scale-110">
              <Play size={26} fill="currentColor" aria-hidden="true" />
            </span>
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9a7940]">
          {getCategoryLabel(post.category)}
        </p>
        <h2 className={`${featured ? "mt-3 text-3xl" : "mt-2 text-xl"} font-display font-semibold leading-snug text-[#142536]`}>
          <Link to={`/blog/${post.slug}`} className="hover:text-[#9a7940]">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#5e6872]">{post.excerpt}</p>
        {post.tags?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <li key={tag} className="rounded-full bg-[#f3ead8] px-2.5 py-1 text-[11px] font-semibold text-[#80602b]">
                #{tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#eee9df] pt-4 text-xs text-[#68717a]" style={{ marginTop: "1.25rem" }}>
          <span>
            {formatDate(post.date)} · {getReadingTime(post)} min {post.video ? "watch + read" : "read"}
          </span>
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#142536] hover:text-[#9a7940]"
          >
            {type.cta} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BlogCard({ post }) {
  return <PostCard post={post} />;
}

export function FeaturedPost({ post }) {
  return <PostCard post={post} featured />;
}

export function BlogFilters({
  categories,
  types = [],
  counts = {},
  total,
  query,
  category,
  sort,
  type = "all",
  setQuery,
  setCategory,
  setSort,
  setType,
}) {
  const tabs = [{ id: "all", label: "All" }, ...types];
  return (
    <div className="rounded-2xl border border-[#e7e2d8] bg-white p-4 shadow-sm sm:p-5">
      {setType && (
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Content type">
          {tabs.map((tab) => {
            const meta = TYPE_META[tab.id];
            const Icon = meta?.icon ?? Layers;
            const active = type === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setType(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-[#142536] bg-[#142536] text-white" : "border-[#e7e2d8] bg-[#fbfaf7] text-[#142536] hover:border-[#c9a45c]"}`}
              >
                <Icon size={15} aria-hidden="true" />
                {tab.label}
                <span className={`rounded-full px-1.5 text-[11px] ${active ? "bg-[#c9a45c] text-[#142536]" : "bg-[#f3ead8] text-[#80602b]"}`}>
                  {counts[tab.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
        <label className="relative block">
          <span className="sr-only">Search articles</span>
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a7940]" aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guides, locations, topics..."
            className="w-full min-w-0 rounded-full border border-[#d9dce0] bg-[#fbfaf7] py-3 pl-11 pr-5 text-sm outline-none focus:border-[#c9a45c] focus:bg-white"
          />
        </label>
        <label className="sr-only" htmlFor="blog-category">Filter by category</label>
        <select
          id="blog-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-full border border-[#d9dce0] bg-white px-5 py-3 text-sm outline-none focus:border-[#c9a45c]"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="blog-sort">Sort articles</label>
        <select
          id="blog-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-full border border-[#d9dce0] bg-white px-5 py-3 text-sm outline-none focus:border-[#c9a45c]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
      <p className="mt-3 text-xs text-[#68717a]">
        Showing {total} {total === 1 ? "result" : "results"}
      </p>
    </div>
  );
}

export function EnquiryCTA({ post }) {
  const title = post ? `about "${post.title}"` : "about Gurgaon property";
  const text = `Hello Gratia Estates, I would like to enquire ${title}.`;
  return (
    <section className="relative isolate mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1b2a] via-[#142536] to-[#24405a] p-8 text-white shadow-[0_24px_60px_rgba(13,27,42,.25)] sm:p-10">
      <div
        className="pointer-events-none absolute -right-20 -top-20 -z-10 size-72 rounded-full bg-[#c9a45c]/25 blur-3xl"
        aria-hidden="true"
      />
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e1c98f]">
            Need expert guidance?
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold !text-white sm:text-3xl">
            Talk to our Gurgaon property team
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Share your budget and preferred location. We'll shortlist relevant
            projects and help you plan a site visit.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a
            href={`https://wa.me/919109776155?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a45c] px-6 py-3 text-sm font-semibold text-[#142536] transition hover:bg-[#e1c98f]"
          >
            <MessageCircle size={17} aria-hidden="true" /> Enquire on WhatsApp
          </a>
          <a
            href="tel:+919109776155"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition bg-[#34C759] text-white shadow-[0_6px_16px_rgba(52,199,89,.35)] hover:bg-[#2DB14F]"
          >
            <CallIcon size={17} /> Call +91 91097 76155
          </a>
        </div>
      </div>
    </section>
  );
}

export function JsonLd({ data }) {
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}

export function ReadingProgress({ targetRef }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const element = targetRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const total = element.offsetHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (-rect.top / total) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetRef]);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden="true">
      <div className="h-full bg-gold transition-[width]" style={{ width: `${progress}%` }} />
    </div>
  );
}

// Numbered contents list; highlights the section currently on screen.
export function TableOfContents({ sections, variant }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    if (variant === "mobile" || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sections, variant]);

  return (
    <nav
      aria-label="Article contents"
      className={`rounded-2xl border border-[#e7e2d8] bg-white p-5 ${variant === "mobile" ? "mb-8 bg-[#fbfaf7]" : "shadow-sm"}`}
    >
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#80602b]">
        <ListOrdered size={15} aria-hidden="true" /> In this article
      </p>
      <ol className="mt-3 space-y-1">
        {sections.map((section, index) => {
          const active = variant !== "mobile" && activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active ? "true" : undefined}
                className={`flex gap-3 rounded-lg border-l-2 px-3 py-2 text-sm leading-5 transition ${active ? "border-[#c9a45c] bg-[#f7f4ed] font-semibold text-[#142536]" : "border-transparent text-[#5e6872] hover:bg-[#f7f4ed] hover:text-[#142536]"}`}
              >
                <span className="font-bold text-[#c9a45c]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function KeyTakeaways({ items }) {
  if (!items?.length) return null;
  return (
    <section className="relative isolate mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-[#142536] to-[#24405a] p-6 text-white sm:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 -z-10 size-48 rounded-full bg-[#c9a45c]/25 blur-3xl"
        aria-hidden="true"
      />
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold !text-white sm:text-2xl">
        <span className="grid size-10 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
          <Lightbulb size={20} aria-hidden="true" />
        </span>
        Key takeaways
      </h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-7 text-white/85">
            <Check
              size={18}
              className="mt-1 shrink-0 rounded-full bg-[#c9a45c] p-0.5 text-[#142536]"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ArticleBody({ sections }) {
  return (
    <div className="space-y-12">
      {sections.map((section, index) => (
        <section key={section.id} id={section.id} className="scroll-mt-28">
          <h2 className="flex items-start gap-4 font-display text-2xl font-semibold leading-snug text-[#142536] sm:text-3xl">
            <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-[#f3ead8] text-sm font-bold text-[#80602b]">
              {String(index + 1).padStart(2, "0")}
            </span>
            {section.heading}
          </h2>
          <div className="mt-5 space-y-4 text-[16px] leading-8 text-[#3d4b59]">
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {section.list?.length > 0 && (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {section.list.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-[#eee9df] bg-[#fbfaf7] p-4 text-[15px] leading-6 text-[#3d4b59]"
                >
                  <CircleCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {section.table && (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e7e2d8]">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#142536] text-white">
                  <tr>
                    {section.table.headers.map((header) => (
                      <th key={header} className="px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-[#eee9df] odd:bg-white even:bg-[#fbfaf7]">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${row[0]}-${cellIndex}`}
                          className={`px-4 py-3 leading-6 ${cellIndex === 0 ? "font-semibold text-[#142536]" : "text-[#4b5966]"}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export function EmiCalculator() {
  const [principal, setPrincipal] = useState(10000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const monthlyRate = rate / 1200;
  const months = years * 12;
  const isValid = principal > 0 && rate >= 0 && months > 0;
  const emi = !isValid
    ? 0
    : monthlyRate
      ? principal * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1)
      : principal / months;
  const inr = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  const fields = [
    { label: "Loan amount (₹)", value: principal, set: setPrincipal, min: 1, step: 100000 },
    { label: "Interest rate (%)", value: rate, set: setRate, min: 0, step: 0.1 },
    { label: "Tenure (years)", value: years, set: setYears, min: 1, max: 40, step: 1 },
  ];
  return (
    <section id="emi-calculator" className="my-12 scroll-mt-28 overflow-hidden rounded-2xl border border-[#e7e2d8]">
      <div className="flex items-center gap-3 bg-[#f7f4ed] px-6 py-4">
        <span className="grid size-10 place-items-center rounded-xl bg-[#142536] text-[#e1c98f]">
          <Calculator size={19} aria-hidden="true" />
        </span>
        <h2 className="font-display text-xl font-semibold text-[#142536]">
          Home loan EMI calculator
        </h2>
      </div>
      <div className="grid gap-5 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {fields.map(({ label, value, set, ...rest }) => (
            <label key={label} className="text-xs font-bold uppercase tracking-[.1em] text-[#5e6872]">
              {label}
              <input
                type="number"
                value={value}
                onChange={(event) => set(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3 text-base font-semibold normal-case tracking-normal text-[#142536] outline-none focus:border-[#c9a45c] focus:bg-white focus:ring-4 focus:ring-[#c9a45c]/15"
                {...rest}
              />
            </label>
          ))}
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-2xl bg-[#142536] px-6 py-4 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#e1c98f]">
            Estimated monthly EMI
          </p>
          <p className="mt-1 font-display text-2xl font-bold">
            {isValid ? inr(emi) : "—"}
          </p>
          {isValid && (
            <p className="mt-1 text-xs text-white/60">
              Total interest {inr(emi * months - principal)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function BuyerChecklist({ checklist }) {
  if (!checklist) return null;
  return (
    <section className="my-12 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-[#142536] sm:text-2xl">
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white">
          <ClipboardCheck size={20} aria-hidden="true" />
        </span>
        {checklist.title}
      </h2>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {checklist.items.map((item, index) => (
          <li key={item} className="flex gap-3 rounded-xl bg-white p-4 text-[15px] leading-6 text-[#3d4b59] shadow-sm">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FaqSection({ faqs = [] }) {
  if (!faqs.length) return null;
  return (
    <section className="my-12">
      <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-[#142536] sm:text-3xl">
        <span className="grid size-10 place-items-center rounded-xl bg-[#f3ead8] text-[#80602b]">
          <HelpCircle size={20} aria-hidden="true" />
        </span>
        Frequently asked questions
      </h2>
      <div className="mt-6 space-y-3">
        {faqs.map(({ q, a }, index) => (
          <details
            key={q}
            open={index === 0}
            className="group rounded-2xl border border-[#e7e2d8] bg-[#fbfaf7] p-5 open:bg-white open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-[#142536] [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDown
                size={19}
                className="mt-0.5 shrink-0 text-[#c9a45c] transition group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-3 text-[15px] leading-7 text-[#4b5966]">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    // navigator.clipboard is unavailable on plain-http LAN addresses.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };
  const button =
    "inline-flex items-center gap-2 rounded-full border border-[#e7e2d8] bg-white px-4 py-2 text-sm font-semibold text-[#142536] transition hover:border-[#c9a45c] hover:text-[#80602b]";
  return (
    <div className="md:justify-self-end">
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#80602b] md:text-right">
        Share this article
      </p>
      <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
        <button type="button" onClick={copyLink} className={button}>
          <Copy size={15} aria-hidden="true" /> {copied ? "Link copied" : "Copy link"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
          target="_blank"
          rel="noreferrer"
          className={button}
        >
          <MessageCircle size={15} aria-hidden="true" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

export function AuthorBox({ authorId }) {
  const author = getAuthor(authorId);
  return (
    <div className="flex items-center gap-4">
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#142536] text-[#e1c98f]">
        <UserRound size={24} aria-hidden="true" />
      </span>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#80602b]">
          Written by
        </p>
        <p className="font-semibold text-[#142536]">{author.name}</p>
        <p className="text-sm text-[#68717a]">{author.role}</p>
      </div>
    </div>
  );
}

// Sticky sidebar: talk to an advisor about this topic.
export function AdvisorCard({ post }) {
  const text = `Hello Gratia Estates, I read "${post.title}" and would like advice on Gurgaon property.`;
  return (
    <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1b2a] via-[#142536] to-[#24405a] p-6 text-white shadow-[0_18px_45px_rgba(13,27,42,.2)]">
      <div
        className="pointer-events-none absolute -right-12 -top-12 -z-10 size-40 rounded-full bg-[#c9a45c]/25 blur-2xl"
        aria-hidden="true"
      />
      <span className="grid size-11 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
        <Headset size={20} aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-xl font-semibold">Have a question?</p>
      <p className="mt-1 text-sm leading-6 text-white/70">
        Talk to a Gurgaon property advisor about your budget and shortlist.
      </p>
      <a
        href={`https://wa.me/919109776155?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#c9a45c] px-5 py-3 text-sm font-semibold text-[#142536] transition hover:bg-[#e1c98f]"
      >
        <MessageCircle size={16} aria-hidden="true" /> WhatsApp us
      </a>
      <a
        href="tel:+919109776155"
        className="mt-2 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition bg-[#34C759] text-white shadow-[0_6px_16px_rgba(52,199,89,.35)] hover:bg-[#2DB14F]"
      >
        <CallIcon size={17} /> +91 91097 76155
      </a>
    </div>
  );
}

// Sidebar list of a few projects, linking readers from content to listings.
export function SidebarProjects() {
  const picks = projects.slice(0, 3);
  return (
    <div className="rounded-2xl border border-[#e7e2d8] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#80602b]">
        Featured projects
      </p>
      <ul className="mt-4 space-y-3">
        {picks.map((project) => (
          <li key={project.slug}>
            <Link
              to={`/projects/${project.slug}`}
              className="group flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-[#f7f4ed]"
            >
              <img
                src={project.image}
                alt=""
                loading="lazy"
                className="size-16 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-[#142536] group-hover:text-[#80602b]">
                  {project.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#68717a]">
                  <MapPin size={12} aria-hidden="true" /> {project.location}
                </span>
                <span className="text-xs font-semibold text-[#142536]">{project.price}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to="/projects"
        className="mt-4 flex items-center justify-center gap-2 rounded-full border border-[#e7e2d8] px-4 py-2.5 text-sm font-semibold text-[#142536] transition hover:border-[#c9a45c]"
      >
        View all projects <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function RelatedPosts({ posts }) {
  if (!posts.length) return null;
  return (
    <section className="mt-16">
      <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#80602b]">
        Keep reading
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-[#142536]">
        Related articles
      </h2>
      <div
        className={`mt-6 grid gap-6 md:grid-cols-2 ${posts.length >= 3 ? "lg:grid-cols-3" : ""}`}
      >
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}