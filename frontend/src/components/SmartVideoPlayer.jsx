import { Gauge, Maximize, Pause, Play, Settings2, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const QUALITY_LABELS = {
  highres: "4K+",
  hd2160: "4K",
  hd1440: "1440p",
  hd1080: "1080p HD",
  hd720: "720p HD",
  large: "480p",
  medium: "360p",
  small: "240p",
  tiny: "144p",
  auto: "Auto",
};

// Loads the YouTube IFrame API once for the whole site.
let youtubeApi;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubeApi) {
    youtubeApi = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    });
  }
  return youtubeApi;
}

/**
 * Plays YouTube, Vimeo or direct video files with one control bar:
 * play/pause, stop, playback speed, quality and full screen.
 */
export default function SmartVideoPlayer({ source, title }) {
  const frameRef = useRef(null);
  const wrapRef = useRef(null);
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [menu, setMenu] = useState("");
  const [ready, setReady] = useState(source.type !== "youtube");

  // YouTube: create a controllable player.
  useEffect(() => {
    if (source.type !== "youtube") return undefined;
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !frameRef.current) return;
      playerRef.current = new YT.Player(frameRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: source.id,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: (event) => {
            setReady(true);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            setPlaying(event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING);
            const level = event.target.getPlaybackQuality?.();
            if (level && level !== "unknown") setQuality(level);
          },
          onPlaybackQualityChange: (event) => setQuality(event.data),
          onPlaybackRateChange: (event) => setSpeed(event.data),
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [source.type, source.id]);

  const video = () => (source.type === "file" ? frameRef.current : null);

  const togglePlay = () => {
    if (source.type === "youtube") {
      const p = playerRef.current;
      if (!p) return;
      if (playing) p.pauseVideo();
      else p.playVideo();
    } else if (source.type === "file") {
      const v = video();
      if (v.paused) v.play();
      else v.pause();
    }
  };

  const stop = () => {
    if (source.type === "youtube") {
      playerRef.current?.seekTo(0, true);
      playerRef.current?.pauseVideo();
    } else if (source.type === "file") {
      const v = video();
      v.pause();
      v.currentTime = 0;
    }
    setPlaying(false);
  };

  const changeSpeed = (value) => {
    if (source.type === "youtube") playerRef.current?.setPlaybackRate(value);
    else if (source.type === "file") video().playbackRate = value;
    setSpeed(value);
    setMenu("");
  };

  const fullscreen = () => {
    const el = wrapRef.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else el?.requestFullscreen?.();
  };

  const controllable = source.type !== "vimeo";
  const button =
    "grid size-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-40";

  return (
    <div ref={wrapRef} className="group/player relative h-full w-full bg-black">
      {source.type === "youtube" && <div ref={frameRef} className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full" title={title} />}
      {source.type === "file" && (
        <video
          ref={frameRef}
          src={source.src}
          title={title}
          className="h-full w-full bg-black object-contain"
          autoPlay
          playsInline
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onRateChange={(event) => setSpeed(event.currentTarget.playbackRate)}
        />
      )}
      {source.type === "vimeo" && (
        <iframe
          src={`https://player.vimeo.com/video/${source.id}?autoplay=1&dnt=1`}
          title={title}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* Control bar (top-right so it doesn't cover the player's own seek bar) */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5 opacity-100 transition sm:opacity-0 sm:group-hover/player:opacity-100 sm:focus-within:opacity-100">
        {controllable && (
          <>
            <button type="button" onClick={togglePlay} disabled={!ready} className={button} aria-label={playing ? "Pause" : "Play"} title={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={16} fill="currentColor" aria-hidden="true" /> : <Play size={16} fill="currentColor" aria-hidden="true" />}
            </button>
            <button type="button" onClick={stop} disabled={!ready} className={button} aria-label="Stop" title="Stop">
              <Square size={14} fill="currentColor" aria-hidden="true" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu(menu === "speed" ? "" : "speed")}
                disabled={!ready}
                className="inline-flex h-9 items-center gap-1 rounded-full bg-black/60 px-3 text-xs font-bold text-white backdrop-blur hover:bg-black/80 disabled:opacity-40"
                aria-label={`Playback speed ${speed}x`}
                aria-expanded={menu === "speed"}
              >
                <Gauge size={14} aria-hidden="true" /> {speed}x
              </button>
              {menu === "speed" && (
                <ul className="absolute right-0 top-11 w-28 overflow-hidden rounded-xl bg-[#0f1f2e]/95 py-1 text-sm text-white shadow-xl">
                  {SPEEDS.map((value) => (
                    <li key={value}>
                      <button
                        type="button"
                        onClick={() => changeSpeed(value)}
                        className={`flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 ${value === speed ? "font-bold text-[#e1c98f]" : ""}`}
                      >
                        {value === 1 ? "Normal" : `${value}x`}
                        {value === speed && <span aria-hidden="true">✓</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu(menu === "quality" ? "" : "quality")}
                className="inline-flex h-9 items-center gap-1 rounded-full bg-black/60 px-3 text-xs font-bold text-white backdrop-blur hover:bg-black/80"
                aria-label="Video quality"
                aria-expanded={menu === "quality"}
              >
                <Settings2 size={14} aria-hidden="true" /> {source.type === "youtube" ? QUALITY_LABELS[quality] ?? "Auto" : "Original"}
              </button>
              {menu === "quality" && (
                <div className="absolute right-0 top-11 w-60 rounded-xl bg-[#0f1f2e]/95 p-3 text-xs leading-5 text-white/85 shadow-xl">
                  {source.type === "youtube" ? (
                    <>
                      <p className="font-semibold text-white">Now playing: {QUALITY_LABELS[quality] ?? "Auto"}</p>
                      <p className="mt-1">
                        YouTube picks the best quality for your connection automatically. To choose a
                        specific quality, use the ⚙ settings icon in the player's bottom bar.
                      </p>
                    </>
                  ) : (
                    <p>This video plays at its original uploaded quality.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        <button type="button" onClick={fullscreen} className={button} aria-label="Full screen" title="Full screen">
          <Maximize size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
