import { CalendarDays, FileText, Mail, Phone } from "lucide-react";
import PageHero from "./PageHero";

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Shared layout for Privacy Policy and Terms: summary header, sticky
// numbered contents on the left, numbered section cards on the right.
export default function LegalPage({ title, intro, updated, sections, disclaimer }) {
  return (
    <>
      <PageHero
        crumb={title}
        eyebrow="Legal"
        title={title}
        text={intro}
        aside={
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: CalendarDays, label: "Last updated", value: updated },
              { icon: FileText, label: "Sections", value: `${sections.length} topics` },
              { icon: Mail, label: "Questions", value: "purwarmanish@gmail.com" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-[#e7e2d8] bg-white p-4 shadow-sm"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#142536] text-[#e1c98f]">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[.14em] text-[#80602b]">
                    {label}
                  </span>
                  <span className="block break-words text-sm font-semibold text-[#142536]">
                    {value}
                  </span>
                </span>
              </div>
            ))}
          </div>
        }
      />

      <section className="py-12 sm:py-16">
        <div className="container-luxury grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label="On this page"
              className="rounded-2xl border border-[#e7e2d8] bg-white p-5 shadow-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#80602b]">
                On this page
              </p>
              <ol className="mt-3 space-y-1">
                {sections.map((section, index) => (
                  <li key={section.title}>
                    <a
                      href={`#${slugify(section.title)}`}
                      className="flex gap-3 rounded-lg px-2 py-1.5 text-sm text-[#4b5966] transition hover:bg-[#f7f4ed] hover:text-[#142536]"
                    >
                      <span className="font-semibold text-[#c9a45c]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <a
              href="tel:+919109776155"
              className="mt-4 flex items-center gap-3 rounded-2xl bg-[#142536] p-5 text-white transition hover:bg-[#1f3a52]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#c9a45c] text-[#142536]">
                <Phone size={17} aria-hidden="true" />
              </span>
              <span className="text-sm">
                Questions about this page?
                <strong className="block text-[#e1c98f]">+91 91097 76155</strong>
              </span>
            </a>
          </aside>

          <div className="space-y-5">
            {sections.map((section, index) => (
              <article
                key={section.title}
                id={slugify(section.title)}
                className="scroll-mt-28 rounded-2xl border border-[#e7e2d8] bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="flex items-baseline gap-4 font-display text-2xl font-semibold text-[#142536]">
                  <span className="text-base font-bold text-[#c9a45c]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-[15px] leading-7 text-[#4b5966]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
            <p className="rounded-2xl border border-[#c9a45c]/30 bg-[#c9a45c]/10 p-5 text-xs leading-6 text-[#5e6872]">
              {disclaimer}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
