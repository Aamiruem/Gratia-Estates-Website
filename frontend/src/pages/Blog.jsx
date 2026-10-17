import { useMemo } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import {
  BlogCard,
  BlogFilters,
  EnquiryCTA,
  FeaturedPost,
} from "../components/blog";
import { categories, posts } from "../data/blog";
import useBlogFilters from "../hooks/useBlogFilters";

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

      <section className="bg-white py-20 text-charcoal">
        <div className="container-luxury">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-charcoal/50"
          >
            <Link to="/" className="hover:text-gold">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-gold" aria-current="page">
              Blog
            </span>
          </nav>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl">
            Gurgaon Property Insights
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60">
            Practical guides on locations, project stages, costs and paperwork,
            written for people buying a home or investing in Gurgaon.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-luxury space-y-10">
          <BlogFilters
            {...filters}
            categories={availableCategories}
            total={results.length}
            onReset={filters.reset}
          />

          {featured && <FeaturedPost post={featured} />}

          {visible.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
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
