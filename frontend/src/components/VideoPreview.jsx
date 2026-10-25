import { Play } from "lucide-react";
import { useState } from "react";
import { getVideoSource } from "../utils/videoLibrary";
import SmartVideoPlayer from "./SmartVideoPlayer";

// Click-to-play preview for YouTube, Vimeo and direct video files. Once
// started, it switches to the full player with play/pause, stop, speed,
// quality and full-screen controls.
// `overlay` = { label, title, channel } writes the video's name on the thumbnail.
export default function VideoPreview({ video, videoId, showLogo = true, overlay }) {
  const [playing, setPlaying] = useState(false);
  const [quality, setQuality] = useState("maxresdefault");
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const source = videoId
    ? { type: "youtube", id: videoId }
    : getVideoSource(video?.url ?? "");

  if (!source) {
    return (
      <div className="grid h-full w-full place-items-center bg-[#142536] p-4 text-center text-sm text-white/70">
        This video link isn't supported.
      </div>
    );
  }

  if (playing) return <SmartVideoPlayer source={source} title={video.title} />;

  // A missing HD YouTube thumbnail comes back as a 120px placeholder.
  const fallback = () => {
    if (quality === "maxresdefault") setQuality("hqdefault");
    else setThumbnailFailed(true);
  };

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${video.title}`}
      className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-[#142536] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#c9a45c]"
    >
      {source.type === "youtube" && !thumbnailFailed && (
        <img
          src={`https://i.ytimg.com/vi/${source.id}/${quality}.jpg`}
          alt=""
          loading="lazy"
          onError={fallback}
          onLoad={(event) => event.currentTarget.naturalWidth <= 120 && fallback()}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      {source.type === "file" && (
        // Shows a real frame from the video as its preview image.
        <video
          src={`${source.src}#t=1`}
          preload="metadata"
          muted
          playsInline
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}
      {source.type === "vimeo" && (
        <span className="absolute inset-0 bg-gradient-to-br from-[#1ab7ea]/40 via-[#142536] to-[#0f1f2e]" aria-hidden="true" />
      )}
      <span className={`absolute inset-0 bg-gradient-to-t ${overlay ? "from-black/85 via-black/20" : "from-[#0d1b2a]/60 via-transparent"} to-transparent transition group-hover:from-black/90`} />
      {overlay && (
        <span className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
          {overlay.label && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.12em] text-white">
              {overlay.label}
            </span>
          )}
          <span
            className={`mt-2 block font-display font-semibold leading-snug text-white drop-shadow ${overlay.compact ? "line-clamp-1 text-sm sm:text-base" : "line-clamp-2 text-base sm:text-lg"}`}
          >
            {overlay.title}
          </span>
          {overlay.channel && <span className="mt-0.5 block text-xs text-white/75">{overlay.channel}</span>}
        </span>
      )}
      {showLogo && !overlay && (
        <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 p-1.5 shadow-md">
          <img src="/assets/logo-primary.png" alt="Gratia Estates" className="h-9 w-12 object-contain" />
        </span>
      )}
      <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
        {source.type === "youtube" ? "HD" : source.type === "vimeo" ? "VIMEO" : "VIDEO"}
      </span>
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#c9a45c] text-[#142536] shadow-lg ring-8 ring-white/20 transition group-hover:scale-110">
        <Play size={26} fill="currentColor" aria-hidden="true" />
      </span>
    </button>
  );
}
