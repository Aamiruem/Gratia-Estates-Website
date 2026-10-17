import FooterLinkList from "./FooterLinkList";
import FooterSection from "./FooterSection";
import { footerExploreLinks } from "./footerData";

export default function FooterExplore() {
  return (
    <FooterSection as="nav" id="footer-explore-title" title="Explore">
      <FooterLinkList links={footerExploreLinks} />
    </FooterSection>
  );
}
