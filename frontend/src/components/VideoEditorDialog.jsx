import { Check, Film, Link2, Loader2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";
import { getVideoSource } from "../utils/videoLibrary";
import VideoPreview from "./VideoPreview";

const TYPE_LABEL = { youtube: "YouTube video", vimeo: "Vimeo video", file: "Video file" };

/**
 * One-click add / edit / change-video dialog for the owner, with a live preview.
 * `focus` = "url" opens straight on the link field (for "Change video").
 */
export default function VideoEditorDialog({ initial, focus = "title", onSave, onDelete, onClose }) {
  const editing = Boolean(initial?.id);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    url: initial?.url ?? "",
    description: initial?.description ?? "",
    projectSlug: initial?.projectSlug ?? "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const titleRef = useRef(null);
  const urlRef = useRef(null);
  const source = getVideoSource(form.url.trim());

  useEffect(() => {
    (focus === "url" ? urlRef : titleRef).current?.focus();
    if (focus === "url") urlRef.current?.select();
    const onKey = (event) => event.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [focus, onClose, busy]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return setError("Please add a title for this video.");
    if (!source) {
      return setError("Please paste a YouTube, Vimeo or direct video file link (.mp4, .webm, .mov).");
    }
    setBusy(true);
    const message = await onSave({ ...form, title: form.title.trim(), url: form.url.trim(), description: form.description.trim() });
    setBusy(false);
    if (message) setError(message);
  };

  const input =
    "w-full rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm text-[#142536] outline-none placeholder:text-[#87909a] focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/15";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-[#0d1b2a]/70 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-editor-title"
        className="my-8 grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[1.05fr_.95fr]"
      >
        {/* Live preview */}
        <div className="flex flex-col bg-[#0f1f2e] p-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#e1c98f]">Live preview</p>
          <div className="mt-3 aspect-video overflow-hidden rounded-2xl bg-black">
            {source ? (
              <VideoPreview key={form.url} video={{ title: form.title || "Preview", url: form.url.trim() }} showLogo={false} />
            ) : (
              <div className="grid h-full place-items-center p-6 text-center text-sm text-white/60">
                <span>
                  <Film size={30} className="mx-auto mb-2 text-white/40" aria-hidden="true" />
                  Paste a video link to see it here
                </span>
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-white/60">
            {source ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-300">
                <Check size={13} aria-hidden="true" /> {TYPE_LABEL[source.type]} detected
              </span>
            ) : (
              "Supported: YouTube (videos, Shorts, live), Vimeo, and .mp4 / .webm / .mov / .ogg files."
            )}
          </p>
        </div>

        {/* Fields */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 id="video-editor-title" className="font-display text-2xl font-semibold text-[#142536]">
              {editing ? (focus === "url" ? "Change video" : "Edit video") : "Add a video"}
            </h2>
            <button type="button" onClick={onClose} disabled={busy} className="grid size-9 place-items-center rounded-full text-[#68717a] hover:bg-[#f1ede4]" aria-label="Close">
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.1em] text-[#536272]">
                <Link2 size={13} aria-hidden="true" /> Video link
              </span>
              <input ref={urlRef} type="url" value={form.url} onChange={update("url")} placeholder="Paste a YouTube, Vimeo or .mp4 link" className={input} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[#536272]">Title</span>
              <input ref={titleRef} value={form.title} onChange={update("title")} maxLength={120} placeholder="e.g. Gurgaon project walkthrough" className={input} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[#536272]">
                Link to a project <span className="font-normal normal-case tracking-normal">(optional)</span>
              </span>
              <select value={form.projectSlug} onChange={update("projectSlug")} className={input}>
                <option value="">General video (not linked to a project)</option>
                {projects.map((project) => (
                  <option key={project.slug} value={project.slug}>{project.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[#536272]">
                Short description <span className="font-normal normal-case tracking-normal">(optional)</span>
              </span>
              <textarea rows={2} value={form.description} onChange={update("description")} maxLength={300} placeholder="A brief note about what viewers will see." className={`${input} resize-y`} />
            </label>
          </div>

          {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">{error}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c9a45c] hover:text-[#142536] disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : editing ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
              {busy ? "Saving..." : editing ? "Save changes" : "Add video"}
            </button>
            <button type="button" onClick={onClose} disabled={busy} className="rounded-full border border-[#d9dce0] px-5 py-3 text-sm font-semibold text-[#142536] hover:border-[#9aa4ad]">
              Cancel
            </button>
            {editing && onDelete && (
              <button type="button" onClick={onDelete} disabled={busy} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
                <Trash2 size={15} aria-hidden="true" /> Delete
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
