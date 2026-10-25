import { Check, Lock, Pencil, Play, Plus, Smartphone, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../services/authApi";
import SmartVideoPlayer from "./SmartVideoPlayer";
import VideoActions, { videoChannel } from "./VideoActions";
import {
  fetchVideos,
  getYouTubeVideoId,
  removeVideo,
  saveVideo,
} from "../utils/videoLibrary";

// A "short" is any library video saved with a YouTube Shorts link.
export const isShortUrl = (url) => /youtube\.com\/shorts\//i.test(url || "");

// Real walkthroughs from the video library (RootsDevelopers on YouTube), shown
// in this section until the owner adds Shorts.
const FALLBACK_VIDEOS = [
  { id: "fb-1", title: "Courtyard 2: a nature-connected community", url: "https://www.youtube.com/watch?v=zYpaludLhtU", description: "Project introduction" },
  { id: "fb-2", title: "It all began with smiles", url: "https://www.youtube.com/watch?v=tEJo0qJSOAg", description: "Courtyard 2" },
  { id: "fb-3", title: "Happy customer feedback", url: "https://www.youtube.com/watch?v=uIcblPg84s0", description: "Customer story" },
  { id: "fb-4", title: "Voices of trust", url: "https://www.youtube.com/watch?v=mH9yBnohESM", description: "Customer stories" },
  { id: "fb-5", title: "Growth partner testimonials", url: "https://www.youtube.com/watch?v=kbEou2qv2Wg", description: "Partner stories" },
];

const emptyForm = { title: "", url: "", description: "" };
const newId = () => `short-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

// Vertical short-video gallery for the blog, with add / edit / delete for the
// signed-in owner. Uses the same backend video library as the Videos page.
export default function ShortVideos() {
  const [shorts, setShorts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    const result = await fetchVideos();
    if (result.error) console.error("Short videos could not be loaded.", result.error);
    setShorts(result.videos.filter((video) => isShortUrl(video.url)));
    setLoaded(true);
  };

  useEffect(() => {
    let active = true;
    load();
    authApi
      .restoreSession()
      .then((session) => active && setIsOwner(session?.is_video_admin === true))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId("");
    setFormOpen(true);
    setError("");
    setNotice("");
  };

  const startEdit = (video) => {
    setForm({ title: video.title, url: video.url, description: video.description || "" });
    setEditingId(video.id);
    setFormOpen(true);
    setError("");
    setNotice("");
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId("");
    setForm(emptyForm);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const url = form.url.trim();
    if (!title) return setError("Add a title for this short.");
    if (!isShortUrl(url) || !getYouTubeVideoId(url)) {
      return setError("Paste a YouTube Shorts link, like https://www.youtube.com/shorts/VIDEO_ID");
    }
    setBusy(true);
    const { error: saveError } = await saveVideo({
      id: editingId || newId(),
      title,
      url,
      description: form.description.trim(),
    });
    setBusy(false);
    if (saveError) return setError(`Could not save: ${saveError.message}`);
    await load();
    setNotice(editingId ? "Short updated." : "Short added.");
    closeForm();
  };

  const remove = async (video) => {
    if (!window.confirm(`Delete "${video.title}"? This cannot be undone.`)) return;
    const { error: deleteError } = await removeVideo(video.id);
    if (deleteError) return setError(`Could not delete: ${deleteError.message}`);
    setShorts((current) => current.filter((item) => item.id !== video.id));
    setNotice("Short deleted.");
    if (editingId === video.id) closeForm();
  };

  return (
    <section id="shorts" className="scroll-mt-28 py-12 sm:py-16">
      <div className="container-luxury">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-rose-600">
              <Smartphone size={15} aria-hidden="true" /> Shorts
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#142536] sm:text-4xl">
              Quick property videos
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5e6872]">
              Bite-sized project glimpses and customer stories. Tap any card to play.
            </p>
          </div>
          {isOwner ? (
            <button
              type="button"
              onClick={startAdd}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(225,29,72,.3)] transition hover:bg-rose-700"
            >
              <Plus size={17} aria-hidden="true" /> Add short
            </button>
          ) : null}
        </div>

        {(error || notice) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
          >
            {error || notice}
          </p>
        )}

        {isOwner && formOpen && (
          <form
            onSubmit={submit}
            className="mt-6 grid gap-4 rounded-2xl border border-rose-100 bg-rose-50/60 p-5 sm:grid-cols-2 sm:p-6"
          >
            <p className="font-semibold text-[#142536] sm:col-span-2">
              {editingId ? "Edit short" : "Add a new short"}
            </p>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[#536272]">Title</span>
              <input
                value={form.title}
                onChange={(event) => setForm((f) => ({ ...f, title: event.target.value }))}
                maxLength={120}
                placeholder="e.g. 3 checks before booking a flat"
                className="w-full rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[#536272]">YouTube Shorts link</span>
              <input
                type="url"
                value={form.url}
                onChange={(event) => setForm((f) => ({ ...f, url: event.target.value }))}
                placeholder="https://www.youtube.com/shorts/..."
                className="w-full rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[#536272]">
                Caption <span className="font-normal normal-case tracking-normal">(optional)</span>
              </span>
              <input
                value={form.description}
                onChange={(event) => setForm((f) => ({ ...f, description: event.target.value }))}
                maxLength={200}
                placeholder="One line about what viewers will learn"
                className="w-full rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-[#142536] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
              >
                {editingId ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                {busy ? "Saving..." : editingId ? "Save changes" : "Add short"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="inline-flex items-center gap-2 rounded-full border border-[#d9dce0] bg-white px-5 py-2.5 text-sm font-semibold text-[#142536]"
              >
                <X size={16} aria-hidden="true" /> Cancel
              </button>
            </div>
          </form>
        )}

        {shorts.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {shorts.map((video) => (
              <li key={video.id}>
                <ShortCard video={video} isOwner={isOwner} onEdit={startEdit} onDelete={remove} />
              </li>
            ))}
          </ul>
        ) : (
          loaded && (
            <>
              {isOwner && (
                <p className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-rose-200 bg-rose-50/60 px-4 py-3 text-sm text-rose-800">
                  <Play size={15} fill="currentColor" aria-hidden="true" />
                  No shorts yet. Use “Add short” to publish your first YouTube Short.
                  Until then, visitors see the project videos below.
                </p>
              )}
              {/* Until shorts are added, show real library videos instead of an empty box. */}
              <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {FALLBACK_VIDEOS.map((video) => (
                  <li key={video.id}>
                    <ShortCard video={video} badge="Video" />
                  </li>
                ))}
              </ul>
            </>
          )
        )}
      </div>
    </section>
  );
}

function ShortCard({ video, isOwner = false, onEdit, onDelete, badge = "Short" }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeVideoId(video.url);
  return (
    <article className="group overflow-hidden rounded-2xl bg-[#0f1f2e] shadow-[0_14px_35px_rgba(20,37,54,.18)]">
      <div className="relative aspect-[9/16]">
        {playing ? (
          <SmartVideoPlayer source={{ type: "youtube", id: videoId }} title={video.title} />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title}`}
            className="absolute inset-0 grid place-items-center"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hq720.jpg`}
              onError={(event) => {
                // Fall back once to the standard thumbnail.
                if (!event.currentTarget.src.includes("hqdefault")) {
                  event.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                }
              }}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
            <span className="absolute left-3 top-3 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {badge}
            </span>
            <span className="relative grid size-16 place-items-center rounded-full bg-white/95 text-rose-600 shadow-xl ring-8 ring-white/25 transition group-hover:scale-110">
              <Play size={26} fill="currentColor" aria-hidden="true" />
            </span>
            <span className="absolute inset-x-3 bottom-3 text-left">
              <span className="line-clamp-2 text-sm font-semibold leading-5 text-white">{video.title}</span>
              {video.description && (
                <span className="mt-1 line-clamp-1 block text-xs text-white/70">{video.description}</span>
              )}
            </span>
          </button>
        )}
      </div>
      <div className="space-y-2.5 p-3">
        <p className="flex items-center gap-2 text-xs text-white/70">
          <span className={`grid size-5 place-items-center rounded-full text-[10px] font-bold text-white ${videoChannel(video).tone}`} aria-hidden="true">
            {videoChannel(video).initial}
          </span>
          {videoChannel(video).name}
        </p>
        {videoId && <VideoActions videoId={videoId} title={video.title} dark compactLayout />}
      </div>
      {isOwner && (
        <div className="flex gap-2 border-t border-white/10 p-2">
          <button
            type="button"
            onClick={() => onEdit(video)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/20"
          >
            <Pencil size={13} aria-hidden="true" /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(video)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600/80 py-2 text-xs font-semibold text-white hover:bg-rose-600"
          >
            <Trash2 size={13} aria-hidden="true" /> Delete
          </button>
        </div>
      )}
    </article>
  );
}
