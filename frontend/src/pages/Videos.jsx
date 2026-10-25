import {
  CalendarCheck,
  Pencil,
  Play,
  Plus,
  Repeat2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SEO from "../components/SEO";
import VideoPreview from "../components/VideoPreview";
import VideoActions, { VideoInfo, videoChannel } from "../components/VideoActions";
import VideoEditorDialog from "../components/VideoEditorDialog";
import { projects } from "../data/projects";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../services/authApi";
import {
  fetchVideos,
  getVideoKey,
  getVideoSource,
  getYouTubeVideoId,
  removeVideo,
  saveVideo,
  saveVideos,
} from "../utils/videoLibrary";
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
  // Owner editor dialog: { video (null = new), focus: "title" | "url" }
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isOwner = user?.is_video_admin === true;

  useEffect(() => {
    let active = true;
    const loadVideos = async () => {
      const result = await fetchVideos();
      if (!active) return;
      // If the library is unreachable, visitors still see the sample videos;
      // the technical reason goes to the console, not the page.
      if (result.error) {
        console.error("Video library could not be loaded.", result.error);
        setVideos(sampleVideos);
      } else {
        setVideos(result.videos);
      }
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
        // Visitors never need to see owner sign-in problems.
        console.error("Could not restore owner sign-in.", sessionError);
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

    // Arriving from a project page's "Add project video" opens the editor ready.
    setEditor({ video: { projectSlug: requestedProjectSlug }, focus: "url" });
  }, [requestedProjectSlug, isOwner]);

  // Saves from the editor dialog; returns an error message, or "" on success.
  const saveFromEditor = async (values) => {
    const editingId = editor?.video?.id;
    const { error: saveError } = await saveVideo({
      id: editingId || createId(),
      ...values,
    });
    if (saveError) {
      console.error("Could not save video.", saveError);
      return `The video could not be saved: ${saveError.message}`;
    }
    const refreshedVideos = await fetchVideos();
    if (!refreshedVideos.error) setVideos(refreshedVideos.videos);
    setNotice(editingId ? "Video updated." : "Video added.");
    setError("");
    setEditor(null);
    return "";
  };

  const openAddForm = () => {
    setNotice("");
    setError("");
    setEditor({ video: null, focus: "url" });
  };

  const closeEditor = useCallback(() => setEditor(null), []);

  const addSampleVideos = async () => {
    const sampleIds = new Set(
      sampleVideos.map((video) => getYouTubeVideoId(video.url)),
    );
    const existingSamples = videos.filter((video) =>
      sampleIds.has(getYouTubeVideoId(video.url)),
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
      // Reuse the stored ID so an existing copy is updated, not duplicated.
      return existing
        ? {
            ...sample,
            id: existing.id,
            projectSlug: existing.projectSlug || sample.projectSlug,
          }
        : sample;
    });
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

  // One click: opens the editor on the title, or straight on the link ("Change video").
  const editVideo = (video, focus = "title") => {
    setError("");
    setNotice("");
    setEditor({ video, focus });
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
    if (editor?.video?.id === video.id) setEditor(null);
  };

  const signOutOwner = async () => {
    try {
      await authApi.logout();
    } catch (signOutError) {
      setError(`Could not sign out: ${signOutError.message}`);
      return;
    }
    setUser(null);
    setEditor(null);
    setNotice("");
  };

  return (
    <>
      <SEO
        title="Property Videos | Gratia Estates"
        description="Watch real estate and residential project videos curated by Gratia Estates."
        path="/videos"
      />

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0b1622] via-[#122436] to-[#1b3247] text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 -z-10 size-[30rem] rounded-full bg-[#c9a45c]/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 size-[28rem] rounded-full bg-rose-500/10 blur-3xl" aria-hidden="true" />
        <div className="container-luxury grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] py-1.5 pl-1.5 pr-4 text-xs font-bold uppercase tracking-[.16em] text-[#e1c98f]">
              <span className="grid size-7 place-items-center rounded-full bg-rose-600 text-white">
                <Play size={13} fill="currentColor" aria-hidden="true" />
              </span>
              Gratia Estates Media
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] !text-white sm:text-5xl xl:text-6xl">
              Watch Gurgaon homes
              <span className="block bg-gradient-to-r from-[#e1c98f] via-[#c9a45c] to-[#e1c98f] bg-clip-text text-transparent">
                before you visit.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Project walkthroughs, community tours and real customer stories,
              in HD. Shortlist from your sofa, then visit the ones you love.
            </p>

            <ul className="mt-7 flex flex-wrap gap-3">
              {[
                { value: videos.length || "—", label: "Videos" },
                { value: "HD", label: "Quality" },
                { value: new Set(videos.map((v) => v.projectSlug).filter(Boolean)).size || projects.length, label: "Projects covered" },
              ].map(({ value, label }) => (
                <li key={label} className="rounded-2xl border border-white/10 bg-white/[.05] px-4 py-2.5">
                  <span className="block font-display text-xl font-bold text-white">{value}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[.12em] text-white/55">{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#all-videos"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#c9a45c] px-6 py-3 text-sm font-semibold text-[#142536] shadow-[0_10px_24px_rgba(201,164,92,.35)] transition hover:bg-[#e1c98f]"
              >
                <Play size={16} fill="currentColor" aria-hidden="true" /> Browse all videos
              </a>
              <Link
                to="/book-visit"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#c9a45c] hover:text-[#e1c98f]"
              >
                <CalendarCheck size={16} aria-hidden="true" /> Book a site visit
              </Link>
            </div>

            {isOwner && (
              // Owner-only tools: never shown to visitors.
              <div className="mt-8 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4">
                <p className="text-xs font-semibold text-emerald-200">
                  Owner mode · signed in as {user.email}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={openAddForm} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#142536] hover:bg-[#e1c98f]">
                    <Plus size={15} aria-hidden="true" /> Add video
                  </button>
                  <button type="button" onClick={addSampleVideos} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
                    <Sparkles size={15} aria-hidden="true" /> Sync sample videos
                  </button>
                  <button type="button" onClick={signOutOwner} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white/80 hover:text-white">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {videos[0] && (
            <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[.04] p-2 shadow-[0_30px_80px_rgba(0,0,0,.45)]">
              <div className="aspect-video overflow-hidden rounded-[1.2rem] bg-black">
                {getVideoSource(videos[0].url) ? (
                  <VideoPreview
                    video={videos[0]}
                    overlay={{ label: "Featured", title: videos[0].title, channel: videoChannel(videos[0]).name }}
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-white/60">This video link isn't supported.</div>
                )}
              </div>
              <div className="px-3 pb-2 pt-4">
                {getVideoKey(videos[0].url) && (
                  <VideoActions videoId={getVideoKey(videos[0].url)} url={videos[0].url} title={videos[0].title} dark compactLayout />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="all-videos" className="scroll-mt-24 bg-white py-12 sm:py-16">
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

          {videos.length ? (
            <div className="order-1 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {videos.map((video) => {
                const playable = Boolean(getVideoSource(video.url));
                const videoKey = getVideoKey(video.url);
                return (
                  <article
                    key={video.id}
                    className="group/card relative overflow-hidden rounded-2xl border border-[#e7e2d8] bg-white shadow-[0_12px_35px_rgba(20,37,54,.08)]"
                  >
                    {isOwner && (
                      // One-click owner tools, always visible on every card.
                      <div className="absolute left-3 top-3 z-20 flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => editVideo(video)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/95 px-3 text-xs font-semibold text-[#142536] shadow-md transition hover:bg-[#c9a45c]"
                          title="Edit title, description and project"
                        >
                          <Pencil size={13} aria-hidden="true" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => editVideo(video, "url")}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/95 px-3 text-xs font-semibold text-[#142536] shadow-md transition hover:bg-[#c9a45c]"
                          title="Replace this video with a different link"
                        >
                          <Repeat2 size={13} aria-hidden="true" /> Change video
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteVideo(video)}
                          className="grid size-8 place-items-center rounded-full bg-white/95 text-red-600 shadow-md transition hover:bg-red-600 hover:text-white"
                          aria-label={`Delete ${video.title}`}
                          title="Delete video"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                    <div className="aspect-video bg-[#142536]">
                      {playable ? (
                        <VideoPreview
                          video={video}
                          overlay={{
                            label: video.projectSlug ? projects.find((p) => p.slug === video.projectSlug)?.name : "",
                            title: video.title,
                            channel: videoChannel(video).name,
                            compact: true,
                          }}
                        />
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
                    <div className="p-5">
                      {videoKey && (
                        <VideoActions videoId={videoKey} url={video.url} title={video.title} compactLayout />
                      )}
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
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            !editor && (
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

      <section className="pb-12 sm:pb-16">
        <div className="container-luxury">
          <div className="relative isolate grid items-center gap-6 overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-[#fbf8f2] p-6 text-[#142536] sm:p-10 lg:grid-cols-[1.3fr_1fr]">
            <div
              className="pointer-events-none absolute -right-20 -top-20 -z-10 size-72 rounded-full bg-rose-200/40 blur-3xl"
              aria-hidden="true"
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-rose-700">
                Seen something you like?
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold !text-[#142536] sm:text-3xl">
                Book a guided site visit
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#5e6872]">
                Videos are a great start. Visit in person with our team to see
                the location, layouts and amenities before you decide.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/book-visit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white transition hover:bg-rose-700"
              >
                <CalendarCheck size={16} aria-hidden="true" /> Plan a visit
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#142536]/20 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#142536] transition hover:border-rose-400"
              >
                Browse projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {isOwner && editor && (
        <VideoEditorDialog
          initial={editor.video}
          focus={editor.focus}
          onSave={saveFromEditor}
          onDelete={editor.video?.id ? () => deleteVideo(editor.video) : undefined}
          onClose={closeEditor}
        />
      )}
    </>
  );
}
