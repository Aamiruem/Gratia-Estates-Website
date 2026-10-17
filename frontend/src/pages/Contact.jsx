import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Clock3,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const WHATSAPP_NUMBER = "919109776155";

const supportFeatures = [
  {
    icon: Target,
    title: "Requirement matching",
    description:
      "Shortlist residential opportunities around your preferred location, budget and lifestyle needs.",
  },
  {
    icon: Building2,
    title: "Project discovery",
    description:
      "Explore relevant pre-launch, newly launched and ready-to-move projects across Gurgaon.",
  },
  {
    icon: CalendarCheck,
    title: "Site-visit coordination",
    description:
      "Discuss suitable options and coordinate the next steps for a project visit with our team.",
  },
  {
    icon: ShieldCheck,
    title: "Guided decision-making",
    description:
      "Get help comparing project details, amenities, connectivity and your stated priorities.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Share your brief",
    description: "Tell us your budget, preferred area and property goals.",
  },
  {
    number: "02",
    title: "Discuss options",
    description:
      "Our team reviews your needs and helps identify relevant projects.",
  },
  {
    number: "03",
    title: "Compare details",
    description:
      "Review the key features and practical considerations for each option.",
  },
  {
    number: "04",
    title: "Plan the next step",
    description: "Arrange a conversation or site visit when you are ready.",
  },
];

