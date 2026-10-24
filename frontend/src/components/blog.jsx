import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, MessageCircle, Phone } from "lucide-react";
import { getAuthor, getCategoryLabel } from "../data/blog";
import { formatDate } from "../utils/format";
import { getReadingTime } from "../utils/blog";

function PostCard({ post, featured = false }) {
  return (
    <article className={`overflow-hidden rounded-2xl border border-black/10 bg-white shadow-luxury ${featured ? "md:grid md:grid-cols-2" : ""}`}>
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
        <img
          src={post.image}
          alt={post.imageAlt ?? post.title}
          className={`h-full w-full object-cover transition duration-500 hover:scale-[1.02] ${featured ? "min-h-64" : "aspect-[16/10]"}`}
          loading="lazy"
        />
      </Link>
      <div className="p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-gold">
          {getCategoryLabel(post.category)}
        </p>
        <h2 className={`${featured ? "mt-3 text-3xl" : "mt-2 text-2xl"} font-display leading-snug text-charcoal`}>
          <Link to={`/blog/${post.slug}`} className="hover:text-gold">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-7 text-charcoal/65">{post.excerpt}</p>
        <p className="mt-4 text-xs text-charcoal/50">
          {formatDate(post.date)} · {getReadingTime(post)} min read
        </p>
        <Link
          to={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-charcoal hover:text-gold"
        >
          Read article <ArrowRight size={16} aria-hidden="true" />
        </Link>
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
  total,
  query,
  category,
  sort,
  setQuery,
  setCategory,
  setSort,
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 md:grid-cols-[minmax(0,1fr)_auto_auto]">
      <label className="sr-only" htmlFor="blog-search">Search articles</label>
      <input
        id="blog-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search articles..."
        className="min-w-0 rounded-full border border-black/15 px-5 py-3 text-sm outline-none focus:border-gold"
      />
      <label className="sr-only" htmlFor="blog-category">Filter by category</label>
      <select
        id="blog-category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm outline-none focus:border-gold"
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
        className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm outline-none focus:border-gold"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
      <p className="text-xs text-charcoal/55 md:col-span-3">
        {total} {total === 1 ? "article" : "articles"}
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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#c9a45c] hover:text-[#e1c98f]"
          >
            <Phone size={17} aria-hidden="true" /> Call +91 91097 76155
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

export function TableOfContents({ sections, variant }) {
  return (
    <nav
      aria-label="Article contents"
      className={`rounded-2xl border border-black/10 bg-white p-5 ${variant === "mobile" ? "mb-8 lg:hidden" : ""}`}
    >
      <h2 className="font-display text-lg">In this article</h2>
      <ul className="mt-3 space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a className="text-sm text-charcoal/65 hover:text-gold" href={`#${section.id}`}>
              {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function KeyTakeaways({ items }) {
  return (
    <section className="mb-10 rounded-2xl border border-gold/25 bg-gold/10 p-6">
      <h2 className="font-display text-2xl">Key takeaways</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-charcoal/80">
            <Check size={17} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ArticleBody({ sections }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="font-display text-3xl text-charcoal">{section.heading}</h2>
          <div className="mt-4 space-y-4 text-sm leading-8 text-charcoal/75">
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {section.list?.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-charcoal/75">
              {section.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
          {section.table && (
            <div className="mt-5 overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-ivory">
                  <tr>{section.table.headers.map((header) => <th key={header} className="p-3 font-semibold">{header}</th>)}</tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-black/10">
                      {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="p-3">{cell}</td>)}
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
  const formattedEmi = isValid
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(emi)
    : "Enter a loan amount and tenure";
  return (
    <section className="my-10 rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="font-display text-2xl">Home loan EMI calculator</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="text-xs font-semibold">Loan amount (₹)
          <input className="mt-2 w-full rounded-lg border p-3 text-sm" type="number" min="1" value={principal} onChange={(event) => setPrincipal(Number(event.target.value))} />
        </label>
        <label className="text-xs font-semibold">Interest rate (%)
          <input className="mt-2 w-full rounded-lg border p-3 text-sm" type="number" min="0" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
        </label>
        <label className="text-xs font-semibold">Tenure (years)
          <input className="mt-2 w-full rounded-lg border p-3 text-sm" type="number" min="1" max="40" value={years} onChange={(event) => setYears(Number(event.target.value))} />
        </label>
      </div>
      <p className="mt-5 text-sm">Estimated monthly EMI: <strong>{formattedEmi}</strong></p>
    </section>
  );
}

export function BuyerChecklist({ checklist }) {
  if (!checklist) return null;
  return (
    <section className="my-10 rounded-2xl bg-white p-6">
      <h2 className="font-display text-2xl">{checklist.title}</h2>
      <ul className="mt-4 space-y-3">
        {checklist.items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6">
            <Check size={17} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FaqSection({ faqs = [] }) {
  if (!faqs.length) return null;
  return (
    <section className="my-10">
      <h2 className="font-display text-3xl">Frequently asked questions</h2>
      <div className="mt-5 divide-y divide-black/10">
        {faqs.map(({ q, a }) => (
          <details key={q} className="py-4">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-3 text-sm leading-7 text-charcoal/70">{a}</p>
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
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold">Share this article</span>
      <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm hover:border-gold">
        <Copy size={15} aria-hidden="true" /> {copied ? "Link copied" : "Copy link"}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm hover:border-gold"
      >
        <MessageCircle size={15} aria-hidden="true" /> WhatsApp
      </a>
    </div>
  );
}

export function AuthorBox({ authorId }) {
  const author = getAuthor(authorId);
  return (
    <div className="rounded-2xl bg-white p-6">
      <p className="text-xs font-bold uppercase tracking-[.15em] text-gold">About the author</p>
      <p className="mt-2 font-semibold">{author.name}</p>
      <p className="text-sm text-charcoal/60">{author.role}</p>
    </div>
  );
}

export function RelatedPosts({ posts }) {
  if (!posts.length) return null;
  return (
    <section className="mt-16">
      <h2 className="font-display text-3xl">Related articles</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
      </div>
    </section>
  );
}
