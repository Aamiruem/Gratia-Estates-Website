import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Clapperboard,
  ClipboardList,
  Clock3,
  Compass,
  FileSearch,
  HeartHandshake,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Wallet,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CallIcon from "../components/CallIcon";
import SEO from "../components/SEO";
import { projects } from "../data/projects";
import { formatWhatsAppMessage, openWhatsApp } from "../utils/whatsapp";

const WHATSAPP_NUMBER = "919109776155";
const PHONE = "+91 91097 76155";
const EMAIL = "purwarmanish@gmail.com";
const OFFICE = "Iworkk Coworking Office Space, 90 IDC, Gurgaon, Haryana";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent("90 IDC Gurgaon Haryana")}&output=embed`;


const channels = [
  {
    icon: CallIcon,
    title: "Call us",
    detail: PHONE,
    note: "Speak to an advisor directly",
    href: "tel:+919109776155",
    tone: "bg-[#34C759] text-white",
    ring: "hover:border-[#34C759]/60",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "Chat with our team",
    note: "Share your brief or ask a quick question",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    external: true,
    tone: "bg-[#25D366] text-white",
    ring: "hover:border-[#25D366]/60",
  },
  {
    icon: Mail,
    title: "Email",
    detail: EMAIL,
    note: "Send your questions or project brief",
    href: `mailto:${EMAIL}`,
    tone: "bg-sky-500 text-white",
    ring: "hover:border-sky-400/60",
  },
  {
    icon: MapPin,
    title: "Office",
    detail: "90 IDC, Gurgaon",
    note: "Iworkk Coworking Office Space",
    href: "#office",
    tone: "bg-[#c9a45c] text-[#142536]",
    ring: "hover:border-[#c9a45c]/60",
  },
];

const prepareList = [
  { icon: Wallet, title: "Budget range", text: "Including how much you plan to finance." },
  { icon: MapPin, title: "Preferred sectors", text: "Areas close to work, school or family." },
  { icon: Building2, title: "Home type and size", text: "Apartment, floor or villa; number of bedrooms." },
  { icon: CalendarDays, title: "Move-in timeline", text: "Ready now, or open to an upcoming project." },
];

const contactFaqs = [
  {
    q: "How do I book a site visit?",
    a: "Please use our Book a Visit page. Choose a project, a day and a time in a few quick steps, and our team will be in touch to confirm the details with you.",
  },
  {
    q: "Can we talk on the phone before visiting?",
    a: "Yes. Call +91 91097 76155 or message us on WhatsApp to discuss your requirement first.",
  },
  {
    q: "What happens after I send an enquiry?",
    a: "An advisor reviews your requirement and gets back to you with relevant project options and next steps.",
  },
  {
    q: "Where is your office?",
    a: "Iworkk Coworking Office Space, 90 IDC, Gurgaon, Haryana. See the map on this page for directions.",
  },
];

const browseLinks = [
  { to: "/projects", icon: Building2, title: "Browse projects", text: "Compare listed Gurgaon projects", tone: "bg-emerald-100 text-emerald-700" },
  { to: "/videos", icon: Clapperboard, title: "Watch videos", text: "Project walkthroughs and stories", tone: "bg-rose-100 text-rose-700" },
  { to: "/blog", icon: BookOpen, title: "Read guides", text: "Buying tips and location insights", tone: "bg-violet-100 text-violet-700" },
];


export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Gratia Estates | Gurgaon Property Help & Support"
        description="Questions about Gurgaon property? Contact Gratia Estates by phone, WhatsApp or email. Our team is glad to help with projects, pricing, home loans and paperwork."
        path="/contact"
      />

      {/* Hero with site-visit booking form */}
      <section className="relative isolate overflow-hidden border-b border-[#e7e2d8] bg-gradient-to-br from-[#fbf8f2] via-[#f6efe2] to-[#efe4cf]">
        <div
          className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[28rem] rounded-full bg-[#c9a45c]/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-luxury grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs font-semibold text-[#68717a]"
            >
              <Link to="/" className="transition hover:text-[#9a7940]">
                Home
              </Link>
              <ChevronRight size={14} aria-hidden="true" />
              <span className="text-[#9a7940]" aria-current="page">
                Contact us
              </span>
            </nav>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#c9a45c]/40 bg-white/80 py-1.5 pl-1.5 pr-4 text-xs font-bold text-[#142536] shadow-sm">
              <span className="grid size-7 place-items-center rounded-full bg-[#142536] text-[#e1c98f]">
                <Sparkles size={14} aria-hidden="true" />
              </span>
              We're here to help
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-[#142536] sm:text-5xl xl:text-[3.4rem]">
              We'd love to
              <span className="block bg-gradient-to-r from-[#9a7335] via-[#c9a45c] to-[#9a7335] bg-clip-text text-transparent">
                hear from you.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#4b5966] sm:text-lg sm:leading-8">
              Whether you have a quick question or need detailed guidance, our
              team is glad to help. No question is too small, so please reach
              out in whichever way suits you best.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {channels.map(({ icon: Icon, title, detail, href, external, tone }) => (
                <li key={title}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="flex items-center gap-3 rounded-2xl border border-[#e7e2d8] bg-white/90 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-[.12em] text-[#80602b]">
                        {title}
                      </span>
                      <span className="block truncate text-sm font-semibold text-[#142536]">
                        {detail}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <HelpTopics />
        </div>
      </section>

      {/* Requirement form + office */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container-luxury grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:gap-10">
          <EnquiryForm />
          <aside id="office" className="scroll-mt-28 space-y-5">
            <div className="overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#fbfaf7] shadow-sm">
              <iframe
                title="Gratia Estates office location"
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0 lg:h-72"
              />
              <div className="flex items-start gap-3 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-[#142536]">Our office</p>
                  <p className="mt-1 text-sm leading-6 text-[#5e6872]">{OFFICE}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("90 IDC Gurgaon Haryana")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#80602b] hover:text-[#142536]"
                  >
                    Get directions <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#0d1b2a] via-[#142536] to-[#24405a] p-6 text-white">
              <span className="grid size-11 place-items-center rounded-xl bg-[#c9a45c] text-[#142536]">
                <Clock3 size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-xl font-semibold">Prefer a quick conversation?</p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                Call or message us with a convenient time to discuss your
                property goals.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="tel:+919109776155"
                  className="inline-flex items-center gap-2 rounded-full bg-[#34C759] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2DB14F]"
                >
                  <CallIcon size={16} /> Call
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1EBE5A]"
                >
                  <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Prepare + contact FAQs (Contact-specific, not repeated elsewhere) */}
      <section className="py-12 sm:py-16">
        <div className="container-luxury grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-600 text-white">
              <ClipboardList size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold text-[#142536] sm:text-3xl">
              Keep these ready before you call
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#4b5966]">
              A few details help us suggest the right projects in the first conversation.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {prepareList.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#142536]">{title}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-[#5e6872]">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="Before you get in touch" title="Contact FAQs" />
            <div className="mt-6 space-y-3">
              {contactFaqs.map(({ q, a }, index) => (
                <details
                  key={q}
                  open={index === 0}
                  className="group rounded-2xl border border-[#e7e2d8] bg-white p-5 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-[#142536] [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronRight
                      size={18}
                      className="mt-0.5 shrink-0 text-[#c9a45c] transition group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#5e6872]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing: browse-first links */}
      <section className="pb-12 sm:pb-16">
        <div className="container-luxury">
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#80602b]">
            Prefer to browse first?
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {browseLinks.map(({ to, icon: Icon, title, text, tone }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex items-center gap-4 rounded-2xl border border-[#e7e2d8] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a45c]"
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${tone}`}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-[#142536]">{title}</span>
                    <span className="text-sm text-[#5e6872]">{text}</span>
                  </span>
                  <ArrowRight size={17} className="text-[#c9a45c] transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#80602b]">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#142536] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

// Support panel: pick a topic and WhatsApp opens with a polite, pre-written message.
const helpTopics = [
  { icon: Building2, label: "Project information", tone: "bg-emerald-100 text-emerald-700", message: "I'd like some information about a project." },
  { icon: Wallet, label: "Pricing & payment plans", tone: "bg-amber-100 text-amber-700", message: "Could you please share pricing and payment plan details?" },
  { icon: Landmark, label: "Home loan guidance", tone: "bg-sky-100 text-sky-700", message: "I'd appreciate some guidance on home loans." },
  { icon: FileSearch, label: "Documents & RERA", tone: "bg-violet-100 text-violet-700", message: "I have a question about project documents and RERA." },
  { icon: Compass, label: "Help me shortlist", tone: "bg-rose-100 text-rose-700", message: "Could you help me shortlist suitable projects?" },
  { icon: HeartHandshake, label: "Something else", tone: "bg-orange-100 text-orange-700", message: "I have a question." },
];

function HelpTopics() {
  return (
    <div className="rounded-3xl border border-[#e7e2d8] bg-white p-6 shadow-[0_30px_70px_rgba(20,37,54,.12)] sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#142536] text-[#e1c98f]">
          <MessageCircle size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#80602b]">Customer support</p>
          <h2 className="font-display text-2xl font-semibold text-[#142536]">How can we help you today?</h2>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#5e6872]">
        Choose a topic and we'll open WhatsApp with a message ready for you. Our
        team will be happy to assist.
      </p>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {helpTopics.map(({ icon: Icon, label, tone, message }) => (
          <li key={label}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Gratia Estates, ${message} Thank you.`)}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-[#eee9df] bg-[#fbfaf7] p-3 transition hover:-translate-y-0.5 hover:border-[#c9a45c] hover:bg-white hover:shadow-sm"
            >
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-semibold text-[#142536]">{label}</span>
              <ChevronRight size={16} className="text-[#c9a45c] transition group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <Link
        to="/book-visit"
        className="mt-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#0f2a33] to-[#0f3d34] p-4 text-white transition hover:opacity-95"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300">
          <CalendarCheck size={19} aria-hidden="true" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Ready to see a project?</span>
          <span className="text-xs text-white/70">Book a site visit in a few quick steps</span>
        </span>
        <ArrowRight size={17} className="text-emerald-300" aria-hidden="true" />
      </Link>
    </div>
  );
}

// Detailed requirement form (unchanged logic): opens a WhatsApp draft.
function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
    location: "",
    propertyType: "",
    timeline: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const submit = (event) => {
    event.preventDefault();
    const cleanPhone = form.phone.replace(/[\s()-]/g, "");
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
      nextErrors.phone = "Enter a valid phone number (10–15 digits).";
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    openWhatsApp(
      formatWhatsAppMessage("🔑 *New Property Enquiry*", [
        [
          ["👤", "Name", form.name],
          ["📞", "Phone", form.phone],
          ["✉️", "Email", form.email],
        ],
        [
          ["💰", "Budget", form.budget],
          ["📍", "Preferred location", form.location],
          ["🏢", "Property type", form.propertyType],
          ["⏳", "Buying timeline", form.timeline],
          ["📝", "Details", form.message],
        ],
      ]),
    );
  };

  return (
    <form
      id="enquiry-form"
      onSubmit={submit}
      noValidate
      className="scroll-mt-28 rounded-3xl border border-[#e7e2d8] bg-[#fbfaf7] p-6 sm:p-9"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#80602b]">
            Property enquiry
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[#142536] sm:text-3xl">
            Tell us what you're looking for
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#5e6872]">
            Complete the details below. Your enquiry opens in WhatsApp for you to
            review and send.
          </p>
        </div>
        <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-700 sm:grid">
          <Workflow size={22} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Full name" placeholder="e.g. Your name" value={form.name} onChange={(v) => updateField("name", v)} required error={errors.name} autoComplete="name" />
        <Field label="Phone number" placeholder="10-digit mobile number" value={form.phone} onChange={(v) => updateField("phone", v)} required error={errors.phone} type="tel" autoComplete="tel" />
        <Field label="Email address" placeholder="you@example.com" value={form.email} onChange={(v) => updateField("email", v)} error={errors.email} type="email" autoComplete="email" />
        <SelectField
          label="Approximate budget"
          value={form.budget}
          onChange={(v) => updateField("budget", v)}
          options={["Under ₹1 Cr", "₹1 Cr – ₹2 Cr", "₹2 Cr – ₹3 Cr", "₹3 Cr – ₹5 Cr", "₹5 Cr – ₹10 Cr", "₹10 Cr+", "Not decided yet"]}
          placeholder="Choose your budget"
          icon={Wallet}
        />
        <SelectField
          label="Property preference"
          value={form.propertyType}
          onChange={(v) => updateField("propertyType", v)}
          options={["Apartment / Flat", "Luxury residence", "Builder floor", "Villa / Independent home", "Plot", "Open to suggestions"]}
          placeholder="Choose property type"
          icon={Building2}
        />
        <SelectField
          label="Buying timeline"
          value={form.timeline}
          onChange={(v) => updateField("timeline", v)}
          options={["As soon as possible", "Within 3 months", "Within 3–6 months", "Within 6–12 months", "Just exploring"]}
          placeholder="When are you planning?"
          icon={CalendarCheck}
        />
        <div className="sm:col-span-2">
          <Field label="Preferred Gurgaon location" placeholder="e.g. Dwarka Expressway, Golf Course Road, New Gurgaon" value={form.location} onChange={(v) => updateField("location", v)} />
        </div>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.12em] text-[#536272]">
            Anything else we should know?{" "}
            <span className="font-normal normal-case tracking-normal text-[#68717a]">(optional)</span>
          </span>
          <textarea
            rows={3}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Share your priorities, preferred possession timeline, amenities or questions..."
            className="w-full resize-y rounded-2xl border border-[#d9dce0] bg-white px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#87909a] focus:border-[#c6a15b] focus:ring-4 focus:ring-[#c6a15b]/10"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#142536] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-white transition hover:bg-[#c6a15b] hover:text-[#142536]"
      >
        <MessageCircle size={17} aria-hidden="true" /> Continue to WhatsApp <ArrowRight size={16} aria-hidden="true" />
      </button>
      <p className="mt-4 flex items-start justify-center gap-2 text-center text-[11px] leading-5 text-[#68717a]">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#9b7a40]" aria-hidden="true" />
        Your details are used only to respond to your enquiry. WhatsApp opens with
        a draft; you choose whether to send it.
      </p>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder = "", error = "", autoComplete }) {
  const inputId = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const errorId = `${inputId}-error`;
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.12em] text-[#536272]">
        {label}
        {required && <span className="ml-1 text-[#a47f3d]">*</span>}
      </span>
      <input
        id={inputId}
        required={required}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-2xl border ${error ? "border-red-400" : "border-[#d9dce0]"} bg-white px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#87909a] focus:border-[#c6a15b] focus:ring-4 focus:ring-[#c6a15b]/10`}
      />
      {error && (
        <span id={errorId} role="alert" className="mt-1.5 block text-xs text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder, icon: Icon }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.12em] text-[#536272]">
        {label}
      </span>
      <span className="relative block">
        {Icon && (
          <Icon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d6c32]" aria-hidden="true" />
        )}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full appearance-none rounded-2xl border border-[#d9dce0] bg-white py-3.5 pr-10 text-sm text-[#142536] outline-none transition focus:border-[#c6a15b] focus:ring-4 focus:ring-[#c6a15b]/10 ${Icon ? "pl-10" : "pl-4"}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronRight size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#68717a]" aria-hidden="true" />
      </span>
    </label>
  );
}