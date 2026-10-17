import { ArrowLeft, Clock } from "lucide-react";
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
      />
      <JsonLd data={buildArticleSchema(post)} />
      <JsonLd data={buildBreadcrumbSchema(post)} />
      {post.faqs?.length > 0 && <JsonLd data={buildFaqSchema(post.faqs)} />}
      <ReadingProgress targetRef={articleRef} />

      <section className="bg-charcoal py-10 text-white">
        <div className="container-luxury">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Back to blog
          </Link>
        </div>
      </section>

      <article ref={articleRef} className="py-16">
        <div className="container-luxury">
          <header className="max-w-4xl">
            <Link
              to={`/blog?category=${post.category}`}
              className="text-sm font-semibold text-gold hover:underline"
            >
              {getCategoryLabel(post.category)}
            </Link>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-black/55">
              <span>By {author.name}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} aria-hidden="true" /> {getReadingTime(post)}{" "}
                min read
              </span>
            </p>
          </header>

          <img
            src={post.image}
            alt={post.imageAlt ?? post.title}
            className="mt-10 aspect-[16/8] w-full rounded-3xl object-cover"
          />

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
