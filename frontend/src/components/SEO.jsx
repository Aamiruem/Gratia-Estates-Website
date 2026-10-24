
import { useEffect } from "react";

const SITE = "https://www.gratiaestates.com";
const DEFAULT_IMAGE = `${SITE}/assets/logo-primary.png`;

export default function SEO({
  title,
  description,
  path = "/",
  image,
  type = "website",
}) {
  useEffect(() => {
    document.title = title;

    // Open Graph tags must use the "property" attribute, not "name".
    const setMeta = (name, content) => {
      const attribute = name.startsWith("og:") ? "property" : "name";
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!content) {
        tag?.remove();
        return;
      }

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    setMeta("description", description);

    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", `${SITE}${path}`);

    const url = `${SITE}${path}`;
    // Social cards need an absolute image URL; fall back to the brand logo.
    const imageUrl = image
      ? image.startsWith("http")
        ? image
        : `${SITE}${image}`
      : DEFAULT_IMAGE;

    setMeta("og:type", type);
    setMeta("og:site_name", "Gratia Estates");
    setMeta("og:locale", "en_IN");
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", url);
    setMeta("og:image", imageUrl);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl);
  }, [title, description, path, image, type]);

  return null;
}