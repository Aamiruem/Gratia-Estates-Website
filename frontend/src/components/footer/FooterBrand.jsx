import { Link } from "react-router-dom";

export default function FooterBrand() {
  return (
    <div className="md:col-span-2 lg:col-span-6">
      <Link to="/" aria-label="Gratia Estates home" className="inline-flex w-fit">
        <img
          src="/assets/white-logo.png"
          alt="Gratia Estates"
          className="h-auto w-[150px] object-contain sm:w-[170px]"
        />
      </Link>

      <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
        Gratia Estates is a Gurgaon-focused real estate advisory. We help buyers
        navigate new launches, pre-launch opportunities, launched developments
        and ready-to-move residences with practical project comparisons and a
        clear buying journey.
      </p>
    </div>
  );
}
