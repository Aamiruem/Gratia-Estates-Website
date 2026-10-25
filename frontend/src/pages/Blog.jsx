import { ArrowRight, BookOpen, MapPin, Scale, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import {
  BlogCard,
  BlogFilters,
  EnquiryCTA,
  FeaturedPost,
} from "../components/blog";
import { categories, posts } from "../data/blog";
import useBlogFilters from "../hooks/useBlogFilters";

const topicIcons = {
  "market-insights": TrendingUp,
  "buying-guide": Scale,
  "location-guide": MapPin,
};

export default function Blog() {
  const filters = useBlogFilters(posts);
  const { results, visibleCount, isFiltering, sort } = filters;

  const availableCategories = useMemo(
    () => categories.filter((c) => posts.some((p) => p.category === c.id)),
    [],
  );

  // Feature one article only on the default, unfiltered view.
  const featured =
    !isFiltering && sort === "newest"
      ? (posts.find((p) => p.featured) ?? results[0])
      : null;
  const gridPosts = featured
    ? results.filter((p) => p.slug !== featured.slug)
    : results;
  const visible = gridPosts.slice(0, visibleCount);

  return (
    <>
      <SEO
        title="Gurgaon Real Estate Blog | Gratia Estates"
        description="Read Gurgaon real estate insights, buying guides and location-focused property articles from Gratia Estates."
        path="/blog"
      />

      <PageHero
        crumb="Blog"
        eyebrow="Property insights"
        title="Gurgaon Property Insights"
        text="Practical guides on locations, project stages, costs and paperwork, written for people buying a home or investing in Gurgaon."
        aside={
          <div className="grid gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#80602b]">
              Browse by topic
            </p>
            {availableCategories.map((category) => {
              const Icon = topicIcons[category.id] ?? BookOpen;
              const count = posts.filter((p) => p.category === category.id).length;
              return (
                <Link
                  key={category.id}
                  to={`/blog?category=${category.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-[#e7e2d8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a45c]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#142536] text-[#e1c98f]">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-[#142536]">
                      {category.label}
                    </span>
                    <span className="text-xs text-[#68717a]">
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-[#c9a45c] transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        }
      />

      <section className="py-12 sm:py-16">
        <div className="container-luxury space-y-10">
          <BlogFilters
            {...filters}
            categories={availableCategories}
            total={results.length}
            onReset={filters.reset}
          />

          {featured && <FeaturedPost post={featured} />}

          {visible.length > 0 ? (
            <div
              className={`grid gap-7 md:grid-cols-2 ${visible.length >= 3 ? "lg:grid-cols-3" : ""}`}
            >
              {visible.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            !featured && (
              <div className="rounded-2xl border border-dashed border-black/20 p-12 text-center">
                <p className="font-display text-2xl">
                  No articles match your search
                </p>
                <p className="mt-2 text-black/60">
                  Try a different keyword, or clear the filters to see
                  everything.
                </p>
                <button
                  type="button"
                  onClick={filters.reset}
                  className="mt-6 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white"
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
                className="rounded-full border border-charcoal px-8 py-3 text-sm font-semibold hover:bg-charcoal hover:text-white"
              >
                Load more articles
              </button>
            </div>
          )}

          <EnquiryCTA />
        </div>
      </section>
    </>
  );
}
