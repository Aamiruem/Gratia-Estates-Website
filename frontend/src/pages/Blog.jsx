import {
  ArrowRight,
  BookOpen,
  Calculator,
  Clapperboard,
  ClipboardCheck,
  FileCheck2,
  Hash,
  MapPin,
  MessageCircle,
  PlayCircle,
  Scale,
  Smartphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import ShortVideos from "../components/ShortVideos";
import VideoPreview from "../components/VideoPreview";
import VideoActions, { VideoInfo } from "../components/VideoActions";
import {
  BlogCard,
  BlogFilters,
  FeaturedPost,
} from "../components/blog";
import { categories, getPostType, posts, postTypes } from "../data/blog";
import useBlogFilters from "../hooks/useBlogFilters";

const topicMeta = {
  "market-insights": { icon: TrendingUp, tone: "bg-amber-100 text-amber-700" },
  "buying-guide": { icon: Scale, tone: "bg-emerald-100 text-emerald-700" },
  "location-guide": { icon: MapPin, tone: "bg-sky-100 text-sky-700" },
  "video-guides": { icon: Clapperboard, tone: "bg-rose-100 text-rose-700" },
};

// Real walkthroughs from the site's video library (RootsDevelopers on YouTube).
const videoGuides = [
  { id: "zYpaludLhtU", title: "Courtyard 2 by Roots Developers: a nature-connected community" },
  { id: "lSOWLF2PB0s", title: "Courtyard Gurugram: where nature meets modern living" },
  { id: "defeBUfEtCw", title: "Courtyard 2 Phase 2: project video" },
  { id: "mH9yBnohESM", title: "Voices of Trust: customer stories" },
];

const tools = [
  {
    icon: Calculator,
    title: "Home loan EMI calculator",
    text: "Test a comfortable monthly payment before you shortlist.",
    to: "/blog/true-cost-of-buying-a-home-in-gurgaon#emi-calculator",
    accent: {
      bar: "from-sky-400 to-blue-600",
      icon: "from-sky-400 to-blue-600",
      chip: "bg-sky-100 text-sky-700",
      button: "bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white",
    },
  },
  {
    icon: ClipboardCheck,
    title: "Site visit checklist",
    text: "What to check on site and which documents to ask for.",
    to: "/blog/site-visit-checklist-gurgaon",
    accent: {
      bar: "from-emerald-400 to-teal-600",
      icon: "from-emerald-400 to-teal-600",
      chip: "bg-emerald-100 text-emerald-700",
      button: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    },
  },
  {
    icon: FileCheck2,
    title: "RERA and due diligence",
    text: "How to verify a project before paying a booking amount.",
    to: "/blog/gurgaon-real-estate-market-guide#due-diligence",
    accent: {
      bar: "from-violet-400 to-purple-600",
      icon: "from-violet-400 to-purple-600",
      chip: "bg-violet-100 text-violet-700",
      button: "bg-violet-50 text-violet-700 group-hover:bg-violet-600 group-hover:text-white",
    },
  },
];

// Soft tints for topic chips on the dark panel (top 3 topics are gold).
const TAG_TONES = [
  "border-sky-300/30 bg-sky-400/10 text-sky-100",
  "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  "border-violet-300/30 bg-violet-400/10 text-violet-100",
  "border-rose-300/30 bg-rose-400/10 text-rose-100",
];

export default function Blog() {
  const filters = useBlogFilters(posts);
  const { results, visibleCount, isFiltering, sort } = filters;
  const listRef = useRef(null);

  const availableCategories = useMemo(
    () => categories.filter((c) => posts.some((p) => p.category === c.id)),
    [],
  );
  const typeCounts = useMemo(() => {
    const counts = { all: posts.length };
    posts.forEach((post) => {
      const type = getPostType(post);
      counts[type] = (counts[type] ?? 0) + 1;
    });
    return counts;
  }, []);
  const popularTags = useMemo(() => {
    const counts = {};
    posts.forEach((post) => post.tags?.forEach((tag) => (counts[tag] = (counts[tag] ?? 0) + 1)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14);
  }, []);

  // Feature one article only on the default, unfiltered view.
  const featured =
    !isFiltering && sort === "newest"
      ? (posts.find((p) => p.featured) ?? results[0])
      : null;
  const gridPosts = featured
    ? results.filter((p) => p.slug !== featured.slug)
    : results;
  const visible = gridPosts.slice(0, visibleCount);
  const latestPost = [...posts].sort((a, b) => b.date.localeCompare(a.date))[0];

  const searchTag = (tag) => {
    filters.setQuery(tag);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SEO
        title="Gurgaon Real Estate Blog, Guides & Videos | Gratia Estates"
        description="Gurgaon property buying guides, site visit checklists, cost breakdowns, location insights and project video walkthroughs from Gratia Estates."
        path="/blog"
      />

      <PageHero
        crumb="Blog"
        eyebrow="Guides · Checklists · Videos"
        title="Gurgaon Property Insights"
        text="Practical guides, checklists and HD video walkthroughs on locations, costs and paperwork for buying a home in Gurgaon."
        aside={
          <div className="grid grid-cols-2 gap-3">
            {availableCategories.map((category) => {
              const meta = topicMeta[category.id] ?? { icon: BookOpen, tone: "bg-amber-100 text-amber-700" };
              const Icon = meta.icon;
              const count = posts.filter((p) => p.category === category.id).length;
              return (
                <Link
                  key={category.id}
                  to={`/blog?category=${category.id}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-[#e7e2d8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a45c] hover:shadow-md"
                >
                  <span className="flex items-center justify-between">
                    <span className={`grid size-11 place-items-center rounded-xl ${meta.tone}`}>
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <ArrowRight size={16} className="text-[#c9a45c] transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold leading-5 text-[#142536]">{category.label}</span>
                    <span className="text-xs text-[#68717a]">
                      {count} {count === 1 ? "post" : "posts"}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        }
      >
        <div className="mt-7 flex flex-wrap gap-3">
          {latestPost && (
            <Link
              to={`/blog/${latestPost.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#142536] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#c9a45c] hover:text-[#142536]"
            >
              <BookOpen size={16} aria-hidden="true" /> Read the latest guide
            </Link>
          )}
          <a
            href="#videos"
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(225,29,72,.25)] transition hover:bg-rose-700"
          >
            <PlayCircle size={17} aria-hidden="true" /> Watch videos
          </a>
          <a
            href="#shorts"
            className="inline-flex items-center gap-2 rounded-full border border-[#142536]/15 bg-white px-5 py-3 text-sm font-semibold text-[#142536] transition hover:border-rose-400"
          >
            <Smartphone size={16} className="text-rose-600" aria-hidden="true" /> Shorts
          </a>
        </div>
        <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
          {[
            { value: posts.length, label: "Guides" },
            { value: postTypes.length, label: "Formats" },
            { value: "HD", label: "Video walkthroughs" },
          ].map(({ value, label }) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-2xl font-bold text-[#142536]">
                {value} <span className="text-xs font-semibold uppercase tracking-[.12em] text-[#80602b]">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="py-12 sm:py-16">
        <div ref={listRef} className="container-luxury scroll-mt-28 space-y-8">
          <BlogFilters
            {...filters}
            categories={availableCategories}
            types={postTypes}
            counts={typeCounts}
            total={results.length}
          />

          {featured && <FeaturedPost post={featured} />}

          {visible.length > 0 ? (
            <div className={`grid gap-7 md:grid-cols-2 ${visible.length >= 3 ? "lg:grid-cols-3" : ""}`}>
              {visible.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            !featured && (
              <div className="rounded-2xl border border-dashed border-[#d9dce0] bg-white p-12 text-center">
                <p className="font-display text-2xl text-[#142536]">Nothing matches your search</p>
                <p className="mt-2 text-[#5e6872]">
                  Try a different keyword, or clear the filters to see everything.
                </p>
                <button
                  type="button"
                  onClick={filters.reset}
                  className="mt-6 rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white"
                >
                  Clear filters
                </button>
              </div>
            )
          )}

          {visibleCount < gridPosts.length && (
            <div className="text-center">
              <button
                type="button"
                onClick={filters.loadMore}
                className="rounded-full border border-[#142536] px-8 py-3 text-sm font-semibold text-[#142536] hover:bg-[#142536] hover:text-white"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video guides */}
      <section id="videos" className="scroll-mt-24 bg-[#0f1f2e] py-12 text-white sm:py-16">
        <div className="container-luxury">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-rose-300">
                <Clapperboard size={15} aria-hidden="true" /> Watch
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold !text-white sm:text-4xl">
                Video guides and walkthroughs
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Watch project introductions in HD before you plan a site visit.
                Videos are published by RootsDevelopers on YouTube.
              </p>
            </div>
            <Link
              to="/videos"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-rose-300 hover:text-rose-200"
            >
              All videos <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <figure className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
              <div className="aspect-video">
                <VideoPreview video={videoGuides[0]} videoId={videoGuides[0].id} />
              </div>
              <figcaption className="space-y-4 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <VideoInfo video={{ ...videoGuides[0], channel: "RootsDevelopers" }} dark />
                  <Link
                    to="/blog/video-guide-courtyard-2-gurugram"
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-rose-300 hover:text-rose-200"
                  >
                    Read the guide <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <VideoActions videoId={videoGuides[0].id} title={videoGuides[0].title} dark />
              </figcaption>
            </figure>
            <ul className="grid gap-4">
              {videoGuides.slice(1).map((video) => (
                <li key={video.id} className="grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-center gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-2">
                  <div className="aspect-video overflow-hidden rounded-xl">
                    <VideoPreview video={video} videoId={video.id} showLogo={false} />
                  </div>
                  <div className="min-w-0 space-y-2.5 pr-2">
                    <VideoInfo video={{ ...video, channel: "RootsDevelopers" }} dark compactLayout />
                    <VideoActions videoId={video.id} title={video.title} dark compactLayout />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ShortVideos />

      {/* Tools + topics + updates */}
      <section className="py-12 sm:py-16">
        <div className="container-luxury">
          <div className="rounded-[2rem] border border-[#e7e2d8] bg-gradient-to-br from-white via-[#fbf8f2] to-[#f3ead8] p-5 shadow-[0_20px_60px_rgba(20,37,54,.07)] sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-[#142536] px-3 py-1 text-[11px] font-bold uppercase tracking-[.16em] text-[#e1c98f]">
                  <Sparkles size={13} aria-hidden="true" /> Buyer tools
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-[#142536] sm:text-4xl">
                  Plan, check and compare
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#5e6872]">
                  Free tools and checklists to help you buy with confidence.
                </p>
              </div>
            </div>

            <div className="mt-7 grid items-stretch gap-5 lg:grid-cols-[1.45fr_1fr]">
              <ul className="grid gap-4 sm:grid-cols-3">
                {tools.map(({ icon: Icon, title, text, to, accent }, index) => (
                  <li key={title}>
                    <Link
                      to={to}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7e2d8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(20,37,54,.12)]"
                    >
                      <span className={`h-1.5 w-full bg-gradient-to-r ${accent.bar}`} aria-hidden="true" />
                      <span className="flex flex-1 flex-col p-5">
                        <span className="flex items-center justify-between">
                          <span className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md ${accent.icon}`}>
                            <Icon size={26} aria-hidden="true" />
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${accent.chip}`}>
                            Tool {String(index + 1).padStart(2, "0")}
                          </span>
                        </span>
                        <span className="mt-5 text-lg font-semibold leading-snug text-[#142536]">{title}</span>
                        <span className="mt-2 text-sm leading-6 text-[#5e6872]">{text}</span>
                        <span className="min-h-5 flex-1" aria-hidden="true" />
                        <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition group-hover:gap-2.5 ${accent.button}`}>
                          Open tool <ArrowRight size={15} aria-hidden="true" />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col rounded-2xl bg-[#142536] p-6 text-white shadow-md">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
                    <Hash size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold !text-white">Popular topics</p>
                    <p className="text-xs text-white/60">Tap a topic to search the blog</p>
                  </div>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {popularTags.map(([tag, count], index) => (
                    <li key={tag}>
                      <button
                        type="button"
                        onClick={() => searchTag(tag)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 ${index < 3 ? "border-[#c9a45c] bg-[#c9a45c] text-[#142536] hover:bg-[#e1c98f]" : `${TAG_TONES[index % TAG_TONES.length]} hover:bg-white/20`}`}
                      >
                        #{tag}
                        <span className={`rounded-full px-1.5 text-[10px] ${index < 3 ? "bg-[#142536]/15" : "bg-white/15"}`}>{count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/60" style={{ marginTop: "1.5rem" }}>
                  <BookOpen size={14} className="text-[#e1c98f]" aria-hidden="true" />
                  {posts.length} guides across {availableCategories.length} topics
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
