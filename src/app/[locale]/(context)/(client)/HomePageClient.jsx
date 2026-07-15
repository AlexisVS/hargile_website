"use client";

import HeroSection from "@/components/pages/homepage/hero/heroSection";
import MvpPromo from "@/components/pages/homepage/mvp-promo/mvp-promo";
import OurSolutions from "@/components/pages/homepage/our-solutions/our-solutions";
import AboutUs from "@/components/pages/homepage/about-us/about-us";
import RecentWorks from "@/components/pages/homepage/recent-works/recent-works";

export default function HomePageClient() {
    return (
        <div className="homepage-container page-exit">
            <HeroSection/>
            <MvpPromo/>
            <OurSolutions/>
            <RecentWorks/>
            <AboutUs/>
        </div>
    );
}
