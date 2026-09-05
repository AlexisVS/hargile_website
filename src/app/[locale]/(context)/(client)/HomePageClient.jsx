import HeroV2 from "@/components/pages/homepage/v2/hero/hero";
import DesignDevV2 from "@/components/pages/homepage/v2/design-dev/design-dev";
import ValuesV2 from "@/components/pages/homepage/v2/values/values";
import Verticals from "@/components/pages/homepage/v2/verticals/verticals";
import AuditCta from "@/components/pages/homepage/v2/audit-cta/audit-cta";

/* HARG-302: homepage rebuilt around the GEO/SEO pivot.
   Hero → Problem (scroll-scrub manifesto) → How it works (terminal)
   → Who it's for (verticals grid) → Audit CTA.
   Portfolio showcase removed — the site no longer sells web dev work. */
export default function HomePageClient() {
    return (
        <div className="homepage-container page-exit">
            <HeroV2/>
            <DesignDevV2/>
            <ValuesV2/>
            <Verticals/>
            <AuditCta/>
        </div>
    );
}
