import HeroV2 from "@/components/pages/homepage/v2/hero/hero";
import MvpPromoV2 from "@/components/pages/homepage/v2/mvp-promo/mvp-promo";
import DesignDevV2 from "@/components/pages/homepage/v2/design-dev/design-dev";
import RecentWorksShowcaseV2 from "@/components/pages/homepage/v2/recent-works-showcase/recent-works-showcase";
import ValuesV2 from "@/components/pages/homepage/v2/values/values";

export default function HomePageClient() {
    return (
        <div className="homepage-container page-exit">
            <HeroV2/>
            <MvpPromoV2/>
            <DesignDevV2/>
            <RecentWorksShowcaseV2/>
            <ValuesV2/>
        </div>
    );
}
