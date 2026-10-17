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
