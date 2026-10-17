import { Check, Pencil, Play, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO";
import VideoPreview from "../components/VideoPreview";
import { projects } from "../data/projects";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../services/authApi";
import {
  fetchVideos,
  getYouTubeVideoId,
  removeVideo,
  saveVideo,
  saveVideos,
} from "../utils/videoLibrary";

const emptyForm = { title: "", url: "", description: "", projectSlug: "" };
const sampleVideos = [
  {
    id: "roots-courtyard-2",
    title:
      "Courtyard 2 by Roots Developers | A Nature-Connected, Future-Ready Community",
    url: "https://www.youtube.com/watch?v=zYpaludLhtU",
    description:
      "A project introduction to Roots Courtyard 2 in Gurugram, from the RootsDevelopers channel.",
  },
  {
    id: "roots-developers-story",
    title: "40+ Years of Building the Future | Roots Developers",
    url: "https://www.youtube.com/watch?v=Eo3psI75DU4",
    description:
      "A short brand story published by RootsDevelopers.",
  },
  {
    id: "roots-courtyard-gurugram",
    title: "Courtyard Gurugram | Where Nature Meets Modern Living",
    url: "https://www.youtube.com/watch?v=lSOWLF2PB0s",
    description:
      "A look at the Courtyard Gurugram community and its nature-led positioning, from RootsDevelopers.",
  },
  {
    id: "roots-customer-story",
    title: "Happy Customer | Client Feedback",
    url: "https://www.youtube.com/watch?v=uIcblPg84s0",
    description:
      "A customer feedback video published by RootsDevelopers.",
  },
  {
    id: "roots-courtyard-smiles",
    title: "It All Began with Smiles | Roots Courtyard 2",
    url: "https://www.youtube.com/watch?v=tEJo0qJSOAg",
    description:
      "A Courtyard 2 video published by RootsDevelopers.",
  },
  {
    id: "roots-voices-of-trust",
    title: "Voices of Trust | Roots Developers",
    url: "https://www.youtube.com/watch?v=mH9yBnohESM",
    description:
      "A trust and customer-story video published by RootsDevelopers.",
  },
  {
    id: "roots-growth-partners",
    title: "Growth Partner Testimonials | Roots Developers",
    url: "https://www.youtube.com/watch?v=kbEou2qv2Wg",
    description:
      "A growth-partner testimonial video published by RootsDevelopers.",
  },
  {
    id: "roots-elevate",
    title: "Something Big Is Coming | Roots Developers",
    url: "https://www.youtube.com/watch?v=OENlqF8gBIA",
    description:
      "An upcoming development teaser published by RootsDevelopers.",
  },
  {
    id: "roots-courtyard-phase-two",
    title: "Courtyard 2 Phase 2 | Roots Developers",
    url: "https://www.youtube.com/watch?v=defeBUfEtCw",
    description:
      "A Courtyard 2 Phase 2 video published by RootsDevelopers.",
  },
  {
    id: "roots-growth-partners-story",
    title: "Hear About Us from Our Growth Partners",
    url: "https://www.youtube.com/watch?v=i4Js3elXw5I",
    description:
      "Growth partners share their perspective on Roots Developers.",
  },
];

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function Videos() {
  const [searchParams] = useSearchParams();
  const requestedProjectSlug = searchParams.get("project") || "";
  const [videos, setVideos] = useState([]);
  const [managerOpen, setManagerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isOwner = user?.is_video_admin === true;
  const managerRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    const loadVideos = async () => {
      const result = await fetchVideos();
      if (!active) return;
      setVideos(result.error ? sampleVideos : result.videos);
      setError(
        result.error
          ? `The shared video library could not be loaded: ${result.error}`
          : "",
      );
    };
    loadVideos();
    authApi
      .restoreSession()
      .then((result) => {
        if (!active || !result?.user) return;
        // The backend reports owner access beside the user record.
        setUser({
          ...result.user,
          is_video_admin: result.is_video_admin === true,
        });
      })
      .catch((sessionError) => {
        if (!active || sessionError.status === 401) return;
        console.error("Could not restore owner sign-in.", sessionError);
        setError(`Could not check owner sign-in: ${sessionError.message}`);
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (
      !isOwner ||
      !projects.some((project) => project.slug === requestedProjectSlug)
    ) {
      return;
    }

    setForm({ ...emptyForm, projectSlug: requestedProjectSlug });
    setManagerOpen(true);
    setFormOpen(true);
    requestAnimationFrame(() => {
      managerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      titleInputRef.current?.focus({ preventScroll: true });
    });
  }, [requestedProjectSlug, isOwner]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const submitVideo = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const url = form.url.trim();
    const description = form.description.trim();

    if (!title) {
      setError("Add a title for this video.");
      return;
    }
    if (!getYouTubeVideoId(url)) {
      setError("Enter a valid YouTube video, Shorts, or youtu.be URL.");
      return;
    }

    const nextVideo = {
      ...(editingId ? { id: editingId } : { id: createId() }),
      title,
      url,
      description,
      projectSlug: form.projectSlug,
    };
    const { error: saveError } = await saveVideo(nextVideo);
    if (saveError) {
      console.error("Could not save video.", saveError);
      setError(`The video could not be saved: ${saveError.message}`);
      return;
    }
    const refreshedVideos = await fetchVideos();
    if (refreshedVideos.error) {
      setError(`Video saved but the library failed to refresh: ${refreshedVideos.error}`);
      return;
    }
    setVideos(refreshedVideos.videos);
    setNotice(editingId ? "Video updated." : "Video added.");
    setError("");
    {
      resetForm();
      setFormOpen(false);
    }
  };

  const openAddForm = () => {
    resetForm();
    setManagerOpen(true);
    setFormOpen(true);
    setNotice("");
    setError("");
    requestAnimationFrame(() => {
      managerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      titleInputRef.current?.focus({ preventScroll: true });
    });
  };

  const addSampleVideos = async () => {
    const sampleIds = new Set(
      sampleVideos.map((video) => getYouTubeVideoId(video.url)),
    );
    const existingSamples = videos.filter((video) =>
      sampleIds.has(getYouTubeVideoId(video.url)),
    );
    const customVideos = videos.filter(
      (video) => !sampleIds.has(getYouTubeVideoId(video.url)),
    );
    const existingUrls = new Set(
      existingSamples.map((video) => getYouTubeVideoId(video.url)),
    );
    const addedCount = sampleVideos.filter(
      (video) => !existingUrls.has(getYouTubeVideoId(video.url)),
    ).length;
    const updatedCount = sampleVideos.filter((sample) =>
      existingSamples.some(
        (video) =>
          getYouTubeVideoId(video.url) === getYouTubeVideoId(sample.url) &&
          (video.title !== sample.title ||
            video.description !== sample.description),
      ),
    ).length;
    const isUpToDate = sampleVideos.every((sample) =>
      existingSamples.some(
        (video) =>
          getYouTubeVideoId(video.url) === getYouTubeVideoId(sample.url) &&
          video.title === sample.title &&
          video.description === sample.description,
      ),
    );

    if (isUpToDate) {
      setNotice("The RootsDevelopers test videos are already up to date.");
      setError("");
      return;
    }

    const nextVideos = sampleVideos.map((sample) => {
      const existing = existingSamples.find(
        (video) =>
          getYouTubeVideoId(video.url) === getYouTubeVideoId(sample.url),
      );
      return existing?.projectSlug
        ? { ...sample, projectSlug: existing.projectSlug }
        : sample;
    });
    nextVideos.push(...customVideos);
    const summary = [
      addedCount ? `${addedCount} added` : "",
      updatedCount ? `${updatedCount} refreshed` : "",
    ]
      .filter(Boolean)
      .join(", ");
    const { error: saveError } = await saveVideos(nextVideos);
    if (saveError) {
      console.error("Could not update sample videos.", saveError);
      setError(`Sample videos could not be saved: ${saveError.message}`);
      return;
    }
    const refreshedVideos = await fetchVideos();
    if (refreshedVideos.error) {
      setError(`Samples saved but the library failed to refresh: ${refreshedVideos.error}`);
      return;
    }
    setVideos(refreshedVideos.videos);
    setError("");
    setNotice(`Sample videos updated: ${summary}.`);
  };

  const editVideo = (video) => {
    setEditingId(video.id);
    setForm({
      title: video.title,
      url: video.url,
      description: video.description,
      projectSlug: video.projectSlug || "",
    });
    setManagerOpen(true);
    setFormOpen(true);
    setError("");
    setNotice("");
    document.getElementById("video-manager")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const deleteVideo = async (video) => {
    if (!window.confirm(`Delete "${video.title}"? This cannot be undone.`)) {
      return;
    }
    const { error: deleteError } = await removeVideo(video.id);
    if (deleteError) {
      console.error("Could not delete video.", deleteError);
      setError(`The video could not be deleted: ${deleteError.message}`);
      return;
    }
    setVideos((current) => current.filter((item) => item.id !== video.id));
    setError("");
    setNotice("Video deleted.");
    if (editingId === video.id) resetForm();
  };

  const signOutOwner = async () => {
    try {
      await authApi.logout();
    } catch (signOutError) {
      setError(`Could not sign out: ${signOutError.message}`);
      return;
    }
    setUser(null);
    setManagerOpen(false);
    setFormOpen(false);
    resetForm();
    setNotice("");
  };

  return (
    <>
      <SEO
        title="Property Videos | Gratia Estates"
        description="Watch real estate and residential project videos curated by Gratia Estates."
        path="/videos"
      />

      <section className="bg-gradient-to-br from-[#f8f6f1] via-[#f4f0e7] to-[#ebe4d7] py-16 sm:py-20">
        <div className="container-luxury grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(480px,1.1fr)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(560px,1.1fr)] xl:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#c9a45c]/40 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#8d6c32]">
              <img
                src="/assets/logo-primary.png"
                alt=""
                aria-hidden="true"
                className="h-7 w-9 object-contain"
              />
              Gratia Estates Media
            </p>
            <div className="mt-6">
              <h1 className="font-display text-4xl font-semibold leading-tight text-[#142536] sm:text-5xl lg:text-6xl">
                Roots Developers videos
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#5e6872] sm:text-lg">
                Explore project introductions, brand stories and customer
                feedback videos from RootsDevelopers.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {isOwner ? (
                <>
                  <button
                    type="button"
                    onClick={openAddForm}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c9a45c] px-5 py-3 text-sm font-semibold text-[#142536] shadow-md transition hover:bg-[#dfc58f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9a45c]/40"
                  >
                    <Plus size={17} />
                    Add video
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setManagerOpen((open) => !open);
                      setNotice("");
                      setError("");
                    }}
                    aria-expanded={managerOpen}
                    aria-controls="video-manager"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#142536] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#263f55] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9a45c]/40"
                  >
                    {managerOpen ? <X size={17} /> : <Pencil size={16} />}
                    {managerOpen ? "Close manager" : "Manage videos"}
                  </button>
                  <button
                    type="button"
                    onClick={signOutOwner}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#142536]/20 bg-white/70 px-5 py-3 text-sm font-semibold text-[#142536] transition hover:bg-white"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/video-admin/login"
                    aria-disabled={authLoading}
                    className={`inline-flex min-h-11 items-center justify-center rounded-full border border-[#142536]/20 bg-white/70 px-5 py-3 text-sm font-semibold text-[#142536] transition hover:bg-white ${authLoading ? "pointer-events-none opacity-60" : ""}`}
                  >
                    {authLoading ? "Checking owner access..." : "Owner sign-in"}
                  </Link>
                </div>
              )}
            </div>
            {isOwner && (
              <p className="mt-3 text-xs font-medium text-[#52606b]">
                Signed in as {user.email}. Visitor accounts cannot manage videos.
              </p>
            )}
            <p className="mt-5 max-w-2xl rounded-xl border border-[#c9a45c]/30 bg-white/70 px-4 py-3 text-sm leading-6 text-[#5e6872]">
              These sample videos are from the public RootsDevelopers YouTube
              channel. The shared library is visible to visitors; only the
              authenticated owner can add, update or delete videos.
            </p>
          </div>

          {videos[0] && (
            <div className="mx-auto w-full lg:ml-auto lg:mr-0">
              <div className="overflow-hidden rounded-[1.4rem] border border-[#c9a45c]/50 bg-white p-2 shadow-[0_24px_60px_rgba(20,37,54,.2)] transition-transform duration-500 ease-out hover:rotate-0 hover:scale-[1.02] motion-safe:rotate-1">
                <div className="overflow-hidden rounded-[1rem] bg-[#142536]">
                  <div className="aspect-video">
                    {getYouTubeVideoId(videos[0].url) ? (
                      <VideoPreview
                        video={videos[0]}
                        videoId={getYouTubeVideoId(videos[0].url)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#142536]">
                        <img
                          src="/assets/logo-primary.png"
                          alt="Gratia Estates"
                          className="w-32 rounded bg-white p-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4 px-3 pb-3 pt-4 sm:px-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9a7940]">
                      Featured project guide
                    </p>
                    <h2 className="mt-1 line-clamp-2 font-display text-lg font-semibold leading-snug text-[#142536] sm:text-xl">
                      {videos[0].title}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f4f0e7] px-3 py-1.5 text-xs font-semibold text-[#765b2b]">
                    Watch video
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container-luxury flex flex-col">
          {error && (
            <p
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              {notice}
            </p>
          )}

          {managerOpen && isOwner && (
            <div
              id="video-manager"
              ref={managerRef}
              className="order-2 mt-12 scroll-mt-28 rounded-3xl border border-[#e7e2d8] bg-[#fbfaf7] p-5 shadow-sm sm:p-8"
            >
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9a7940]">
                    Video library
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-[#142536] sm:text-3xl">
                    {formOpen
                      ? editingId
                        ? "Edit a video"
                        : "Add a video"
                      : "Manage your videos"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#5e6872]">
                    Add a YouTube link to a property tour, project overview, or
                    real estate guide.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openAddForm}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#142536] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#263f55]"
                  >
                    <Plus size={15} /> Add video
                  </button>
                  <button
                    type="button"
                    onClick={addSampleVideos}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d9dce0] bg-white px-4 py-2 text-xs font-semibold text-[#263746] transition hover:border-[#c9a45c]"
                  >
                    <Sparkles size={15} /> Add/update sample videos
                  </button>
                </div>
              </div>

              {formOpen && (
                <form onSubmit={submitVideo} className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#263746]">
                    Video title
                  </span>
                  <input
                    ref={titleInputRef}
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    maxLength={120}
                    required
                    placeholder="e.g. Gurgaon project walkthrough"
                    className="w-full rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm text-[#142536] outline-none placeholder:text-[#87909a] focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/15"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#263746]">
                    YouTube URL
                  </span>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        url: event.target.value,
                      }))
                    }
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm text-[#142536] outline-none placeholder:text-[#87909a] focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/15"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#263746]">
                    Link to a project <span className="font-normal text-[#68717a]">(optional)</span>
                  </span>
                  <select
                    value={form.projectSlug}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        projectSlug: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm text-[#142536] outline-none focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/15"
                  >
                    <option value="">General video (not linked to a project)</option>
                    {projects.map((project) => (
                      <option key={project.slug} value={project.slug}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-[#263746]">
                    Short description <span className="font-normal text-[#68717a]">(optional)</span>
                  </span>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    maxLength={300}
                    placeholder="Add a brief note about what viewers will see."
                    className="w-full resize-y rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm text-[#142536] outline-none placeholder:text-[#87909a] focus:border-[#c9a45c] focus:ring-4 focus:ring-[#c9a45c]/15"
                  />
                </label>
                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#142536] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263f55] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9a45c]/35"
                  >
                    {editingId ? <Check size={17} /> : <Plus size={17} />}
                    {editingId ? "Save changes" : "Add video"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d9dce0] bg-white px-5 py-3 text-sm font-semibold text-[#263746] transition hover:border-[#9aa4ad]"
                    >
                      Cancel edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setFormOpen(false);
                      setError("");
                    }}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d9dce0] bg-white px-5 py-3 text-sm font-semibold text-[#263746] transition hover:border-[#9aa4ad]"
                  >
                    Close form
                  </button>
                </div>
                </form>
              )}
             </div>
          )}

          {videos.length ? (
            <div className="order-1 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {videos.map((video) => {
                const videoId = getYouTubeVideoId(video.url);
                return (
                  <article
                    key={video.id}
                    className="overflow-hidden rounded-2xl border border-[#e7e2d8] bg-white shadow-[0_12px_35px_rgba(20,37,54,.08)]"
                  >
                    <div className="aspect-video bg-[#142536]">
                      {videoId ? (
                        <VideoPreview video={video} videoId={videoId} />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white">
                          <img
                            src="/assets/logo-primary.png"
                            alt="Gratia Estates"
                            className="w-28 rounded bg-white p-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-5 sm:p-6">
                      <h2 className="font-display text-xl font-semibold text-[#142536]">
                        {video.title}
                      </h2>
                      {video.projectSlug && (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#8d6c32]">
                          Guide for{" "}
                          {projects.find(
                            (project) => project.slug === video.projectSlug,
                          )?.name || "project"}
                        </p>
                      )}
                      {video.description && (
                        <p className="mt-2 text-sm leading-6 text-[#5e6872]">
                          {video.description}
                        </p>
                      )}
                      {managerOpen && isOwner && (
                        <div className="mt-5 flex gap-2 border-t border-[#e7e2d8] pt-4">
                          <button
                            type="button"
                            onClick={() => editVideo(video)}
                            className="inline-flex items-center gap-2 rounded-full border border-[#d9dce0] px-4 py-2 text-xs font-semibold text-[#263746] transition hover:border-[#c9a45c] hover:text-[#8d6c32]"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteVideo(video)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            !managerOpen && (
              <div className="order-1 rounded-3xl border border-dashed border-[#d9dce0] bg-[#fbfaf7] px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee3cc] text-[#8d6c32]">
                  <Play size={24} />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold text-[#142536]">
                  Videos are coming soon
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#5e6872]">
                  Check back for property tours, project walkthroughs and
                  helpful real estate insights.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
