import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  House,
  Building2,
  BookOpen,
  ContactRound,
  Clapperboard,
} from "lucide-react";

const nav = [
  { label: "Home", to: "/", icon: House },
  { label: "About Us", to: "/about", icon: ContactRound },
  { label: "Projects", to: "/projects", icon: Building2 },
  { label: "Videos", to: "/videos", icon: Clapperboard },
  { label: "Blog", to: "/blog", icon: BookOpen },
  { label: "Contact Us", to: "/contact", icon: Phone },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7e2d8] bg-[#fbfaf7]/95 shadow-[0_4px_20px_rgba(20,37,54,0.06)] backdrop-blur-xl">
      {/* Main Header */}
      <div className="container-luxury flex h-[76px] items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center"
          aria-label="Gratia Estates Home"
        >
          <Logo className="h-[50px] text-[18px] transition-transform duration-200 hover:scale-[1.02] sm:text-[20px]" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-3 xl:flex 2xl:gap-4"
          aria-label="Primary navigation"
        >
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                group relative py-2
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.11em]
                transition-colors
                duration-200
                ${
                  isActive
                    ? "text-[#a57e3c]"
                    : "text-[#263746] hover:text-[#a57e3c]"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}

                  {/* Active underline */}
                  <span
                    className={`
                      absolute
                      bottom-0
                      left-0
                      h-[2px]
                      rounded-full
                      bg-[#c9a45c]
                      transition-all
                      duration-300
                      ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </>
              )}
            </NavLink>
          ))}

          {/* Phone CTA */}
          <a
            href="tel:+919109776155"
            className="
              group
              flex
              items-center
              gap-2
              rounded-full
              bg-[#c8a972]
              px-4
              py-3
              text-[11px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-black
              shadow-[0_4px_14px_rgba(200,169,114,0.32)]
              transition
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#c8a972]
              hover:shadow-[0_7px_20px_rgba(200,169,114,0.48)]
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#c8a972]
            "
          >
            <Phone
              size={16}
              strokeWidth={2}
              className="call-buzz"
            />

            <span>+91 9109776155</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-[#e7e2d8]
            bg-[#f8f6f1]
            text-[#142536]
            transition-all
            duration-300
            hover:border-[#c9a45c]
            hover:text-[#b38c48]
            xl:hidden
          "
        >
          {open ? (
            <X size={21} strokeWidth={1.8} />
          ) : (
            <Menu size={21} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`
          overflow-hidden
          border-t
          border-[#e7e2d8]
          bg-white
          transition-all
          duration-300
          xl:hidden
          ${open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <nav className="container-luxury py-3" aria-label="Mobile navigation">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                border-b
                border-[#eee9df]
                py-3.5
                text-sm
                font-semibold
                uppercase
                tracking-[0.12em]
                transition-all duration-200
                ${
                  isActive
                    ? "pl-3 text-[#a57e3c]"
                    : "text-[#263746] hover:pl-3 hover:text-[#a57e3c]"
                }
                `
              }
            >
              <item.icon
                size={17}
                className="shrink-0 text-[#c9a45c]"
                aria-hidden="true"
              />
              <span className="flex-1">{item.label}</span>
              <ChevronDown
                size={15}
                className="-rotate-90 text-[#9ba1a6]"
                aria-hidden="true"
              />
            </NavLink>
          ))}

          {/* Mobile Call Area */}
          <div className="mt-4">
            {/* Call */}
            <a
              href="tel:+919109776155"
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#c8a972]
                px-4
                py-3
                text-sm
                font-semibold
                text-black
                shadow-[0_4px_14px_rgba(200,169,114,0.32)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c8a972] hover:shadow-[0_7px_20px_rgba(200,169,114,0.48)]
              "
            >
              <Phone
                size={17}
                className="call-buzz"
              />
              Call Now
            </a>
          </div>

          {/* Location / Trust Line */}
          <div className="mt-5 border-t border-[#eee9df] pt-4 text-center">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b38c48]">
              Premium Real Estate Advisory
            </p>

            <p className="text-xs text-[#7a828c]">
              Gurgaon &nbsp;|&nbsp; Delhi-NCR
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
