// Gratia Estates logo: a navy badge with a gold house roof over a bold "G"
// (instantly readable as "G for Gratia, real estate"), plus a clear wordmark.
// `variant="light"` is for dark backgrounds (footer, dark panels).
export default function Logo({ variant = "dark", className = "", tagline = false }) {
  const light = variant === "light";
  const ink = light ? "#FFFFFF" : "#142536";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="h-full w-auto shrink-0 drop-shadow-sm"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`logo-gold-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E9D29B" />
            <stop offset="1" stopColor="#B8913F" />
          </linearGradient>
        </defs>
        {/* Badge */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="14"
          fill={light ? "#FFFFFF" : "#142536"}
        />
        {/* House roof */}
        <path
          d="M16 25 32 12l16 13"
          fill="none"
          stroke={`url(#logo-gold-${variant})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bold G */}
        <text
          x="32"
          y="55"
          textAnchor="middle"
          fontFamily="Poppins, Montserrat, sans-serif"
          fontWeight="800"
          fontSize="36"
          fill={light ? "#142536" : "#FFFFFF"}
        >
          G
        </text>
      </svg>
      <span className="flex flex-col justify-center leading-none">
        <span
          className="font-display text-[1.5em] font-extrabold tracking-[0.08em]"
          style={{ color: ink }}
        >
          GRATIA
        </span>
        <span className="mt-[0.25em] font-display text-[0.86em] font-bold tracking-[0.34em] text-[#B8913F]">
          ESTATES
        </span>
        {tagline && (
          <span
            className="mt-[0.5em] text-[0.5em] font-semibold tracking-[0.16em]"
            style={{ color: light ? "rgba(255,255,255,.75)" : "#5E6872" }}
          >
            PREMIUM REAL ESTATE ADVISORY
          </span>
        )}
      </span>
    </span>
  );
}
