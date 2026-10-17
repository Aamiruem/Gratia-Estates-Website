import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const termsSections = [
  {
    title: "Use of this website",
    body: [
      "By accessing or using this website, you agree to use it only for lawful purposes and in a manner that does not damage, disable, overload or interfere with the website or other users.",
      "You must not attempt to copy, scrape, misuse, reverse engineer or disrupt any part of the website, enquiry forms, content, listings or technical systems.",
    ],
  },
  {
    title: "Property information",
    body: [
      "Project details, prices, sizes, payment plans, amenities, specifications, offers, possession timelines, availability and images displayed on this website are provided for general information and enquiry purposes only.",
      "Real estate information may change without notice. You should verify all details directly from the developer, official brochures, RERA records, allotment documents, builder-buyer agreements and other official sources before making any decision.",
    ],
  },
  {
    title: "Advisory and enquiries",
    body: [
      "Gratia Estates provides real estate advisory, project shortlisting assistance, enquiry coordination and site visit support for residential property opportunities in Gurgaon.",
      "Submitting an enquiry does not create a binding transaction, brokerage agreement, allotment, booking or guaranteed availability of any property.",
    ],
  },
  {
    title: "No financial, legal or investment guarantee",
    body: [
      "Content on this website should not be treated as legal, tax, financial, construction or investment advice. Any buying decision should be made after independent due diligence and consultation with appropriate professionals.",
      "Past market trends, projected appreciation, rental estimates or investment opinions, if shared, are indicative and do not guarantee future returns or outcomes.",
    ],
  },
  {
    title: "Third-party developers and services",
    body: [
      "Projects shown on this website may be developed, owned or marketed by third-party developers or entities. Gratia Estates is not responsible for delays, changes, cancellations, construction quality, approvals, representations or commitments made by third parties.",
      "Links to third-party websites, map services, social media platforms or messaging tools are provided for convenience. Their terms, policies and practices are separate from ours.",
    ],
  },
  {
    title: "User information and communication",
    body: [
      "When you submit your contact details, you confirm that the information is accurate and that Gratia Estates may contact you by phone, email, SMS, WhatsApp or similar channels regarding your property enquiry.",
      "Use of personal information is governed by our Privacy Policy.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The website design, text, layout, branding, graphics and other original content belong to Gratia Estates or are used with permission, unless otherwise stated.",
      "You may not reproduce, republish, distribute, modify or commercially use website content without prior written permission.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "While we aim to keep information useful and updated, we do not warrant that the website will always be error-free, uninterrupted or complete.",
      "To the maximum extent permitted by law, Gratia Estates shall not be liable for loss, damage, cost or claim arising from reliance on website content, third-party information, technical interruptions or property decisions made by users.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these Terms & Conditions from time to time. Continued use of the website after updates means you accept the revised terms.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these Terms & Conditions, contact Gratia Estates at purwarmanish@gmail.com or +91 9109776155.",
    ],
  },
];

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions | Gratia Estates"
        description="Terms and Conditions governing use of the Gratia Estates website."
        path="/terms-conditions"
      />
      <LegalHero title="Terms & Conditions" crumb="Terms & Conditions" />
      <section className="bg-ivory py-16 sm:py-20">
        <div className="container-luxury max-w-4xl">
          <div className="rounded-2xl border border-charcoal/10 bg-white p-7 shadow-luxury sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-gold">
              Last updated: October 7, 2026
            </p>
            <p className="mt-5 text-sm leading-8 text-charcoal/65">
              These Terms & Conditions govern your access to and use of the
              Gratia Estates website. Please read them carefully before using
              the website or submitting a property enquiry.
            </p>

            <div className="mt-10 space-y-9">
              {termsSections.map((section) => (
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
              These terms are intended as general website terms and should not
              be treated as legal advice. Please consult a qualified legal
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
