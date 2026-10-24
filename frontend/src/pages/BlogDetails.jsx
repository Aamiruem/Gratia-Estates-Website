import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock,
  ListChecks,
  Tag,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import {
  ArticleBody,
  AuthorBox,
  BuyerChecklist,
  EmiCalculator,
  EnquiryCTA,
  FaqSection,
  JsonLd,
  KeyTakeaways,
  ReadingProgress,
  RelatedPosts,
  ShareButtons,
  TableOfContents,
} from "../components/blog";
import {
  getAuthor,
  getCategoryLabel,
  getPostBySlug,
  posts,
} from "../data/blog";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  getReadingTime,
  getRelatedPosts,
  postUrl,
} from "../utils/blog";
import { formatDate } from "../utils/format";

export default function BlogDetails() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const articleRef = useRef(null);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [slug]);

  const related = useMemo(
    () => (post ? getRelatedPosts(post, posts) : []),
    [post],
  );

  if (!post) {
    return (
      <div className="container-luxury py-32">
        <h1 className="font-display text-4xl">Article not found</h1>
        <p className="mt-3 text-black/60">
          This article may have moved or no longer exists.
        </p>
        <Link to="/blog" className="mt-6 inline-block text-gold">
          Back to blog
        </Link>
      </div>
    );
  }

  const author = getAuthor(post.authorId);

  return (
    <>
      <SEO
        title={`${post.title} | Gratia Estates`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image}
        type="article"
      />
      <JsonLd data={buildArticleSchema(post)} />
      <JsonLd data={buildBreadcrumbSchema(post)} />
      {post.faqs?.length > 0 && <JsonLd data={buildFaqSchema(post.faqs)} />}
      <ReadingProgress targetRef={articleRef} />

      <article ref={articleRef}>
        <header className="relative isolate overflow-hidden border-b border-[#e7e2d8] bg-gradient-to-br from-[#fbf8f2] via-[#f6efe2] to-[#efe4cf] py-10 sm:py-14">
          <div
            className="pointer-events-none absolute -left-24 -top-24 -z-10 size-80 rounded-full bg-white/70 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 right-0 -z-10 size-[26rem] rounded-full bg-[#c9a45c]/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="container-luxury">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#68717a]"
            >
              <Link to="/" className="transition hover:text-[#9a7940]">
                Home
              </Link>
              <ChevronRight size={14} aria-hidden="true" />
              <Link to="/blog" className="transition hover:text-[#9a7940]">
                Blog
              </Link>
              <ChevronRight size={14} aria-hidden="true" />
              <span className="line-clamp-1 text-[#9a7940]" aria-current="page">
                {post.title}
              </span>
            </nav>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
              <div>
                <Link
                  to={`/blog?category=${post.category}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#142536] px-4 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#e1c98f] transition hover:bg-[#c9a45c] hover:text-[#142536]"
                >
                  <Tag size={13} aria-hidden="true" />
                  {getCategoryLabel(post.category)}
                </Link>
                <h1 className="mt-5 font-display text-3xl font-bold leading-[1.15] text-[#142536] sm:text-4xl xl:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-5 max-w-2xl border-l-4 border-[#c9a45c] pl-4 text-base leading-7 text-[#4b5966] sm:text-lg sm:leading-8">
                  {post.excerpt}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#4b5966]">
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-[#e7e2d8] bg-white py-1.5 pl-1.5 pr-4 shadow-sm">
                    <span className="grid size-8 place-items-center rounded-full bg-[#142536] text-[#e1c98f]">
                      <UserRound size={16} aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-[#142536]">{author.name}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#e7e2d8] bg-white px-4 py-2.5 shadow-sm">
                    <CalendarDays size={16} className="text-[#9a7940]" aria-hidden="true" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#e7e2d8] bg-white px-4 py-2.5 shadow-sm">
                    <Clock size={16} className="text-[#9a7940]" aria-hidden="true" />
                    {getReadingTime(post)} min read
                  </span>
                </div>
              </div>

              <div className="relative">
                <img
                  src={post.image}
                  alt={post.imageAlt ?? post.title}
                  className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_30px_70px_rgba(20,37,54,.22)] ring-4 ring-white"
                />
                <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-4 rounded-2xl bg-[#142536] p-4 text-white shadow-2xl sm:left-6 sm:right-auto sm:max-w-sm">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
                    <ListChecks size={21} aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-5">
                    <span className="block font-semibold">In this article</span>
                    <span className="text-white/70">
                      {post.sections.length} sections
                      {post.takeaways?.length ? ` · ${post.takeaways.length} key takeaways` : ""}
                      {post.faqs?.length ? ` · ${post.faqs.length} FAQs` : ""}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container-luxury pb-16 pt-14">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#142536] transition hover:text-[#9a7940]"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Back to all articles
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="max-w-3xl">
              <TableOfContents sections={post.sections} variant="mobile" />
              <KeyTakeaways items={post.takeaways} />
              <ArticleBody sections={post.sections} />
              {post.tools?.includes("emi") && <EmiCalculator />}
              <BuyerChecklist checklist={post.checklist} />
              <FaqSection faqs={post.faqs} />
              <div className="space-y-8 border-t border-black/10 pt-8">
                <ShareButtons url={postUrl(post)} title={post.title} />
                <AuthorBox authorId={post.authorId} />
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents sections={post.sections} />
              </div>
            </aside>
          </div>

          <EnquiryCTA post={post} />
          <RelatedPosts posts={related} />
        </div>
      </article>
    </>
  );
}
