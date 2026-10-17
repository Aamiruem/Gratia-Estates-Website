import { Link } from "react-router-dom";

export default function FooterLinkList({ links }) {
  return (
    <ul className="mt-5 space-y-3">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className="inline-flex items-center gap-2 text-sm text-white/75 transition duration-200 hover:translate-x-1 hover:text-gold-light focus-visible:text-gold-light"
          >
            <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
