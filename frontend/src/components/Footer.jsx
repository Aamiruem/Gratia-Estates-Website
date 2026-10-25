import { ArrowUpRight, Lock, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import CallIcon from "./CallIcon";
import Logo from "./Logo";
import { footerLegalLinks } from "./footer/footerData";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Property Videos", to: "/videos" },
  { label: "Property Insights", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

const stages = ["Ready to Move", "Launched", "Under Development", "Pre-Launch / New Launch"].map(
  (status) => ({ status, count: projects.filter((p) => p.status === status).length }),
);

const contacts = [
  { icon: CallIcon, label: "Call us", value: "+91 91097 76155", href: "tel:+919109776155", tone: "bg-[#34C759] text-white" },
  { icon: Mail, label: "Email", value: "purwarmanish@gmail.com", href: "mailto:purwarmanish@gmail.com", tone: "bg-sky-500/15 text-sky-300" },
  { icon: MapPin, label: "Office", value: "Iworkk Coworking, 90 IDC, Gurgaon", tone: "bg-[#c9a45c]/15 text-[#e1c98f]" },
];


function ColumnTitle({ children }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-[.18em] !text-[#e1c98f]">{children}</h2>
  );
}

const linkClass =
  "group inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f1f2e] text-white">
      <div className="container-luxury pt-10">
        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 pb-10 lg:grid-cols-[1.35fr_.8fr_1fr_1.25fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" aria-label="Gratia Estates home" className="inline-flex">
              <Logo variant="light" tagline className="h-14 text-[19px]" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
              A Gurgaon-focused real estate advisory helping buyers compare
              new-launch, under-construction and ready-to-move homes with one
              advisor from shortlist to site visit.
            </p>
          </div>

          <nav aria-label="Footer">
            <ColumnTitle>Quick links</ColumnTitle>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className={linkClass}>
                    {label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnTitle>Projects</ColumnTitle>
            <ul className="mt-4 space-y-2.5">
              {stages.map(({ status, count }) => (
                <li key={status}>
                  <Link to={`/projects?stage=${encodeURIComponent(status)}`} className={linkClass}>
                    {status}
                    <span className="rounded-full bg-white/10 px-1.5 text-[11px] text-[#e1c98f]">
                      {count}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e1c98f] transition hover:text-white"
                >
                  All {projects.length} projects <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <ColumnTitle>Get in touch</ColumnTitle>
            <ul className="mt-4 space-y-3">
              {contacts.map(({ icon: Icon, label, value, href, tone }) => {
                const body = (
                  <>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone}`}>
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[.12em] text-white/45">
                        {label}
                      </span>
                      <span className="block break-words text-sm text-white/85">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="flex items-center gap-3 transition hover:opacity-80">
                        {body}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar; right padding keeps it clear of the floating buttons */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:gap-6 sm:pr-24">
          <p className="inline-flex items-center gap-2">
            &copy; {new Date().getFullYear()} Gratia Estates. All rights reserved.
            {/* Discreet owner entry: a faint lock that opens the private sign-in page. */}
            <Link
              to="/video-admin/login"
              aria-label="Owner sign-in"
              title="Owner sign-in"
              rel="nofollow"
              className="grid size-6 place-items-center rounded-full text-white/20 transition hover:bg-white/10 hover:text-[#e1c98f]"
            >
              <Lock size={12} aria-hidden="true" />
            </Link>
          </p>
          <nav aria-label="Legal" className="flex gap-5">
            {footerLegalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="sm:ml-auto">Gurgaon &amp; Delhi-NCR</p>
        </div>
      </div>
    </footer>
  );
}
