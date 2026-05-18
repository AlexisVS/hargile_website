"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {motion, useAnimation, useInView} from "motion/react";
import {ArrowRight} from "lucide-react";
import {
    ContentWrapper,
    InsightsGrid,
    SectionContainer,
    SectionHeader,
    SectionSubHeader,
    SectionSubtitle,
    SectionTitle,
    ViewAllLink
} from "./latest-insights.styled";
import InsightCard from "./insight-card";

const LatestInsights = () => {
    const t = useTranslations("pages.homepage.sections.latest-insights");
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {once: false, amount: 0.2});
    const controls = useAnimation();
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    // Track scroll position and window dimensions for parallax effect
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        // Set initial values
        handleResize();
        handleScroll();

        window.addEventListener("scroll", handleScroll, {passive: true});
        window.addEventListener("resize", handleResize, {passive: true});

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [isInView, controls]);

    const sectionVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2
            }
        }
    };

    const headerVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.6, ease: "easeOut", delayTime: 1.6}
        }
    };

    // Generate unique parallax styles for each card
    const getCardParallaxStyle = (index) => {
        if (!sectionRef.current || scrollY === 0) return {};

        // Calculate section's position relative to viewport
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionHeight = rect.height;

        // Calculate how far the user has scrolled within the section
        const scrollProgress = (scrollY - sectionTop + windowHeight) / (sectionHeight + windowHeight);

        // Apply different parallax factors based on card index
        // This creates a staggered effect where each card moves at a different speed
        const parallaxFactors = [0.16, 0.2]; // Different speeds for each card
        const parallaxFactor = parallaxFactors[index % parallaxFactors.length];

        // Calculate parallax offset with a different direction based on index
        // Even cards move up, odd cards move down
        const direction = index % 2 === 0 ? -1 : 1;
        const parallaxOffset = scrollProgress * windowHeight * parallaxFactor * direction;

        return {
            transform: `translateY(${parallaxOffset}px)`,
            transition: "transform 0.1s ease-out" // Smooth transition for any changes
        };
    };

    const insights = [
        {
            id: "b2b-websites",
            category: "WEB & DIGITAL DESIGN",
            title: "How the Next Gen of B2B Websites are Accelerating Business Growth",
            image: "/images/pages/homepage/crayons.jpg",
            link: "/insights/b2b-websites"
        },
        {
            id: "ai-customer-experience",
            category: "ARTIFICIAL INTELLIGENCE",
            title: "How AI is Transforming Customer Experience in 2025",
            image: "/images/pages/homepage/crayons.jpg",
            link: "/insights/ai-customer-experience"
        },
    ];

    return (
        <SectionContainer ref={sectionRef}>
            <ContentWrapper
                initial="hidden"
                animate={controls}
                variants={sectionVariants}
            >
                <SectionHeader variants={headerVariants}>
                    <SectionSubHeader>
                        <SectionTitle>{t("title") || "Latest insights"}</SectionTitle>
                        <SectionSubtitle>
                            {t("subtitle") || "Our thoughts and perspectives on the digital world"}
                        </SectionSubtitle>
                    </SectionSubHeader>
                </SectionHeader>

                <InsightsGrid>
                    {insights.map((insight, index) => (
                        <div
                            key={insight.id}
                            style={getCardParallaxStyle(index)}
                            className="parallax-card-container"
                        >
                            <InsightCard
                                insight={insight}
                                index={index}
                                isInView={isInView}
                            />
                        </div>
                    ))}
                </InsightsGrid>

                <ViewAllLink as={motion.a} variants={headerVariants} href="/insights">
                    {t("view-all") || "View all insights"} <ArrowRight width={20} height={20} size={20}/>
                </ViewAllLink>
            </ContentWrapper>
        </SectionContainer>
    );
};

export default LatestInsights;