export default function Contact() {
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
    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const message = [
      "Hello Gratia Estates, I would like to discuss a property requirement.",
      "",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Email: ${form.email.trim() || "Not provided"}`,
      `Budget: ${form.budget || "Not specified"}`,
      `Preferred location: ${form.location.trim() || "Not specified"}`,
      `Property type: ${form.propertyType || "Not specified"}`,
      `Buying timeline: ${form.timeline || "Not specified"}`,
      `Additional details: ${form.message.trim() || "Not provided"}`,
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <SEO
        title="Contact Gratia Estates | Gurgaon Property Advisory"
        description="Contact Gratia Estates for personalised guidance on Gurgaon residential projects, project shortlisting, property comparisons and site visits."
        path="/contact"
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#f8f6f1] text-[#17283a]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_15%,rgba(198,161,91,0.14),transparent_42%),linear-gradient(120deg,#f8f6f1_0%,#f3efe6_62%,#eee7d9_100%)]" />
        <div className="container-luxury py-14 sm:py-20 lg:py-24">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#68717a]"
          >
            <Link to="/" className="transition hover:text-[#8d6c32]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#8d6c32]">Contact us</span>
          </nav>

          <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[1.2fr_.8fr]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8d6c32]">
                <Sparkles size={14} /> Personalised property advisory
              </div>
              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-[#142536] sm:text-5xl lg:text-6xl xl:text-7xl">
                Your next address
                <span className="mt-2 block text-[#9a7940]">
                  starts with a conversation.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5e6872] sm:text-base sm:leading-8">
                Tell us what matters to you. We’ll help you explore relevant
                residential projects across Gurgaon, compare your options and
                plan the next step at your pace.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#enquiry-form"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c6a15b] px-6 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#142536] transition hover:bg-[#dfc58f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c6a15b]/35"
                >
                  Share your requirement <ArrowRight size={16} />
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#17283a]/25 px-6 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#17283a] transition hover:border-[#c6a15b] hover:text-[#8d6c32]"
                >
                  <MessageCircle size={16} /> WhatsApp us
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:pl-8">
              <div className="rounded-3xl border border-[#17283a]/10 bg-white/80 p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5efe3] text-[#9a7940]">
                  <MapPin size={21} />
                </div>
                <p className="font-display text-xl text-[#142536] sm:text-2xl">
                  Gurgaon
                </p>
                <p className="mt-2 text-xs leading-5 text-[#5e6872]">
                  Focused local project guidance
                </p>
              </div>
              <div className="mt-8 rounded-3xl border border-[#17283a]/10 bg-white/80 p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5efe3] text-[#9a7940]">
                  <Headset size={21} />
                </div>
                <p className="font-display text-xl text-[#142536] sm:text-2xl">
                  One-to-one
                </p>
                <p className="mt-2 text-xs leading-5 text-[#5e6872]">
                  Support shaped around your needs
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-4 rounded-3xl border border-[#c6a15b]/40 bg-[#f5efe3] p-5 sm:p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c6a15b] text-[#142536]">
                  <BadgeCheck size={21} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#17283a]">
                    Clear, considered guidance
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#5e6872]">
                    Understand the options before deciding what works for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact details + enquiry form */}
      <section className="bg-[#f6f5f1] py-16 sm:py-20 lg:py-24">
        <div className="container-luxury grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-14">
          <aside>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#9b7a40]">
              Connect with our team
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-[#142536] sm:text-4xl">
              A more considered way to find your home.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5e6872] sm:text-base">
              From the first shortlist to arranging a site visit, share your
              priorities and we’ll help you work through the available
              information for relevant Gurgaon residential projects.
            </p>

            <div className="mt-8 space-y-3">
              <ContactCard
                icon={Phone}
                eyebrow="Call our team"
                title="+91 91097 76155"
                detail="Speak to us about your requirement"
                href="tel:+919109776155"
              />
              <ContactCard
                icon={Mail}
                eyebrow="Email enquiries"
                title="purwarmanish@gmail.com"
                detail="Send your questions or project brief"
                href="mailto:purwarmanish@gmail.com"
              />
              <ContactCard
                icon={MapPin}
                eyebrow="Office location"
                title="Iworkk Coworking Office Space"
                detail="90 IDC, Gurgaon, Haryana"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-[#c6a15b]/30 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3ead8] text-[#9b7a40]">
                  <Clock3 size={19} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#142536]">
                    Prefer a quick conversation?
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#5e6872]">
                    Call or message us with a convenient time to discuss your
                    property goals.
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#8d6c32] hover:text-[#142536]"
                  >
                    Start a WhatsApp chat <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <div id="enquiry-form" className="scroll-mt-28">
            <form
              onSubmit={submit}
              noValidate
              className="rounded-3xl border border-[#e7e2d8] bg-white p-6 shadow-[0_22px_70px_rgba(20,37,54,.08)] sm:p-9 lg:p-10"
            >
              <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#9b7a40]">
                    Property enquiry
                  </p>
                  <h2 className="mt-2 font-display text-2xl leading-tight text-[#142536] sm:text-3xl">
                    Tell us what you’re looking for
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#5e6872]">
                    Complete the details below. Your enquiry will open in
                    WhatsApp for you to review and send.
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3ead8] text-[#9b7a40]">
                  <Workflow size={23} />
                </div>
              </div>

              <div className="mt-7 grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  placeholder="e.g. Your name"
                  value={form.name}
                  onChange={(value) => updateField("name", value)}
                  required
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  label="Phone number"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(value) => updateField("phone", value)}
                  required
                  error={errors.phone}
                  type="tel"
                  autoComplete="tel"
                />
                <Field
                  label="Email address"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  error={errors.email}
                  type="email"
                  autoComplete="email"
                />
                <SelectField
                  label="Approximate budget"
                  value={form.budget}
                  onChange={(value) => updateField("budget", value)}
                  options={[
                    "Under ₹1 Cr",
                    "₹1 Cr – ₹2 Cr",
                    "₹2 Cr – ₹3 Cr",
                    "₹3 Cr – ₹5 Cr",
                    "₹5 Cr – ₹10 Cr",
                    "₹10 Cr+",
                    "Not decided yet",
                  ]}
                  placeholder="Choose your budget"
                  icon={Wallet}
                />
                <SelectField
                  label="Property preference"
                  value={form.propertyType}
                  onChange={(value) => updateField("propertyType", value)}
                  options={[
                    "Apartment / Flat",
                    "Luxury residence",
                    "Builder floor",
                    "Villa / Independent home",
                    "Plot",
                    "Open to suggestions",
                  ]}
                  placeholder="Choose property type"
                  icon={Building2}
                />
                <SelectField
                  label="Buying timeline"
                  value={form.timeline}
                  onChange={(value) => updateField("timeline", value)}
                  options={[
                    "As soon as possible",
                    "Within 3 months",
                    "Within 3–6 months",
                    "Within 6–12 months",
                    "Just exploring",
                  ]}
                  placeholder="When are you planning?"
                  icon={CalendarCheck}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Preferred Gurgaon location"
                    placeholder="e.g. Dwarka Expressway, Golf Course Road, New Gurgaon"
                    value={form.location}
                    onChange={(value) => updateField("location", value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.12em] text-[#536272]">
                      Anything else we should know?{" "}
                      <span className="font-normal normal-case tracking-normal text-[#68717a]">
                        (optional)
                      </span>
                    </span>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(event) =>
                        updateField("message", event.target.value)
                      }
                      placeholder="Share your priorities, preferred possession timeline, amenities or questions..."
                      className="w-full resize-y rounded-2xl border border-[#d9dce0] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#87909a] focus:border-[#c6a15b] focus:bg-white focus:ring-4 focus:ring-[#c6a15b]/10"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#142536] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#c6a15b] hover:text-[#142536] hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c6a15b]/35"
              >
                <MessageCircle size={17} /> Continue to WhatsApp{" "}
                <ArrowRight size={16} />
              </button>
              <div className="mt-4 flex items-start justify-center gap-2 text-center text-[11px] leading-5 text-[#68717a]">
                <ShieldCheck
                  size={14}
                  className="mt-0.5 shrink-0 text-[#9b7a40]"
                />
                <p>
                  Your details are used to respond to your property enquiry.
                  WhatsApp opens with a message draft; you choose whether to
                  send it.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Support capabilities */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container-luxury">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#9b7a40]">
              How we can support you
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-[#142536] sm:text-4xl">
              Useful guidance at every step.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5e6872] sm:text-base">
              A practical, buyer-focused process to help you move from a broad
              search to a clearer shortlist.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {supportFeatures.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-2xl border border-[#e7e2d8] bg-[#fbfaf7] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c6a15b]/60 hover:bg-white hover:shadow-[0_18px_45px_rgba(20,37,54,.09)] sm:rounded-3xl sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eee3cc] text-[#8d6c32] transition group-hover:bg-[#142536] group-hover:text-[#d5b778]">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-[#142536]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5e6872]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#f0eee8] py-16 sm:py-20 lg:py-24">
        <div className="container-luxury">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#9b7a40]">
                Simple, structured, personal
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-[#142536] sm:text-4xl">
                From first message to next steps.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#5e6872] sm:text-base lg:justify-self-end">
              No need to have every detail figured out. Start with what you
              know, and we can work through the rest of your brief together.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-[#e7e2d8] bg-white p-6 sm:p-7"
              >
                <p className="font-display text-3xl text-[#b08b4a]">
                  {step.number}
                </p>
                <h3 className="mt-5 text-base font-semibold text-[#142536]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5e6872]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
{/* Bottom CTA */}
<section className="relative isolate overflow-hidden bg-[#f3efe6] py-16 text-white sm:py-20 lg:py-24">
  {/* Decorative background */}
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#C6A15B]/15 blur-3xl" />
    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#142536]/[0.06] blur-3xl" />
  </div>

  <div className="container-luxury">
    <div className="flex flex-col gap-8 rounded-3xl border border-[#263c50] bg-gradient-to-br from-[#142536] via-[#192d40] to-[#20384c] p-6 shadow-[0_24px_70px_rgba(20,37,54,.2)] sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-12">
      {/* Content */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#C6A15B]" />
          <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#E4C98E] sm:text-xs">
            Gratia Estates · Gurgaon
          </p>
        </div>

        <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-[#F8F7F2] sm:text-4xl lg:text-5xl">
          Your next address
          <span className="mt-1 block text-[#D9B873]">
            starts with the right advice.
          </span>
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#D1D2CC] sm:text-base sm:leading-8">
          Tell us your budget, preferred location and property goals.
          We’ll help you explore relevant residential projects across
          Gurgaon with focused, one-to-one guidance.
        </p>

        {/* Trust points */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 text-sm text-[#E8E8E2]">
            <ShieldCheck size={17} className="shrink-0 text-[#D9B873]" />
            Personalised guidance
          </div>

          <div className="flex items-center gap-2 text-sm text-[#E8E8E2]">
            <MapPin size={17} className="shrink-0 text-[#D9B873]" />
            Gurgaon-focused
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
        <a
          href="tel:+919109776155"
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#D9B873] px-6 py-4 text-xs font-bold uppercase tracking-[.12em] text-[#142536] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#E9D5A5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B873] focus-visible:ring-offset-2 focus-visible:ring-offset-[#142536]"
        >
          <Phone size={17} />
          Call an advisor
        </a>

        <Link
          to="/projects"
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/25 bg-white/[0.04] px-6 py-4 text-xs font-bold uppercase tracking-[.12em] text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#D9B873] hover:bg-[#D9B873]/10 hover:text-[#E9D5A5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B873]"
        >
          Explore projects
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  </div>
</section>

    </>
  );
}

function ContactCard({ icon: Icon, eyebrow, title, detail, href }) {
  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eee3cc] text-[#8d6c32] transition group-hover:bg-[#1a1a18] group-hover:text-[#d5b778]">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#68717a]">
          {eyebrow}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-[#142536] transition group-hover:text-[#8d6c32]">
          {title}
        </p>
        <p className="mt-1 text-xs leading-5 text-[#5e6872]">{detail}</p>
      </div>
      {href && (
        <ArrowRight
          size={16}
          className="ml-auto shrink-0 text-[#87909a] transition group-hover:translate-x-1 group-hover:text-[#8d6c32]"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group flex items-center gap-4 rounded-2xl border border-[#e7e2d8] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#c6a15b]/60 hover:shadow-md sm:p-5"
      >
        {content}
      </a>
    );
  }
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e7e2d8] bg-white p-4 sm:p-5">
      {content}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  error = "",
  autoComplete,
}) {
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
        className={`w-full rounded-2xl border ${error ? "border-red-400" : "border-[#d9dce0]"} bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#142536] outline-none transition placeholder:text-[#87909a] focus:border-[#c6a15b] focus:bg-white focus:ring-4 focus:ring-[#c6a15b]/10`}
      />
      {error && (
        <span
          id={errorId}
          role="alert"
          className="mt-1.5 block text-xs text-red-600"
        >
          {error}
        </span>
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.12em] text-[#536272]">
        {label}
      </span>
      <span className="relative block">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d6c32]"
          />
        )}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full appearance-none rounded-2xl border border-[#d9dce0] bg-[#fbfaf7] py-3.5 pr-10 text-sm text-[#142536] outline-none transition focus:border-[#c6a15b] focus:bg-white focus:ring-4 focus:ring-[#c6a15b]/10 ${Icon ? "pl-10" : "pl-4"}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#68717a]">
          ⌄
        </span>
      </span>
    </label>
  );
}
