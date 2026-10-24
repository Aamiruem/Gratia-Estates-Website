// Crisp vector version of the Gratia Estates mark: a bold "G" arc holding
// rising gold bars, with an "E" beside it, plus a heavy wordmark.
// `variant="light"` is for dark backgrounds (footer, dark panels).
export default function Logo({ variant = "dark", className = "", tagline = true }) {
  const ink = variant === "light" ? "#FFFFFF" : "#142536";
  const sub = variant === "light" ? "rgba(255,255,255,.7)" : "#5E6872";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="h-full w-auto shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`gold-${variant}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#A57E3C" />
            <stop offset="1" stopColor="#E4C98E" />
          </linearGradient>
        </defs>
        {/* G arc */}
        <path
          d="M44 13.5A23 23 0 1 0 44 50.5"
          fill="none"
          stroke={ink}
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Rising bars */}
        <rect x="18" y="38" width="5" height="12" rx="1" fill={`url(#gold-${variant})`} />
        <rect x="25" y="31" width="5" height="19" rx="1" fill={`url(#gold-${variant})`} />
        <rect x="32" y="24" width="5" height="26" rx="1" fill={`url(#gold-${variant})`} />
        {/* E */}
        <path
          d="M42 24h14M42 37h11M42 50h14M42 24v26"
          fill="none"
          stroke={`url(#gold-${variant})`}
          strokeWidth="4.5"
          strokeLinecap="square"
        />
      </svg>
      <span className="flex flex-col justify-center leading-none">
        <span
          className="font-display text-[1.45em] font-extrabold tracking-[0.14em]"
          style={{ color: ink }}
        >
          GRATIA
        </span>
        <span className="mt-[0.3em] flex items-center gap-1.5 text-[0.62em] font-bold tracking-[0.42em] text-[#B8913F]">
          <span className="h-px w-3 bg-[#C8A972]" aria-hidden="true" />
          ESTATES
        </span>
        {tagline && (
          <span
            className="mt-[0.45em] hidden text-[0.42em] font-semibold tracking-[0.22em] sm:block"
            style={{ color: sub }}
          >
            PREMIUM REAL ESTATE ADVISORY
          </span>
        )}
      </span>
    </span>
  );
}
