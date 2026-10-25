import {
  Bookmark,
  BookmarkCheck,
  CalendarCheck,
  Copy,
  ExternalLink,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchReaction, sendReaction } from "../services/reactionsApi";

const WHATSAPP_NUMBER = "919109776155";
const SAVED_KEY = "gratia-saved-videos";
const reactionKey = (id) => `gratia-video-reaction-${id}`;

// localStorage can be unavailable (private mode), so every access is guarded.
const store = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
};

const compact = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n);

// Who published a video. Library videos come from the RootsDevelopers channel;
// anything else is shown as curated by Gratia Estates.
export function videoChannel(video) {
  const text = `${video?.title ?? ""} ${video?.description ?? ""} ${video?.channel ?? ""}`;
  return /roots|courtyard/i.test(text)
    ? { name: "RootsDevelopers", initial: "R", tone: "bg-emerald-600" }
    : { name: "Gratia Estates", initial: "G", tone: "bg-[#142536]" };
}

// Title, channel avatar and channel name, shown under a video.
export function VideoInfo({ video, dark = false, compactLayout = false }) {
  const channel = videoChannel(video);
  return (
    <div className="flex items-start gap-3">
      <span
        className={`grid ${compactLayout ? "size-8 text-sm" : "size-10 text-base"} shrink-0 place-items-center rounded-full font-display font-bold text-white ring-2 ${dark ? "ring-white/20" : "ring-white"} ${channel.tone}`}
        aria-hidden="true"
      >
        {channel.initial}
      </span>
      <div className="min-w-0">
        <p className={`line-clamp-2 font-semibold leading-snug ${compactLayout ? "text-sm" : "text-base"} ${dark ? "text-white" : "text-[#142536]"}`}>
          {video.title}
        </p>
        <p className={`mt-0.5 text-xs ${dark ? "text-white/65" : "text-[#68717a]"}`}>{channel.name}</p>
      </div>
    </div>
  );
}

