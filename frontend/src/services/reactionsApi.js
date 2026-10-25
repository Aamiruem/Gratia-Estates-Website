import { apiRequest } from "./apiClient";

// Shared like/dislike totals, keyed by YouTube video ID. Requests are batched
// so a page with many videos makes one call instead of one per video.
let pending = new Set();
let waiters = [];
let timer = null;

export function fetchReaction(youtubeId) {
  return new Promise((resolve) => {
    pending.add(youtubeId);
    waiters.push({ youtubeId, resolve });
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const ids = [...pending];
      const batch = waiters;
      pending = new Set();
      waiters = [];
      let data = null;
      try {
        data = await apiRequest(`/reactions?ids=${ids.join(",")}`);
      } catch {
        data = null; // backend offline: counts are simply hidden
      }
      batch.forEach(({ youtubeId: id, resolve: done }) => done(data?.[id] ?? null));
    }, 60);
  });
}

export async function sendReaction(youtubeId, change) {
  try {
    return await apiRequest(`/reactions/${youtubeId}`, {
      method: "POST",
      body: JSON.stringify(change),
    });
  } catch {
    return null;
  }
}
