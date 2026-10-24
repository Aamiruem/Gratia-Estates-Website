import LegalPage from "../components/LegalPage";
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
      <LegalPage
        title="Terms & Conditions"
        intro="These terms govern your access to and use of the Gratia Estates website. Please read them carefully before using the website or submitting a property enquiry."
        updated="October 7, 2026"
        sections={termsSections}
        disclaimer="These terms are intended as general website terms and should not be treated as legal advice. Please consult a qualified legal professional for formal compliance review."
      />
    </>
  );
}
