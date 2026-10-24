import {
  BadgeIndianRupee,
  Building2,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Headset,
  House,
  Layers,
  Landmark,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Ruler,
  ShieldCheck,
  Trees,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import SEO from "../components/SEO";
import { JsonLd } from "../components/blog";
import VideoPreview from "../components/VideoPreview";
import { authApi } from "../services/authApi";
import { projects } from "../data/projects";
import {
  fetchVideos,
  getYouTubeVideoId,
} from "../utils/videoLibrary";

const sharedFeatures = [
  "Landscaped open spaces",
  "Clubhouse",
  "Fitness and wellness",
  "Community spaces",
  "Family-friendly environment",
];

const locationBenefits = [
  "Approx. 20-25 min from IGI International Airport",
  "Approx. 5-10 min to Dwarka Expressway",
  "Approx. 5-10 min to the 1,000-acre Global City",
  "Approx. 5-10 min to Cyber City 2",
  "Approx. 5-10 min to Mumbai Expressway",
];

export default function ProjectDetails() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const [callbackRequest, setCallbackRequest] = useState({
    name: "",
    phone: "",
    budget: "",
    description: "",
  });
  // Only this project's own photos; other projects' images must not appear here.
  const galleryImages = project
    ? [project.image, ...(project.gallery ?? [])].filter(Boolean)
    : [];
  // Same-type projects first, then others, so the row always has 3 cards.
  const suggestedProjects = project
    ? projects
        .filter((item) => item.slug !== project.slug)
        .sort(
          (a, b) =>
            Number(b.type === project.type) - Number(a.type === project.type),
        )
        .slice(0, 3)
    : [];
  const amenityFeatures = project
    ? [...new Set([...project.highlights, ...sharedFeatures])].slice(0, 8)
    : [];
  const [activeImage, setActiveImage] = useState(0);
  const [savedVideoData, setSavedVideoData] = useState({ videos: [], error: "" });
  const [videoOwner, setVideoOwner] = useState(false);
  const projectVideos = savedVideoData.videos.filter(
    (video) => video.projectSlug === slug,
  );

  useEffect(() => {
    setActiveImage(0);
    if (galleryImages.length < 2) return undefined;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % galleryImages.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [slug, galleryImages.length]);

  useEffect(() => {
    let active = true;
    const loadVideos = async () => {
      const result = await fetchVideos();
      if (active) setSavedVideoData(result);
    };

    loadVideos();
    authApi
      .restoreSession()
      .then((session) => {
        if (active) setVideoOwner(session.is_video_admin === true);
      })
      .catch((error) => {
        if (active && error.status !== 401) {
          console.error("Could not check video owner access.", error);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (!project)
    return (
      <div className="container-luxury py-32">
        <h1 className="font-display text-4xl">Project not found</h1>
        <Link to="/projects" className="mt-6 inline-block text-gold">
          Back to projects
        </Link>
      </div>
    );

  const whatsapp = `https://wa.me/919109776155?text=${encodeURIComponent(`Hello Gratia Estates, I want details about ${project.name} in ${project.location}.`)}`;

  const submitCallbackRequest = (event) => {
    event.preventDefault();
    const message = `Hello Gratia Estates, I would like a callback about ${project.name}.\nName: ${callbackRequest.name}\nPhone: ${callbackRequest.phone}\nBudget: ${callbackRequest.budget}\nDescription: ${callbackRequest.description || "Not provided"}`;
    window.open(
      `https://wa.me/919109776155?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setCallbackRequest({
      name: "",
      phone: "",
      budget: "",
      description: "",
    });
  };

  return (
    <>
      <SEO
        title={`${project.name} ${project.location} | Price, Status & Details | Gratia Estates`}
        description={`${project.name} by ${project.developer} in ${project.location}: ${project.status.toLowerCase()} ${project.type.toLowerCase()} homes, ${project.price}. See highlights, amenities and location, and book a site visit with Gratia Estates.`}
        path={`/projects/${project.slug}`}
        image={project.image}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ApartmentComplex",
          name: project.name,
          description: project.description,
          image: project.image,
          url: `https://www.gratiaestates.com/projects/${project.slug}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: project.location.replace(/,\s*Gurgaon$/, ""),
            addressLocality: "Gurgaon",
            addressRegion: "Haryana",
            addressCountry: "IN",
          },
          amenityFeature: project.highlights.map((name) => ({
            "@type": "LocationFeatureSpecification",
            name,
            value: true,
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.gratiaestates.com/" },
            { "@type": "ListItem", position: 2, name: "Projects", item: "https://www.gratiaestates.com/projects" },
            { "@type": "ListItem", position: 3, name: project.name, item: `https://www.gratiaestates.com/projects/${project.slug}` },
          ],
        }}
      />
      <section className="py-20">
        <div className="container-luxury grid gap-10 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-2xl border border-charcoal/10 bg-gradient-to-r from-white to-[#f5f1e8] px-5 py-4 shadow-sm sm:px-6">
              <div className="min-w-0">
                <h1 className="font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
                  {project.name}
                </h1>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-charcoal/75 shadow-sm">
                  <MapPin
                    size={14}
                    className="shrink-0 text-[#9a7335]"
                    aria-hidden="true"
                  />
                  {project.location}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-700/15 bg-emerald-700/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-emerald-800">
                  <CircleCheck size={14} aria-hidden="true" />
                  {project.status}
              </span>
            </div>
            <div className="relative isolate overflow-hidden rounded-3xl bg-charcoal shadow-luxury">
              <img
                key={galleryImages[activeImage]}
                src={galleryImages[activeImage]}
                alt={`${project.name} property image ${activeImage + 1}`}
                className="aspect-[16/10] w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20"
                aria-hidden="true"
              />
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        (current) =>
                          (current - 1 + galleryImages.length) %
                          galleryImages.length,
                      )
                    }
                    aria-label="Show previous project image"
                    className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-charcoal transition hover:bg-white"
                  >
                    <ChevronLeft size={21} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        (current) => (current + 1) % galleryImages.length,
                      )
                    }
                    aria-label="Show next project image"
                    className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-charcoal transition hover:bg-white"
                  >
                    <ChevronRight size={21} />
                  </button>
                  <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                    {galleryImages.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`Show project image ${index + 1}`}
                        aria-current={
                          activeImage === index ? "true" : undefined
                        }
                        className={`h-2.5 rounded-full transition-all ${activeImage === index ? "w-7 bg-white" : "w-2.5 bg-white/60 hover:bg-white"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="mt-8 overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-[0_16px_45px_rgba(20,37,54,0.07)]">
              <div className="bg-gradient-to-br from-[#f8f6f1] via-white to-[#eef2f5] p-6 sm:p-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#80602b]">
                    About the project
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-charcoal/75 sm:text-base sm:leading-8">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.highlights.slice(0, 4).map((highlight) => (
                    <span
                      key={highlight}
                      className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white/85 px-3 py-2 text-xs font-medium text-charcoal/75"
                    >
                      <Check
                        size={14}
                        className="shrink-0 text-[#9a7335]"
                        aria-hidden="true"
                      />
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <section className="mt-8 overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#fbfaf7] p-6 shadow-[0_16px_45px_rgba(20,37,54,0.07)] sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#80602b]">
                    Project video guide
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-[#142536] sm:text-3xl">
                    See {project.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5e6872]">
                    Watch project details, features and helpful guidance before
                    you decide.
                  </p>
                </div>
                {videoOwner && (
                  <Link
                    to={`/videos?project=${encodeURIComponent(project.slug)}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#142536] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263f55] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9a45c]/35"
                  >
                    <Play size={16} fill="currentColor" />
                    Add project video
                  </Link>
                )}
              </div>
              {savedVideoData.error ? (
                <p
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  {savedVideoData.error}
                </p>
              ) : projectVideos.length ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {projectVideos.map((video) => {
                    const videoId = getYouTubeVideoId(video.url);
                    return (
                      <article
                        key={video.id}
                        className="overflow-hidden rounded-2xl border border-[#e7e2d8] bg-white shadow-sm"
                      >
                        <div className="aspect-video bg-[#142536]">
                          {videoId ? (
                            <VideoPreview video={video} videoId={videoId} />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <img
                                src="/assets/logo-primary.png"
                                alt="Gratia Estates"
                                className="w-28 rounded bg-white p-2"
                              />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-display text-xl font-semibold text-[#142536]">
                            {video.title}
                          </h3>
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
                <div className="mt-6 rounded-2xl border border-dashed border-[#d9dce0] bg-white/80 px-5 py-6 text-sm leading-6 text-[#5e6872]">
                  {videoOwner
                    ? "No guide video has been added for this project yet. Use the button above to add a YouTube video and link it to this project."
                    : "A guide video for this project is coming soon. Contact us for a detailed walkthrough in the meantime."}
                </div>
              )}
            </section>

            <div className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_16px_45px_rgba(26,26,26,0.06)]">
              <div className="border-b border-black/10 px-6 py-5 sm:px-8">
                <p className="text-[12px] font-bold uppercase tracking-[.2em] text-gold">
                  Property information
                </p>
                <h2 className="mt-1 font-display text-3xl text-charcoal">
                  Project Overview
                </h2>
              </div>
              <dl className="grid gap-px bg-black/5 sm:grid-cols-2">
                {[
                  {
                    label: "Property type",
                    value: project.type,
                    icon: House,
                  },
                  {
                    label: "Developer",
                    value: project.developer,
                    icon: Landmark,
                  },
                  {
                    label: "Project status",
                    value: project.status,
                    icon: CircleCheck,
                  },
                  {
                    label: "Starting price",
                    value: project.price,
                    icon: BadgeIndianRupee,
                  },
                  // Per-project specs; a row is shown only when the project
                  // data in data/projects.js provides that value.
                  {
                    label: "Apartment configuration",
                    value: project.configuration,
                    icon: Ruler,
                  },
                  {
                    label: "Total land",
                    value: project.landArea,
                    icon: Trees,
                  },
                  {
                    label: "Total towers",
                    value: project.towers,
                    icon: Building2,
                  },
                  {
                    label: "Floors",
                    value: project.floors,
                    icon: Layers,
                  },
                ]
                  .filter(({ value }) => value)
                  .map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 bg-white px-6 py-5 sm:px-8"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold leading-5 text-charcoal">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <aside className="flex flex-col gap-6">
          <div className="rounded-3xl bg-charcoal p-8 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">
              Starting price
            </p>
            <p className="mt-2 font-display text-3xl">{project.price}</p>
            <div className="my-7 border-t border-white/10" />
            <form
              className="callback-form mt-5 space-y-3"
              onSubmit={submitCallbackRequest}
            >
              <label className="block">
                <span className="sr-only">Your name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  value={callbackRequest.name}
                  onChange={(event) =>
                    setCallbackRequest((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white focus:border-gold focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="sr-only">Phone number</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Phone number"
                  required
                  value={callbackRequest.phone}
                  onChange={(event) =>
                    setCallbackRequest((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white focus:border-gold focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="sr-only">Budget</span>
                <select
                  name="budget"
                  required
                  value={callbackRequest.budget}
                  onChange={(event) =>
                    setCallbackRequest((current) => ({
                      ...current,
                      budget: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-white/20 bg-[#252525] px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
                >
                  <option value="" disabled>
                    Select your budget
                  </option>
                  <option value="Under 1 Cr">Under 1 Cr</option>
                  <option value="1-2 Cr">1-2 Cr</option>
                  <option value="2-4 Cr">2-4 Cr</option>
                  <option value="4-7 Cr">4-7 Cr</option>
                  <option value="7-10 Cr">7-10 Cr</option>
                  <option value="10 Cr+">10 Cr+</option>
                </select>
              </label>
              <label className="block">
                <span className="sr-only">Description</span>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Description"
                  value={callbackRequest.description}
                  onChange={(event) =>
                    setCallbackRequest((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="w-full resize-y rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white focus:border-gold focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full border border-white/20 px-5 py-4 text-xs font-bold uppercase tracking-[.15em] transition hover:bg-white hover:text-charcoal"
              >
                Request a Callback
              </button>
            </form>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#DCF8C6] px-5 py-4 text-xs font-bold uppercase tracking-[.15em] text-charcoal"
            >
              <MessageCircle size={17} /> Enquire on WhatsApp
            </a>
          </div>

            {/* At a glance — fills the column beside the long overview. */}
            <div className="rounded-3xl border border-[#e7e2d8] bg-white p-7 shadow-[0_16px_45px_rgba(20,37,54,0.07)]">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#80602b]">
                At a glance
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-[#142536]">
                {project.name}
              </h2>
              <ul className="mt-5 divide-y divide-[#eee9df]">
                {[
                  { icon: Landmark, label: "Developer", value: project.developer },
                  { icon: MapPin, label: "Location", value: project.location },
                  { icon: House, label: "Type", value: project.type },
                  { icon: CircleCheck, label: "Status", value: project.status },
                  { icon: BadgeIndianRupee, label: "Price", value: project.price },
                ].map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-center gap-3 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f5efe3] text-[#9a7335]">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[.12em] text-[#68717a]">
                      {label}
                    </span>
                    <span className="ml-auto text-right text-sm font-semibold text-[#142536]">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#142536] via-[#1b3247] to-[#24405a] p-7 text-white">
              <div
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#c9a45c]/20 blur-2xl"
                aria-hidden="true"
              />
              <p className="relative text-[10px] font-bold uppercase tracking-[.18em] text-[#e1c98f]">
                Why buy with Gratia
              </p>
              <ul className="relative mt-4 space-y-4">
                {[
                  { icon: ShieldCheck, title: "Clear comparisons", text: "Compare project details, pricing and connectivity side by side." },
                  { icon: CalendarCheck, title: "Site visits arranged", text: "We coordinate visits at a time that suits you." },
                  { icon: Headset, title: "One advisor, start to finish", text: "A single point of contact from shortlist to paperwork." },
                ].map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{title}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-white/70">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="tel:+919109776155"
                className="relative mt-6 flex items-center justify-center gap-2 rounded-full bg-[#c9a45c] px-5 py-3.5 text-xs font-bold uppercase tracking-[.14em] text-[#142536] transition hover:bg-[#e1c98f]"
              >
                <Phone size={16} aria-hidden="true" /> Call +91 91097 76155
              </a>
            </div>
          </aside>
        </div>
      </section>
      <section className="bg-ivory py-20">
        <div className="container-luxury">
          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold">
              Live well
            </p>
            <h2 className="mt-2 font-display text-4xl">Amenities & Features</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {amenityFeatures.map((feature, index) => (
                <div
                  key={`${feature}-${index}`}
                  className="flex min-h-20 items-center gap-3 rounded-2xl bg-white p-6"
                >
                  <Check className="shrink-0 text-gold" size={19} />
                  <span className="text-sm font-bold">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-3xl bg-white p-10 sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold">
              Around the project
            </p>
            <h2 className="mt-2 font-display text-4xl">Nearby Location</h2>
            <div className="mt-6 flex items-start gap-4">
              <MapPin
                className="mt-1 shrink-0 text-gold"
                size={23}
                aria-hidden="true"
              />
              <div>
                <p className="text-base font-semibold text-charcoal">
                  {project.location}
                </p>
              </div>
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[.15em] text-charcoal/55">
              Approximate travel times
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {locationBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-xl bg-ivory p-4 text-sm leading-6 text-charcoal font-bold"
                >
                  <CircleCheck
                    className="mt-0.5 shrink-0 text-emerald-600"
                    size={19}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-5 text-charcoal/75">
              <b>
                Travel times are rough estimates supplied for reference only.
                Actual routes and times vary by project location, traffic and
                road conditions.
              </b>
            </p>
          </div>
        </div>
      </section>
      {suggestedProjects.length > 0 && (
        <section className="py-20">
          <div className="container-luxury">
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold">
              Continue exploring
            </p>
            <h2 className="mt-2 font-display text-4xl">Similar Properties</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suggestedProjects.map((suggestedProject) => (
                <ProjectCard
                  key={suggestedProject.slug}
                  project={suggestedProject}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
