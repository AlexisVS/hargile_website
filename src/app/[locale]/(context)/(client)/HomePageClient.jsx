import HeroV2 from "@/components/pages/homepage/v2/hero/hero";
import MvpPromoV2 from "@/components/pages/homepage/v2/mvp-promo/mvp-promo";
import DesignDevV2 from "@/components/pages/homepage/v2/design-dev/design-dev";
import RecentWorksShowcaseV2 from "@/components/pages/homepage/v2/recent-works-showcase/recent-works-showcase";
import ValuesV2 from "@/components/pages/homepage/v2/values/values";

export default function HomePageClient() {
    return (
        <div className="homepage-container page-exit">
            {/* Two hero backdrops stacked for comparison — keep one, drop the other. */}
            <HeroV2 backdrop="bends" label="1 — Color Bends"/>
            <HeroV2 backdrop="cubes" label="2 — Cubes"/>
            <MvpPromoV2/>
            <DesignDevV2/>
            <RecentWorksShowcaseV2/>
            <ValuesV2/>
        </div>
    );
}
