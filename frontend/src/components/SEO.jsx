
import { useEffect } from "react";

const SITE = "https://www.gratiaestates.com";

export default function SEO({
  title,
  description,
  path = "/",
  image
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

    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", `${SITE}${path}`);

    // Clear a previous page's image so it does not leak onto this page.
    setMeta("og:image", image);
  }, [title, description, path, image]);

  return null;
}