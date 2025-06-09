"use client";

import HeroSection from "@/components/pages/homepage/hero/heroSection";
import OurSolutions from "@/components/pages/homepage/our-solutions/our-solutions";
import OurServices from "@/components/pages/homepage/services/ourServices";
import AboutUs from "@/components/pages/homepage/about-us/about-us";
import DigitalAuditSection from "@/components/pages/homepage/digital-audit/digital-audit";
import ContactForm from "@/components/form/contact-form";
import RecentWorks from "@/components/pages/homepage/recent-works/recent-works";
import {use} from "react";

export default function HomePageClient() {
    return (
        <div className="homepage-container page-exit">
            <HeroSection/>
            <OurSolutions/>
            {/*<TrustedBrands/>*/}
            <RecentWorks/>
            <OurServices/>
            <AboutUs/>
            {/*<LatestInsights/>*/}
            <DigitalAuditSection/>
            <ContactForm/>
        </div>
    );
}
