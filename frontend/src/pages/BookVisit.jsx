import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartHandshake,
  HelpCircle,
  Info,
  Landmark,
  MapPin,
  MessageCircle,
  Pencil,
  ShieldCheck,
  Sparkles,
  Timer,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CallIcon from "../components/CallIcon";
import SEO from "../components/SEO";
import { projects } from "../data/projects";
import { formatWhatsAppMessage, openWhatsApp } from "../utils/whatsapp";

const WHATSAPP_NUMBER = "919109776155";
const SLOTS = [
  { id: "morning", label: "Morning", time: "10am – 1pm" },
  { id: "afternoon", label: "Afternoon", time: "1pm – 4pm" },
  { id: "evening", label: "Evening", time: "4pm – 7pm" },
  { id: "custom", label: "Custom time", time: "Pick an exact time" },
];
const QUESTION_SUGGESTIONS = [
  "Pricing & current offers",
  "Home loan help",
  "Possession date",
  "Parking & amenities",
  "Floor plans & sizes",
];

// "15:30" -> "3:30 PM"
function to12Hour(value) {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
const GROUP_SIZES = ["Just me", "2 people", "3–4 people", "5 or more"];
const STEPS = [
  { id: 1, label: "Project", icon: Building2 },
  { id: 2, label: "Date & time", icon: CalendarDays },
  { id: 3, label: "Your details", icon: UserRound },
  { id: 4, label: "Review", icon: CheckCircle2 },
];

const expectations = [
  { icon: CalendarCheck, title: "You send a request", text: "Choose a project, day and time. It takes about a minute." },
  { icon: MessageCircle, title: "We confirm with you", text: "Our team gets in touch on WhatsApp or by phone to confirm the details." },
  { icon: Car, title: "Visit the project", text: "See the location, the tower and the homes in person." },
  { icon: HeartHandshake, title: "Decide at your pace", text: "Take your time to compare. We're happy to answer questions afterwards." },
];

const visitFaqs = [
  { q: "Can I change my visit time later?", a: "Of course. Just message us on WhatsApp and we'll gladly help you find a new time." },
  { q: "How long does a site visit take?", a: "Usually one to two hours per project, including a short drive around the neighbourhood." },
  { q: "Can I visit more than one project?", a: "Yes. Mention the projects you're interested in and we'll help plan the visits." },
  { q: "What should I bring?", a: "Just your questions. Our site visit checklist can help you decide what to look at and what to ask." },
];

// Next 14 days, in the visitor's local time.
function upcomingDays() {
  const days = [];
  const start = new Date();
  for (let i = 1; i <= 14; i += 1) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    days.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      long: d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }),
    });
  }
  return days;
}

