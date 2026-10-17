import { Mail, MapPin, Phone } from "lucide-react";
import FooterSection from "./FooterSection";
import { footerAddress, footerContactLinks } from "./footerData";

const contactIcons = {
  email: Mail,
  phone: Phone,
};

export default function FooterContact() {
  return (
    <FooterSection id="footer-contact-title" title="Get in touch">
      <ul className="mt-5 space-y-4">
        {footerContactLinks.map(({ label, href, type }) => {
          const Icon = contactIcons[type];

          return (
            <li key={href}>
              <a
                href={href}
                className="group inline-flex max-w-full items-center gap-3 text-sm leading-6 text-white/75 transition hover:text-gold-light focus-visible:text-gold-light"
              >
                <Icon
                  size={17}
                  className="shrink-0 text-gold transition group-hover:text-gold-light"
                  aria-hidden="true"
                />
                <span className="break-words">{label}</span>
              </a>
            </li>
          );
        })}

        <li className="flex items-start gap-3 text-sm leading-6 text-white/75">
          <MapPin size={17} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
          <span>
            {footerAddress.lineOne}
            <br />
            {footerAddress.lineTwo}
          </span>
        </li>
      </ul>
    </FooterSection>
  );
}
