import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useBlogFilters(posts) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(6);
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts
      .filter((post) => category === "all" || post.category === category)
      .filter(
        (post) =>
          !normalizedQuery ||
          [post.title, post.excerpt, post.category, ...post.tags]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
      )
      .sort((a, b) =>
        sort === "oldest"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date),
      );
  }, [posts, query, category, sort]);

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || (key === "category" && value === "all") || (key === "sort" && value === "newest")) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
    setVisibleCount(6);
  };

  const reset = () => {
    setSearchParams({});
    setVisibleCount(6);
  };

  return {
    results,
    visibleCount,
    isFiltering: Boolean(query || category !== "all"),
    sort,
    query,
    category,
    setQuery: (value) => update("q", value),
    setCategory: (value) => update("category", value),
    setSort: (value) => update("sort", value),
    loadMore: () => setVisibleCount((count) => count + 6),
    reset,
  };
}
