import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  Building2,
  CalendarCheck,
  ChevronRight,
  Clapperboard,
  House,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  UsersRound,
  X,
} from "lucide-react";
import Logo from "./Logo";

// Each item has its own icon colour so the menu is easy to scan.
const nav = [
  { label: "Home", to: "/", icon: House, tone: "bg-amber-100 text-amber-700" },
  { label: "About Us", to: "/about", icon: UsersRound, tone: "bg-sky-100 text-sky-700" },
  { label: "Projects", to: "/projects", icon: Building2, tone: "bg-emerald-100 text-emerald-700" },
  { label: "Videos", to: "/videos", icon: Clapperboard, tone: "bg-rose-100 text-rose-700" },
  { label: "Blog", to: "/blog", icon: BookOpen, tone: "bg-violet-100 text-violet-700" },
  { label: "Contact Us", to: "/contact", icon: Phone, tone: "bg-orange-100 text-orange-700" },
];

const PHONE = "+91 91097 76155";
const TEL = "tel:+919109776155";
const WHATSAPP =
  "https://wa.me/919109776155?text=" +
  encodeURIComponent("Hello Gratia Estates, I'd like help with a Gurgaon property.");

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Utility bar (scrolls away; only the main bar below stays sticky) */}
      <div className="hidden bg-[#0d1b2a] text-white/80 md:block">
        <div className="container-luxury flex h-10 items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-6">
            <a href={TEL} className="inline-flex items-center gap-2 transition hover:text-[#e1c98f]">
              <Phone size={13} className="text-[#c9a45c]" aria-hidden="true" /> {PHONE}
            </a>
            <a
              href="mailto:purwarmanish@gmail.com"
              className="inline-flex items-center gap-2 transition hover:text-[#e1c98f]"
            >
              <Mail size={13} className="text-[#c9a45c]" aria-hidden="true" /> purwarmanish@gmail.com
            </a>
            <span className="hidden items-center gap-2 lg:inline-flex">
              <MapPin size={13} className="text-[#c9a45c]" aria-hidden="true" /> 90 IDC, Gurgaon
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden font-semibold tracking-wide text-[#e1c98f] lg:inline">
              Premium Real Estate Advisory · Gurgaon &amp; Delhi-NCR
            </span>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              <MessageCircle size={13} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full">
      {/* Main bar */}
      <div
        className={`border-b bg-white/95 backdrop-blur-xl transition-shadow ${scrolled ? "border-[#e7e2d8] shadow-[0_8px_30px_rgba(20,37,54,0.10)]" : "border-transparent"}`}
      >
        <div className="container-luxury flex h-[76px] items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Gratia Estates home">
            <Logo className="h-[50px] text-[18px] transition-transform duration-200 hover:scale-[1.02] sm:text-[20px]" />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-[#eee9df] bg-[#fbfaf7] p-1.5 xl:flex" aria-label="Primary navigation">
            {nav.map(({ label, to, icon: Icon, tone }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `group inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-[13px] font-semibold transition ${isActive ? "bg-[#142536] text-white shadow-md" : "text-[#263746] hover:bg-white hover:shadow-sm"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid size-7 place-items-center rounded-full transition ${isActive ? "bg-[#c9a45c] text-[#142536]" : tone}`}
                    >
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={TEL}
              className="hidden items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 transition hover:bg-[#f7f4ed] 2xl:inline-flex"
            >
              <span className="relative grid size-10 place-items-center rounded-full bg-[#142536] text-[#e1c98f]">
                <Phone size={17} className="call-buzz" aria-hidden="true" />
                <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-[#80602b]">
                  Call an advisor
                </span>
                <span className="text-sm font-bold text-[#142536]">{PHONE}</span>
              </span>
            </a>
            <Link
              to="/contact"
              className="hidden items-center gap-2 rounded-full bg-[#c9a45c] px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-[#142536] shadow-[0_6px_18px_rgba(201,164,92,.4)] transition hover:-translate-y-0.5 hover:bg-[#e1c98f] sm:inline-flex"
            >
              <CalendarCheck size={16} aria-hidden="true" /> Book a visit
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              className="grid size-11 place-items-center rounded-full border border-[#e7e2d8] bg-[#f8f6f1] text-[#142536] transition hover:border-[#c9a45c] hover:text-[#9a7940] xl:hidden"
            >
              {open ? <X size={21} strokeWidth={1.8} /> : <Menu size={21} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-b border-[#e7e2d8] bg-white transition-all duration-300 xl:hidden ${open ? "max-h-[720px] opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}
      >
        <nav className="container-luxury py-4" aria-label="Mobile navigation">
          <ul className="grid gap-2 sm:grid-cols-2">
            {nav.map(({ label, to, icon: Icon, tone }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl border p-2.5 text-sm font-semibold transition ${isActive ? "border-[#142536] bg-[#142536] text-white" : "border-[#eee9df] bg-[#fbfaf7] text-[#142536] hover:border-[#c9a45c]"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`grid size-10 place-items-center rounded-xl ${isActive ? "bg-[#c9a45c] text-[#142536]" : tone}`}
                      >
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="flex-1">{label}</span>
                      <ChevronRight size={16} className={isActive ? "text-[#e1c98f]" : "text-[#9ba1a6]"} aria-hidden="true" />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={TEL}
              className="flex items-center justify-center gap-2 rounded-full bg-[#142536] px-4 py-3 text-sm font-semibold text-white"
            >
              <Phone size={16} className="text-[#e1c98f]" aria-hidden="true" /> Call now
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
            <Link
              to="/contact"
              className="col-span-2 flex items-center justify-center gap-2 rounded-full bg-[#c9a45c] px-4 py-3 text-sm font-bold text-[#142536]"
            >
              <CalendarCheck size={16} aria-hidden="true" /> Book a site visit
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-[#7a828c]">
            Premium Real Estate Advisory · Gurgaon &amp; Delhi-NCR
          </p>
        </nav>
      </div>
      </header>
    </>
  );
}