// Like / dislike / share / ask / save / more, under every video.
export default function VideoActions({ videoId, url, title, dark = false, compactLayout = false }) {
  const [mine, setMine] = useState(() => store.get(reactionKey(videoId), ""));
  const [counts, setCounts] = useState(null);
  const [saved, setSaved] = useState(() => store.get(SAVED_KEY, []).includes(videoId));
  const [menu, setMenu] = useState("");
  const [toast, setToast] = useState("");
  const wrapRef = useRef(null);

  // YouTube IDs are 11 characters without the "v" hash prefix used for other links.
  const isYouTube = !url || /youtu\.?be/i.test(url);
  const watchUrl = isYouTube ? `https://www.youtube.com/watch?v=${videoId}` : url;

  useEffect(() => {
    let active = true;
    fetchReaction(videoId).then((data) => active && setCounts(data));
    return () => {
      active = false;
    };
  }, [videoId]);

  // Close menus on outside click, Escape or scroll.
  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (event) => !wrapRef.current?.contains(event.target) && setMenu("");
    const onKey = (event) => event.key === "Escape" && setMenu("");
    const onScroll = () => setMenu("");
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [menu]);

  // Menus float above the page (cards clip overflow), below the buttons when
  // there is room, otherwise above them.
  const [menuPos, setMenuPos] = useState(null);
  const openMenu = (name) => {
    if (menu === name) return setMenu("");
    const rect = wrapRef.current.getBoundingClientRect();
    const roomBelow = window.innerHeight - rect.bottom;
    setMenuPos({
      left: Math.min(rect.left, window.innerWidth - 232),
      ...(roomBelow > 170 ? { top: rect.bottom + 8 } : { bottom: window.innerHeight - rect.top + 8 }),
    });
    setMenu(name);
  };

  const flash = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2200);
  };

  const react = async (choice) => {
    const next = mine === choice ? "" : choice;
    const change = {
      like: (next === "like" ? 1 : 0) - (mine === "like" ? 1 : 0),
      dislike: (next === "dislike" ? 1 : 0) - (mine === "dislike" ? 1 : 0),
    };
    setMine(next);
    store.set(reactionKey(videoId), next);
    if (counts) {
      setCounts({
        likes: Math.max(0, counts.likes + change.like),
        dislikes: Math.max(0, counts.dislikes + change.dislike),
      });
    }
    const result = await sendReaction(videoId, change);
    if (result) setCounts(result);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(watchUrl);
      flash("Link copied");
    } catch {
      window.prompt("Copy this link:", watchUrl);
    }
    setMenu("");
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: watchUrl });
        return;
      } catch {
        // cancelled or unsupported: fall back to the menu
      }
    }
    openMenu("share");
  };

  const toggleSave = () => {
    const list = store.get(SAVED_KEY, []);
    const next = saved ? list.filter((id) => id !== videoId) : [...new Set([...list, videoId])];
    store.set(SAVED_KEY, next);
    setSaved(!saved);
    flash(saved ? "Removed from saved" : "Saved to this device");
  };

  const ask = () =>
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Gratia Estates, I have a question about the video "${title}". Thank you.`)}`,
      "_blank",
      "noopener,noreferrer",
    );

  const pill = `inline-flex items-center gap-1.5 rounded-full font-semibold transition ${compactLayout ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm"} ${dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-[#f1ede4] text-[#142536] hover:bg-[#e7e0d1]"}`;
  const icon = compactLayout ? 14 : 16;

  return (
    <div ref={wrapRef} className="relative flex flex-wrap items-center gap-2">
      {/* Like | Dislike */}
      <div className={`inline-flex items-center overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-[#f1ede4]"}`}>
        <button
          type="button"
          onClick={() => react("like")}
          aria-pressed={mine === "like"}
          aria-label={mine === "like" ? "Remove like" : "Like"}
          className={`inline-flex items-center gap-1.5 font-semibold transition ${compactLayout ? "h-8 pl-3 pr-2.5 text-xs" : "h-9 pl-4 pr-3 text-sm"} ${dark ? "text-white hover:bg-white/15" : "text-[#142536] hover:bg-[#e7e0d1]"}`}
        >
          <ThumbsUp size={icon} className={mine === "like" ? "fill-current text-[#c9a45c]" : ""} aria-hidden="true" />
          {counts ? compact(counts.likes) : "Like"}
        </button>
        <span className={`h-5 w-px ${dark ? "bg-white/25" : "bg-[#142536]/15"}`} aria-hidden="true" />
        <button
          type="button"
          onClick={() => react("dislike")}
          aria-pressed={mine === "dislike"}
          aria-label={mine === "dislike" ? "Remove dislike" : "Dislike"}
          className={`inline-flex items-center font-semibold transition ${compactLayout ? "h-8 pl-2.5 pr-3" : "h-9 pl-3 pr-4"} ${dark ? "text-white hover:bg-white/15" : "text-[#142536] hover:bg-[#e7e0d1]"}`}
        >
          <ThumbsDown size={icon} className={mine === "dislike" ? "fill-current" : ""} aria-hidden="true" />
        </button>
      </div>

      <button type="button" onClick={share} className={pill} aria-haspopup="menu" aria-expanded={menu === "share"}>
        <Share2 size={icon} aria-hidden="true" /> {!compactLayout && "Share"}
      </button>
      <button type="button" onClick={ask} className={pill} title="Ask our team about this video">
        <Sparkles size={icon} aria-hidden="true" /> Ask
      </button>
      <button type="button" onClick={toggleSave} className={pill} aria-pressed={saved}>
        {saved ? <BookmarkCheck size={icon} className="text-[#c9a45c]" aria-hidden="true" /> : <Bookmark size={icon} aria-hidden="true" />}
        {!compactLayout && (saved ? "Saved" : "Save")}
      </button>
      <button
        type="button"
        onClick={() => openMenu("more")}
        className={`grid place-items-center rounded-full transition ${compactLayout ? "size-8" : "size-9"} ${dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-[#f1ede4] text-[#142536] hover:bg-[#e7e0d1]"}`}
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={menu === "more"}
      >
        <MoreHorizontal size={icon + 2} aria-hidden="true" />
      </button>

      {menu && (
        <div
          role="menu"
          style={{ position: "fixed", ...menuPos }}
          className="z-[80] w-56 overflow-hidden rounded-2xl border border-[#e7e2d8] bg-white py-1.5 text-sm text-[#142536] shadow-xl"
        >
          {menu === "share" ? (
            <>
              <a
                role="menuitem"
                href={`https://wa.me/?text=${encodeURIComponent(`${title} ${watchUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenu("")}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f7f4ed]"
              >
                <MessageCircle size={16} className="text-[#25D366]" aria-hidden="true" /> Share on WhatsApp
              </a>
              <button role="menuitem" type="button" onClick={copyLink} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f7f4ed]">
                <Copy size={16} className="text-[#68717a]" aria-hidden="true" /> Copy link
              </button>
            </>
          ) : (
            <>
              <a role="menuitem" href={watchUrl} target="_blank" rel="noreferrer" onClick={() => setMenu("")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f7f4ed]">
                <ExternalLink size={16} className="text-[#e11d48]" aria-hidden="true" /> {isYouTube ? "Watch on YouTube" : "Open original video"}
              </a>
              <button role="menuitem" type="button" onClick={copyLink} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f7f4ed]">
                <Copy size={16} className="text-[#68717a]" aria-hidden="true" /> Copy link
              </button>
              <Link role="menuitem" to="/book-visit" onClick={() => setMenu("")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f7f4ed]">
                <CalendarCheck size={16} className="text-emerald-600" aria-hidden="true" /> Book a site visit
              </Link>
            </>
          )}
        </div>
      )}

      {toast && (
        <span role="status" className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-[#142536] px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </span>
      )}
    </div>
  );
}
