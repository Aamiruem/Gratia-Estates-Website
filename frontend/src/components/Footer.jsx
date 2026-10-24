import FooterBottom from "./footer/FooterBottom";
import FooterBrand from "./footer/FooterBrand";
import FooterContact from "./footer/FooterContact";
import FooterExplore from "./footer/FooterExplore";

export default function Footer() {
  return (
    <footer className="footer w-full bg-[#142536] text-white">
      <div className="container-luxury py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 pb-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:pb-12">
          <FooterBrand />
          <FooterExplore />
          <FooterContact />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
