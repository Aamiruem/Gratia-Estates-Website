import { ArrowRight, BookOpen, Building2, Clapperboard, House, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const links = [
  { to: "/", icon: House, title: "Home", text: "Start from our home page" },
  { to: "/projects", icon: Building2, title: "Projects", text: "Browse Gurgaon projects" },
  { to: "/videos", icon: Clapperboard, title: "Videos", text: "Watch project walkthroughs" },
  { to: "/blog", icon: BookOpen, title: "Blog", text: "Read buying guides" },
];

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page not found | Gratia Estates"
        description="The page you requested could not be found."
        path="/404"
      />
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#fbf8f2] via-[#f6efe2] to-[#efe4cf] py-16 sm:py-24">
        <div
          className="pointer-events-none absolute -right-24 top-0 -z-10 size-96 rounded-full bg-[#c9a45c]/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-luxury text-center">
          <p className="font-display text-7xl font-bold text-[#c9a45c] sm:text-8xl">404</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-[#142536] sm:text-5xl">
            This address doesn't exist
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#5e6872]">
            The page may have moved or the link may be mistyped. These pages can
            help you find what you were looking for.
          </p>
          <ul className="mx-auto mt-10 grid max-w-5xl gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {links.map(({ to, icon: Icon, title, text }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex h-full flex-col rounded-2xl border border-[#e7e2d8] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#c9a45c] hover:shadow-md"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-[#142536] text-[#e1c98f]">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="mt-4 font-semibold text-[#142536]">{title}</span>
                  <span className="mt-1 text-sm text-[#68717a]">{text}</span>
                  <ArrowRight
                    size={16}
                    className="mt-3 text-[#c9a45c] transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="tel:+919109776155"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#142536] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c9a45c] hover:text-[#142536]"
          >
            <Phone size={16} aria-hidden="true" /> Or call us on +91 91097 76155
          </a>
        </div>
      </section>
    </>
  );
}
