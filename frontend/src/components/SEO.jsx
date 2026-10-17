
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

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
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

    if (image) {
      setMeta("og:image", image);
    }
  }, [title, description, path, image]);

  return null;
}