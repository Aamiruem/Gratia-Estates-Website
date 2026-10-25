import { posts } from "./blogs";

export { posts };

export const categories = [
  { id: "market-insights", label: "Market Insights" },
  { id: "buying-guide", label: "Buying Guides" },
  { id: "location-guide", label: "Location Guides" },
  { id: "video-guides", label: "Video Guides" },
];

// Content formats shown as badges and filter tabs on the blog.
export const postTypes = [
  { id: "article", label: "Articles" },
  { id: "video", label: "Video guides" },
  { id: "checklist", label: "Checklists" },
];

export function getPostType(post) {
  return post.type ?? "article";
}



const authors = {
  "gratia-advisory": {
    name: "Gratia Estates Advisory",
    role: "Gurgaon Property Advisory",
  },
};

export function getAuthor(authorId) {
  return authors[authorId] ?? authors["gratia-advisory"];
}

export function getCategoryLabel(categoryId) {
  return categories.find((category) => category.id === categoryId)?.label
    ?? "Property Insights";
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) ?? null;
}
