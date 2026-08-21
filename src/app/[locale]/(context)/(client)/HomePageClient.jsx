import HeroV2 from "@/components/pages/homepage/v2/hero/hero";
import DesignDevV2 from "@/components/pages/homepage/v2/design-dev/design-dev";
import RecentWorksShowcaseV2 from "@/components/pages/homepage/v2/recent-works-showcase/recent-works-showcase";
import ValuesV2 from "@/components/pages/homepage/v2/values/values";

/* This used to take a `backdrop` prop so /preview/home-wave could force the wave
   grid while `/` still resolved cubes-or-bends by viewport. The wave grid won
   that comparison and is now the hero's only backdrop, so the preview route was
   a noindex duplicate of this page and both it and the prop are gone. */
export default function HomePageClient() {
    return (
        <div className="homepage-container page-exit">
            <HeroV2/>
            <DesignDevV2/>
            {/* Values before the work, not after: the manifesto above states how
                we work, the values say what that rests on, and the portfolio is
                then the evidence for both. It also lands the page on the pinned
                rail — the one section that ends on a full-viewport frame, which
                is a better last impression than a list of principles. */}
            <ValuesV2/>
            <RecentWorksShowcaseV2/>
        </div>
    );
}