export default function BookVisit() {
  const [searchParams] = useSearchParams();
  const preselected = projects.find((p) => p.slug === searchParams.get("project"));
  const days = useMemo(upcomingDays, []);

  const [step, setStep] = useState(preselected ? 2 : 1);
  const [booking, setBooking] = useState({
    project: preselected?.slug ?? "",
    date: "",
    slot: "",
    group: GROUP_SIZES[0],
    name: "",
    phone: "",
    contactBy: "WhatsApp",
    notes: "",
    customTime: "",
    question: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [stepNotice, setStepNotice] = useState("");
  const wizardRef = useRef(null);
  const stepsRef = useRef(null);

  const set = (field, value) => {
    setBooking((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setStepNotice("");
  };

  // Which steps are filled in. Every step can be opened at any time; this only
  // drives the ticks on the step bar and the "missing" hints on Review.
  const phoneValid = /^\+?[0-9]{10,15}$/.test(booking.phone.replace(/[\s()-]/g, ""));
  const complete = {
    1: Boolean(booking.project),
    2: Boolean(booking.date && booking.slot && (booking.slot !== "custom" || booking.customTime)),
    3: Boolean(booking.name.trim() && phoneValid),
  };
  complete[4] = complete[1] && complete[2] && complete[3];

  // Scroll so the step bar sits just below the sticky header, with the form
  // underneath, instead of hiding the steps behind the header.
  const showWizard = () =>
    stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Picking a project moves straight on to choosing a date.
  const chooseProject = (slug) => {
    set("project", slug);
    setStep(2);
    window.setTimeout(showWizard, 50);
  };
  const project = projects.find((p) => p.slug === booking.project);
  const day = days.find((d) => d.iso === booking.date);
  const slot = SLOTS.find((s) => s.id === booking.slot);
  // Readable time for the summary, review and message.
  const timeText = !slot
    ? ""
    : slot.id === "custom"
      ? booking.customTime
        ? `${to12Hour(booking.customTime)} (custom time)`
        : ""
      : `${slot.label} (${slot.time})`;

  // Checks only the fields on one step (used by the Continue button).
  const validateStep = (which) => {
    const next = {};
    if (which === 1 && !booking.project) next.project = "Please choose a project, or pick “Help me choose”.";
    if (which === 2) {
      if (!booking.date) next.date = "Please choose a day for your visit.";
      if (!booking.slot) next.slot = "Please choose a time of day.";
      else if (booking.slot === "custom" && !booking.customTime) next.slot = "Please pick your preferred time.";
    }
    if (which === 3) {
      if (!booking.name.trim()) next.name = "Please tell us your name.";
      if (!phoneValid) next.phone = "Please enter a valid phone number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Step buttons always open the chosen step.
  const goTo = (target) => {
    setStep(target);
    setStepNotice("");
    showWizard();
  };

  // Continue checks the current step first, then moves on.
  const next = () => {
    if (validateStep(step)) goTo(step + 1);
    else setStepNotice("Please complete the highlighted details to continue, or jump to any step above.");
  };

  const confirm = () => {
    const message = formatWhatsAppMessage("🏡 *New Site Visit Request*", [
      [
        ["📍", "Project", project ? `${project.name}, ${project.location}` : "Please suggest suitable options"],
        ["📅", "Day", day?.long],
        ["🕐", "Time", timeText],
        ["👥", "Visitors", booking.group],
      ],
      [
        ["👤", "Name", booking.name],
        ["📞", "Phone", booking.phone],
        ["💬", "Contact via", booking.contactBy],
        ["📝", "Notes", booking.notes],
        ["❓", "Question", booking.question],
      ],
    ]);
    openWhatsApp(message, WHATSAPP_NUMBER);
    setSent(true);
  };

  return (
    <>
      <SEO
        title="Book a Site Visit in Gurgaon | Gratia Estates"
        description="Book a site visit to Gurgaon residential projects in a few simple steps. Choose a project, a day and a time, and our team will confirm with you."
        path="/book-visit"
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0b1a27] via-[#0f2a33] to-[#0f3d34] text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[26rem] rounded-full bg-emerald-400/15 blur-3xl" aria-hidden="true" />
        <div className="container-luxury py-10 sm:py-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link to="/" className="hover:text-emerald-300">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-emerald-300" aria-current="page">Book a visit</span>
          </nav>
          <div className="mt-6 grid items-end gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-200">
                <Sparkles size={14} aria-hidden="true" /> Takes about a minute
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight !text-white sm:text-5xl">
                Book your site visit
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">
                We'd be delighted to show you around. Choose a project and a time that
                suits you, and our team will be in touch to confirm everything.
              </p>
            </div>
            <ul className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Building2, value: projects.length, label: "Projects to visit" },
                { icon: Landmark, value: new Set(projects.map((p) => p.developer)).size, label: "Developers" },
                { icon: CalendarDays, value: 14, label: "Days to choose from" },
              ].map(({ icon: Icon, value, label }) => (
                <li key={label} className="rounded-2xl border border-white/10 bg-white/[.06] p-3">
                  <Icon size={18} className="mx-auto text-emerald-300" aria-hidden="true" />
                  <p className="mt-1 font-display text-xl font-bold">{value}</p>
                  <p className="text-[11px] text-white/60">{label}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Stepper */}
          <ol ref={stepsRef} className="mt-8 grid scroll-mt-24 grid-cols-4 gap-2" aria-label="Booking steps">
            {STEPS.map(({ id, label, icon: Icon }) => {
              const current = !sent && step === id;
              const done = sent || (complete[id] && !current);
              const needsInfo = !sent && !current && !complete[id] && id < 4;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => goTo(id)}
                    aria-current={current ? "step" : undefined}
                    title={`Go to ${label}`}
                    className={`relative flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition sm:text-sm ${current ? "border-emerald-300 bg-emerald-400/20 text-white shadow-[0_0_0_3px_rgba(52,211,153,.15)]" : done ? "border-emerald-400/30 bg-white/10 text-white hover:bg-white/15" : "border-white/20 bg-white/[.04] text-white/85 hover:border-emerald-300/60 hover:bg-white/10"}`}
                  >
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full ${done ? "bg-emerald-400 text-[#0b1a27]" : current ? "bg-white text-[#0b1a27]" : "bg-white/15 text-white"}`}>
                      {done ? <Check size={15} aria-hidden="true" /> : <Icon size={14} aria-hidden="true" />}
                    </span>
                    {needsInfo && (
                      <span className="absolute right-2 top-2 size-2 rounded-full bg-amber-400" aria-label="Details needed" />
                    )}
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{id}</span>
                    {current && (
                      <span className="ml-auto hidden text-[10px] font-bold uppercase tracking-wide text-emerald-300 lg:inline">
                        Now
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Wizard + summary */}
      <section className="py-10 sm:py-12">
        <div className="container-luxury grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div
            ref={wizardRef}
            className="scroll-mt-28 rounded-3xl border border-[#e7e2d8] bg-white p-5 shadow-[0_18px_50px_rgba(20,37,54,.07)] sm:p-8"
          >
            {stepNotice && !sent && (
              <p
                role="alert"
                className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
              >
                <Info size={17} className="shrink-0 text-amber-600" aria-hidden="true" />
                {stepNotice}
              </p>
            )}
            {sent ? (
              <div className="py-6 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={32} aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-3xl font-semibold text-[#142536]">
                  Thank you, {booking.name.trim().split(" ")[0]}!
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7 text-[#4b5966]">
                  WhatsApp has opened with your visit request. Please tap <strong>send</strong> there,
                  and our team will get in touch to confirm your visit. We look forward to meeting you.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link to="/blog/site-visit-checklist-gurgaon" className="inline-flex items-center gap-2 rounded-full bg-[#142536] px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                    Read the site visit checklist <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  <button type="button" onClick={() => { setSent(false); setStep(1); }} className="rounded-full border border-[#d9dce0] px-5 py-3 text-sm font-semibold text-[#142536]">
                    Book another visit
                  </button>
                </div>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <StepShell title="Which project would you like to see?" hint="Pick one to start. You can mention others in your notes.">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {projects.map((p) => {
                        const selected = booking.project === p.slug;
                        return (
                          <button
                            key={p.slug}
                            type="button"
                            onClick={() => chooseProject(p.slug)}
                            aria-pressed={selected}
                            className={`group relative overflow-hidden rounded-2xl border-2 text-left transition ${selected ? "border-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,.2)]" : "border-transparent ring-1 ring-[#e7e2d8] hover:ring-emerald-300"}`}
                          >
                            <img src={p.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                            {selected && (
                              <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-emerald-500 text-white shadow">
                                <Check size={17} aria-hidden="true" />
                              </span>
                            )}
                            <span className="block p-3">
                              <span className="block font-semibold text-[#142536]">{p.name}</span>
                              <span className="flex items-center gap-1 text-xs text-[#68717a]">
                                <MapPin size={12} aria-hidden="true" /> {p.location}
                              </span>
                              <span className="mt-1 block text-xs font-semibold text-emerald-700">{p.status}</span>
                            </span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => chooseProject("help")}
                        aria-pressed={booking.project === "help"}
                        className={`flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition ${booking.project === "help" ? "border-emerald-500 bg-emerald-50" : "border-[#d9dce0] hover:border-emerald-300"}`}
                      >
                        <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                          <Sparkles size={20} aria-hidden="true" />
                        </span>
                        <span className="font-semibold text-[#142536]">Help me choose</span>
                        <span className="text-xs text-[#68717a]">We'll suggest projects that suit you</span>
                      </button>
                    </div>
                    <FieldError text={errors.project} />
                  </StepShell>
                )}

                {step === 2 && (
                  <StepShell title="When would you like to visit?" hint="Choose a day and a time of day. We'll confirm the exact time with you.">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-[#536272]">Day</p>
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                      {days.map((d) => {
                        const selected = booking.date === d.iso;
                        return (
                          <button
                            key={d.iso}
                            type="button"
                            onClick={() => set("date", d.iso)}
                            aria-pressed={selected}
                            aria-label={d.long}
                            className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2.5 transition ${selected ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#e7e2d8] bg-white text-[#142536] hover:border-emerald-300"}`}
                          >
                            <span className={`text-[11px] font-semibold uppercase ${selected ? "text-white/85" : "text-[#68717a]"}`}>{d.weekday}</span>
                            <span className="font-display text-xl font-bold">{d.day}</span>
                            <span className={`text-[11px] ${selected ? "text-white/85" : "text-[#68717a]"}`}>{d.month}</span>
                          </button>
                        );
                      })}
                    </div>
                    <FieldError text={errors.date} />

                    <p className="mt-6 text-xs font-bold uppercase tracking-[.12em] text-[#536272]">Time of day</p>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {SLOTS.map((s) => {
                        const selected = booking.slot === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => set("slot", s.id)}
                            aria-pressed={selected}
                            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${selected ? "border-emerald-500 bg-emerald-50" : "border-[#e7e2d8] hover:border-emerald-300"}`}
                          >
                            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${selected ? "bg-emerald-500 text-white" : s.id === "custom" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                              {s.id === "custom" ? <Timer size={18} aria-hidden="true" /> : <Clock3 size={18} aria-hidden="true" />}
                            </span>
                            <span>
                              <span className="block font-semibold text-[#142536]">{s.label}</span>
                              <span className="text-xs text-[#68717a]">{s.time}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {booking.slot === "custom" && (
                      <div className="mt-4 flex flex-wrap items-end gap-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                        <label className="block">
                          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.12em] text-[#536272]">
                            <Timer size={13} className="text-amber-600" aria-hidden="true" /> Your preferred time
                          </span>
                          <input
                            type="time"
                            step={900}
                            value={booking.customTime}
                            onChange={(event) => set("customTime", event.target.value)}
                            className="rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-base font-semibold text-[#142536] outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                          />
                        </label>
                        <p className="max-w-sm pb-1 text-sm leading-6 text-amber-900">
                          {booking.customTime
                            ? `We'll do our best to arrange your visit at ${to12Hour(booking.customTime)} and confirm with you.`
                            : "Choose any time that suits you. We'll confirm whether it works for the project."}
                        </p>
                      </div>
                    )}
                    <FieldError text={errors.slot} />

                    <p className="mt-6 text-xs font-bold uppercase tracking-[.12em] text-[#536272]">Who's coming?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {GROUP_SIZES.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => set("group", g)}
                          aria-pressed={booking.group === g}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${booking.group === g ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#e7e2d8] text-[#142536] hover:border-emerald-300"}`}
                        >
                          <Users size={14} aria-hidden="true" /> {g}
                        </button>
                      ))}
                    </div>
                  </StepShell>
                )}

                {step === 3 && (
                  <StepShell title="How can we reach you?" hint="We'll only use these details to arrange your visit.">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField label="Your name" value={booking.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" placeholder="Full name" />
                      <TextField label="Phone number" value={booking.phone} onChange={(v) => set("phone", v)} error={errors.phone} type="tel" autoComplete="tel" placeholder="10-digit mobile number" />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-[#536272]">Best way to confirm</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["WhatsApp", "Phone call"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => set("contactBy", option)}
                          aria-pressed={booking.contactBy === option}
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${booking.contactBy === option ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#e7e2d8] text-[#142536] hover:border-emerald-300"}`}
                        >
                          {option === "WhatsApp" ? <MessageCircle size={15} aria-hidden="true" /> : <CallIcon size={15} />} {option}
                        </button>
                      ))}
                    </div>
                    <label className="mt-5 block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[#536272]">
                        Anything we should know? <span className="font-normal normal-case tracking-normal">(optional)</span>
                      </span>
                      <textarea
                        rows={3}
                        value={booking.notes}
                        onChange={(event) => set("notes", event.target.value)}
                        placeholder="e.g. other projects you'd like to see, budget, accessibility needs"
                        className="w-full resize-y rounded-xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      />
                    </label>

                    {/* Any other question the form doesn't cover */}
                    <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                      <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.12em] text-[#536272]">
                          <HelpCircle size={14} className="text-sky-600" aria-hidden="true" />
                          Any other questions? <span className="font-normal normal-case tracking-normal">(optional)</span>
                        </span>
                        <textarea
                          rows={2}
                          value={booking.question}
                          onChange={(event) => set("question", event.target.value)}
                          maxLength={500}
                          placeholder="Ask us anything we haven't covered. We'll be happy to answer before your visit."
                          className="w-full resize-y rounded-xl border border-[#d9dce0] bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                        />
                      </label>
                      <p className="mt-2 text-xs text-[#68717a]">Quick add:</p>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {QUESTION_SUGGESTIONS.map((topic) => {
                          const added = booking.question.includes(topic);
                          return (
                            <button
                              key={topic}
                              type="button"
                              disabled={added}
                              onClick={() =>
                                set("question", booking.question.trim() ? `${booking.question.trim()}; ${topic}` : topic)
                              }
                              className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 transition hover:border-sky-400 disabled:cursor-default disabled:border-sky-500 disabled:bg-sky-500 disabled:text-white"
                            >
                              {added ? <Check size={12} aria-hidden="true" /> : "+"} {topic}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </StepShell>
                )}

                {step === 4 && (
                  <StepShell
                    title="Please review your visit"
                    hint={complete[4] ? "Everything look right? Tap confirm and WhatsApp opens with your request." : "Almost there. Please add the details marked below."}
                  >
                    <dl className="divide-y divide-[#eee9df] rounded-2xl border border-[#e7e2d8]">
                      {[
                        { label: "Project", value: project ? `${project.name}, ${project.location}` : booking.project === "help" ? "Help me choose" : "", step: 1 },
                        { label: "Day", value: day?.long ?? "", step: 2 },
                        { label: "Time", value: timeText, step: 2 },
                        { label: "Visitors", value: booking.group, step: 2 },
                        { label: "Name", value: booking.name.trim(), step: 3 },
                        { label: "Phone", value: phoneValid ? booking.phone : "", step: 3 },
                        { label: "Confirm by", value: booking.contactBy, step: 3 },
                        // Optional extras appear only when filled in.
                        ...(booking.notes.trim() ? [{ label: "Notes", value: booking.notes.trim(), step: 3 }] : []),
                        ...(booking.question.trim() ? [{ label: "Question", value: booking.question.trim(), step: 3 }] : []),
                      ].map((row) => (
                        <div key={row.label} className={`flex items-center justify-between gap-4 px-4 py-3 ${row.value ? "" : "bg-amber-50/70"}`}>
                          <dt className="text-xs font-bold uppercase tracking-[.1em] text-[#68717a]">{row.label}</dt>
                          <dd className="flex items-center gap-3 text-right text-sm font-semibold text-[#142536]">
                            {row.value ? (
                              <>
                                {row.value}
                                <button type="button" onClick={() => goTo(row.step)} className="text-emerald-600 hover:text-emerald-700" aria-label={`Edit ${row.label}`}>
                                  <Pencil size={14} aria-hidden="true" />
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="font-medium text-amber-700">Not added yet</span>
                                <button
                                  type="button"
                                  onClick={() => goTo(row.step)}
                                  className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600"
                                >
                                  Add
                                </button>
                              </>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <button
                      type="button"
                      onClick={confirm}
                      disabled={!complete[4]}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(37,211,102,.35)] transition hover:bg-[#1EBE5A] disabled:cursor-not-allowed disabled:bg-[#9ad9b1] disabled:shadow-none"
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                      {complete[4] ? "Confirm visit request on WhatsApp" : "Add the missing details to confirm"}
                    </button>
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#68717a]">
                      <ShieldCheck size={14} className="text-emerald-600" aria-hidden="true" />
                      Your details are only used to arrange your visit.
                    </p>
                  </StepShell>
                )}

                {step < 4 && (
                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#eee9df] pt-5">
                    <button
                      type="button"
                      onClick={() => goTo(step - 1)}
                      disabled={step === 1}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#142536] disabled:invisible"
                    >
                      <ArrowLeft size={16} aria-hidden="true" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(5,150,105,.3)] transition hover:bg-emerald-700"
                    >
                      Continue <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Live summary + reassurance */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-[#e7e2d8] bg-white shadow-sm">
              {project ? (
                <img src={project.image} alt="" className="aspect-[16/9] w-full object-cover" />
              ) : (
                <div className="grid aspect-[16/9] place-items-center bg-gradient-to-br from-emerald-50 to-[#f7f4ed]">
                  <Building2 size={36} className="text-emerald-600/60" aria-hidden="true" />
                </div>
              )}
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-[.16em] text-emerald-700">Your visit</p>
                <p className="mt-1 font-display text-lg font-semibold text-[#142536]">
                  {project ? project.name : booking.project === "help" ? "We'll suggest projects" : "Choose a project"}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[#4b5966]">
                  <li className="flex items-center gap-2"><MapPin size={15} className="text-emerald-600" aria-hidden="true" /> {project?.location ?? "Gurgaon"}</li>
                  <li className="flex items-center gap-2"><CalendarDays size={15} className="text-emerald-600" aria-hidden="true" /> {day?.long ?? "Day not chosen yet"}</li>
                  <li className="flex items-center gap-2"><Clock3 size={15} className="text-emerald-600" aria-hidden="true" /> {timeText || "Time not chosen yet"}</li>
                  <li className="flex items-center gap-2"><Users size={15} className="text-emerald-600" aria-hidden="true" /> {booking.group}</li>
                </ul>
              </div>
            </div>
            <div className="rounded-3xl bg-[#0f2a33] p-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-emerald-300">Why book with us</p>
              <ul className="mt-3 space-y-3 text-sm">
                {[
                  "One advisor helps you from shortlist to decision",
                  "Projects from established Gurgaon developers",
                  "No rush: decide in your own time",
                  "Your details are used only to arrange your visit",
                ].map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span className="text-white/85">{point}</span>
                  </li>
                ))}
              </ul>
              <a href="tel:+919109776155" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#34C759] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2DB14F]">
                <CallIcon size={16} /> Prefer to call? +91 91097 76155
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* What happens next + FAQs */}
      <section className="bg-white py-10 sm:py-12">
        <div className="container-luxury grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-emerald-700">What to expect</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#142536]">What happens after you book</h2>
            <ol className="mt-6 space-y-4">
              {expectations.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="flex gap-4">
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Icon size={21} aria-hidden="true" />
                    <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[#142536] text-[10px] font-bold text-white">{index + 1}</span>
                  </span>
                  <span>
                    <span className="block font-semibold text-[#142536]">{title}</span>
                    <span className="text-sm leading-6 text-[#5e6872]">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-emerald-700">Visit questions</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#142536]">Good to know</h2>
            <div className="mt-6 space-y-3">
              {visitFaqs.map(({ q, a }, index) => (
                <details key={q} open={index === 0} className="group rounded-2xl border border-[#e7e2d8] bg-[#fbfaf7] p-4 open:bg-white open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-[#142536] [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronRight size={17} className="shrink-0 text-emerald-600 transition group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-[#5e6872]">{a}</p>
                </details>
              ))}
            </div>
            <p className="mt-5 text-sm text-[#5e6872]">
              Have a different question?{" "}
              <Link to="/contact" className="font-semibold text-emerald-700 hover:underline">Contact our team</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function StepShell({ title, hint, children }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-[#142536] sm:text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-[#5e6872]">{hint}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function FieldError({ text }) {
  return text ? <p className="mt-2 text-sm text-red-600" role="alert">{text}</p> : null;
}

function TextField({ label, value, onChange, error, type = "text", autoComplete, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[#536272]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-[#fbfaf7] px-4 py-3 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-emerald-100 ${error ? "border-red-400" : "border-[#d9dce0] focus:border-emerald-400"}`}
      />
      <FieldError text={error} />
    </label>
  );
}
