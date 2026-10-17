import { Link } from "react-router-dom";
import { footerLegalLinks } from "./footerData";

export default function FooterBottom() {
  return (
    <div className="flex flex-col items-center gap-4 pt-7 text-center text-sm text-white/60 sm:flex-row sm:justify-between sm:text-left">
      <p className="m-0">
        &copy; {new Date().getFullYear()} Gratia Estates. All rights reserved.
      </p>

      <nav
        aria-label="Legal"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end"
      >
        {footerLegalLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="transition hover:text-gold-light focus-visible:text-gold-light"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
