import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const privacySections = [
  {
    title: "Information we collect",
    body: [
      "We may collect personal information that you choose to share with us, including your name, phone number, email address, preferred location, budget, project interest and property requirement.",
      "We may also receive basic technical information such as device type, browser type, pages visited and general interaction data to help improve the website experience.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "We use your information to respond to enquiries, arrange callbacks, schedule site visits, share relevant project details, understand your buying requirement and provide real estate advisory support.",
      "We may use limited website usage information to improve page performance, content quality and enquiry flows.",
    ],
  },
  {
    title: "Communication and consent",
    body: [
      "When you submit an enquiry, call us, email us or contact us through WhatsApp, you consent to being contacted by Gratia Estates regarding your property requirement.",
      "You may ask us to stop promotional or follow-up communication at any time by contacting us through the email address or phone number listed below.",
    ],
  },
  {
    title: "Sharing of information",
    body: [
      "We do not sell your personal information. We may share relevant enquiry details with trusted team members, channel partners, developers or service providers only when needed to respond to your request, arrange a visit or provide project information.",
      "We may disclose information if required by law, regulation, legal process or a lawful request from a government authority.",
    ],
  },
  {
    title: "Data security and retention",
    body: [
      "We take reasonable steps to protect your information from unauthorised access, misuse, loss or disclosure. However, no website, messaging platform or internet transmission can be guaranteed to be completely secure.",
      "We retain enquiry information only for as long as reasonably necessary for advisory, follow-up, record-keeping, legal or business purposes.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You may request access, correction, update or deletion of your personal information, subject to applicable law and legitimate record-keeping requirements.",
      "To make a privacy request or withdraw consent for future communication, please contact us using the details below.",
    ],
  },
  {
    title: "Cookies and third-party links",
    body: [
      "This website may use cookies or similar technologies for performance, analytics and usability. You can control cookies through your browser settings.",
      "Our website may contain links to third-party websites, developer pages, map services, social platforms or messaging services. Their privacy practices are governed by their own policies.",
    ],
  },
  {
    title: "Contact for privacy questions",
    body: [
      "For privacy-related questions, corrections, consent withdrawal or data requests, contact Gratia Estates at purwarmanish@gmail.com or +91 9109776155.",
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Gratia Estates"
        description="Privacy Policy for Gratia Estates website and property enquiries."
        path="/privacy-policy"
      />
      <LegalHero title="Privacy Policy" crumb="Privacy Policy" />
      <section className="bg-ivory py-16 sm:py-20">
        <div className="container-luxury max-w-4xl">
          <div className="rounded-2xl border border-charcoal/10 bg-white p-7 shadow-luxury sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold">
              Last updated: October 7, 2026
            </p>
            <p className="mt-5 text-sm leading-8 text-charcoal/65">
              Gratia Estates respects your privacy. This Privacy Policy explains
              how we collect, use, store and protect information shared through
              this website, phone calls, email, WhatsApp and property enquiry
              forms.
            </p>

            <div className="mt-10 space-y-9">
              {privacySections.map((section) => (
                <div key={section.title}>
                  <h2 className="font-display text-3xl text-charcoal">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-8 text-charcoal/65">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 rounded-xl border border-gold/30 bg-gold/10 p-5 text-xs leading-6 text-charcoal/65">
              This policy is intended as general website information and should
              not be treated as legal advice. Please consult a qualified legal
              professional for formal compliance review.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function LegalHero({ title, crumb }) {
  return (
    <section className="bg-white py-20 text-charcoal">
      <div className="container-luxury">
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.18em]">
          <Link
            to="/"
            className="rounded-full border border-charcoal/15 px-4 py-2 text-charcoal/65 transition hover:border-gold hover:text-gold"
          >
            Home
          </Link>
          <span className="rounded-full border border-gold bg-gold px-4 py-2 text-charcoal">
            {crumb}
          </span>
        </div>
        <h1 className="mt-7 font-display text-5xl sm:text-6xl">{title}</h1>
      </div>
    </section>
  );
}
