import { posts } from "./blogs";

export { posts };

export const categories = [
  { id: "market-insights", label: "Market Insights" },
  { id: "buying-guide", label: "Buying Guides" },
  { id: "location-guide", label: "Location Guides" },
];

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
