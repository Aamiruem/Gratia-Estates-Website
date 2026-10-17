import { Play } from "lucide-react";
import { useState } from "react";

export default function VideoPreview({ video, videoId }) {
  const [playing, setPlaying] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={video.title}
        className="h-full w-full"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${video.title}`}
      className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-[#142536] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#c9a45c]"
    >
      {!thumbnailFailed && (
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          onError={() => setThumbnailFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      <span className="absolute inset-0 bg-[#142536]/20 transition group-hover:bg-[#142536]/35" />
      <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 p-1.5 shadow-md">
        <img
          src="/assets/logo-primary.png"
          alt="Gratia Estates"
          className="h-9 w-12 object-contain"
        />
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#c9a45c] text-[#142536] shadow-lg transition group-hover:scale-110">
        <Play size={23} fill="currentColor" aria-hidden="true" />
      </span>
    </button>
  );
}
