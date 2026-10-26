// Runs after `vite build`. Search engines and link previews read the HTML
// before JavaScript runs, so each route gets its own copy of index.html with
// the right <title>, description, canonical URL and social tags, and the
// sitemap is regenerated from the same route list so it never goes stale.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../src/data/projects.js";
import { posts } from "../src/data/blogs.js";

import { SITE_URL as SITE } from "../site.config.js";
const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const DEFAULT_IMAGE = `${SITE}/assets/logo-primary.png`;

const pages = [
  { path: "/about", title: "About Gratia Estates | Gurgaon Real Estate Advisory", description: "Get to know Gratia Estates, a Gurgaon-focused real estate advisory helping buyers explore and compare residential projects with clarity." },
  { path: "/projects", title: "Gurgaon Property Projects | New Launch & Ready-to-Move Flats | Gratia Estates", description: "Browse curated residential projects in Gurgaon from DLF, SOBHA, Godrej, M3M and more, including pre-launch, launched, under-construction and ready-to-move homes." },
  { path: "/videos", title: "Property Videos | Gratia Estates", description: "Watch real estate and residential project videos curated by Gratia Estates." },
  { path: "/blog", title: "Gurgaon Real Estate Blog, Guides & Videos | Gratia Estates", description: "Gurgaon property buying guides, site visit checklists, cost breakdowns, location insights and project video walkthroughs from Gratia Estates." },
  { path: "/contact", title: "Contact Gratia Estates | Gurgaon Property Help & Support", description: "Questions about Gurgaon property? Contact Gratia Estates by phone, WhatsApp or email. Our team is glad to help with projects, pricing, home loans and paperwork." },
  { path: "/book-visit", title: "Book a Site Visit in Gurgaon | Gratia Estates", description: "Book a site visit to Gurgaon residential projects in a few simple steps. Choose a project, a day and a time, and our team will confirm with you." },
  { path: "/privacy-policy", title: "Privacy Policy | Gratia Estates", description: "Privacy Policy for Gratia Estates website and property enquiries." },
  { path: "/terms-conditions", title: "Terms & Conditions | Gratia Estates", description: "Terms and Conditions governing use of the Gratia Estates website." },
  ...projects.map((project) => ({
    path: `/projects/${project.slug}`,
    title: `${project.name} ${project.location} | Price, Status & Details | Gratia Estates`,
    description: `${project.name} by ${project.developer} in ${project.location}: ${project.status.toLowerCase()} ${project.type.toLowerCase()} homes, ${project.price}. See highlights, amenities and location, and book a site visit with Gratia Estates.`,
    image: project.image,
  })),
  ...posts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: `${post.title} | Gratia Estates`,
    description: post.excerpt,
    image: post.image,
    type: "article",
  })),
];

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function render(template, page) {
  const url = `${SITE}${page.path}`;
  const image = page.image?.startsWith("http") ? page.image : page.image ? `${SITE}${page.image}` : DEFAULT_IMAGE;
  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`],
    [/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeAttr(page.description)}" />`],
    [/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${url}" />`],
    [/<meta property="og:type"[^>]*\/>/, `<meta property="og:type" content="${page.type || "website"}" />`],
    [/<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${url}" />`],
    [/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${escapeAttr(page.title)}" />`],
    [/<meta property="og:description"[^>]*\/>/, `<meta property="og:description" content="${escapeAttr(page.description)}" />`],
    [/<meta property="og:image"[^>]*\/>/, `<meta property="og:image" content="${escapeAttr(image)}" />`],
  ];
  return replacements.reduce((html, [pattern, value]) => {
    if (!pattern.test(html)) throw new Error(`index.html is missing the tag matched by ${pattern}`);
    return html.replace(pattern, value);
  }, template);
}

const template = await readFile(join(DIST, "index.html"), "utf8");
for (const page of pages) {
  const file = join(DIST, page.path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, render(template, page));
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[{ path: "/" }, ...pages]
    .filter((page) => !["/privacy-policy", "/terms-conditions"].includes(page.path))
    .map((page) => `  <url><loc>${SITE}${page.path}</loc><lastmod>${today}</lastmod></url>`),
  "</urlset>",
  "",
].join("\n");
await writeFile(join(DIST, "sitemap.xml"), sitemap);
await writeFile(
  join(DIST, "robots.txt"),
  ["User-agent: *", "Allow: /", "Disallow: /video-admin/", "", `Sitemap: ${SITE}/sitemap.xml`, ""].join("\n"),
);

console.log(`SEO: wrote ${pages.length} page files and a sitemap with ${sitemap.match(/<url>/g).length} URLs.`);
