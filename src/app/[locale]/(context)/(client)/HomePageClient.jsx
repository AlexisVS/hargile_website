import HeroV2 from "@/components/pages/homepage/v2/hero/hero";
import MvpPromoV2 from "@/components/pages/homepage/v2/mvp-promo/mvp-promo";
import DesignDevV2 from "@/components/pages/homepage/v2/design-dev/design-dev";
import RecentWorksShowcaseV2 from "@/components/pages/homepage/v2/recent-works-showcase/recent-works-showcase";
import ValuesV2 from "@/components/pages/homepage/v2/values/values";

/* `backdrop` forces the hero's backdrop variant for a page that wants a specific
   one — the wave preview route. Left undefined (the real homepage) the hero
   resolves it responsively itself. Nothing below the hero varies with it, which
   is why the preview is a prop on this component rather than a second copy of
   the page. */
export default function HomePageClient({backdrop}) {
    return (
        <div className="homepage-container page-exit">
            {/* Backdrop resolves responsively inside the hero: cubes on desktop,
                color bends below 1024px. Force one with ?backdrop=<key>. */}
            <HeroV2 backdrop={backdrop}/>
            <MvpPromoV2/>
            <DesignDevV2/>
            <RecentWorksShowcaseV2/>
            <ValuesV2/>
        </div>
    );
}
