import { apiRequest } from "../services/apiClient";

export function getYouTubeVideoId(value) {
  let parsedUrl;

  try {
    parsedUrl = new URL(value);
  } catch {
    return "";
  }

  const host = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
  if (
    ![
      "youtube.com",
      "m.youtube.com",
      "youtube-nocookie.com",
      "youtu.be",
    ].includes(host)
  ) {
    return "";
  }

  let videoId = "";
  if (host === "youtu.be") {
    videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
  } else if (parsedUrl.pathname === "/watch") {
    videoId = parsedUrl.searchParams.get("v") || "";
  } else {
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    if (["embed", "shorts", "live"].includes(segments[0])) {
      videoId = segments[1] || "";
    }
  }

  return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : "";
}

const FILE_TYPES = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i;

/**
 * Works out how to play a video link. Supported:
 *  - YouTube: watch, Shorts, live, embed and youtu.be links
 *  - Vimeo: vimeo.com/123 and player.vimeo.com/video/123
 *  - Direct video files: .mp4, .webm, .ogg, .mov, .m4v
 * Returns null for anything else.
 */
export function getVideoSource(value) {
  const youtubeId = getYouTubeVideoId(value);
  if (youtubeId) {
    return {
      type: "youtube",
      id: youtubeId,
      thumbnail: `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
      fallbackThumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    };
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
    return id ? { type: "vimeo", id, thumbnail: "" } : null;
  }
  if (FILE_TYPES.test(url.pathname)) {
    return { type: "file", src: url.href, thumbnail: "" };
  }
  return null;
}

// A stable key for likes/saves: the YouTube ID, or a short hash of other links.
export function getVideoKey(value) {
  const source = getVideoSource(value);
  if (!source) return "";
  if (source.type === "youtube") return source.id;
  let hash = 0;
  for (const ch of value) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return `v${hash.toString(36).padStart(10, "0").slice(-10)}`;
}

function normalizeVideo(video) {
  return {
    id: video.id,
    title: video.title,
    url: video.url,
    description: video.description || "",
    projectSlug: video.project_slug || "",
  };
}

export async function fetchVideos() {
  try {
    const data = await apiRequest("/videos");
    return { videos: data.map(normalizeVideo), error: "" };
  } catch (error) {
    return { videos: [], error: error.message };
  }
}

export async function saveVideo(video) {
  try {
    await apiRequest(`/videos/${encodeURIComponent(video.id)}`, {
      method: "PUT",
      body: JSON.stringify({
        id: video.id,
        title: video.title,
        url: video.url,
        description: video.description || "",
        project_slug: video.projectSlug || null,
      }),
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function saveVideos(videos) {
  try {
    await apiRequest("/videos", {
      method: "PUT",
      body: JSON.stringify(
        videos.map((video) => ({
          id: video.id,
          title: video.title,
          url: video.url,
          description: video.description || "",
          project_slug: video.projectSlug || null,
        })),
      ),
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function removeVideo(id) {
  try {
    await apiRequest(`/videos/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
}
