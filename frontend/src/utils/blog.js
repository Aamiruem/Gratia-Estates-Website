const siteUrl = "https://www.gratiaestates.com";

export function getReadingTime(post) {
  const content = [
    post.title,
    post.excerpt,
    ...(post.takeaways ?? []),
    ...(post.sections ?? []).flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
      ...(section.list ?? []),
    ]),
  ].join(" ");
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}

export function getRelatedPosts(post, posts) {
  return posts
    .filter((item) => item.slug !== post.slug)
    .sort(
      (a, b) =>
        Number(b.category === post.category) -
        Number(a.category === post.category),
    )
    .slice(0, 3);
}

export function postUrl(post) {
  return `${siteUrl}/blog/${post.slug}`;
}

export function buildArticleSchema(post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Gratia Estates" },
    mainEntityOfPage: postUrl(post),
  };
}

export function buildBreadcrumbSchema(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl(post) },
    ],
  };
}

export function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
