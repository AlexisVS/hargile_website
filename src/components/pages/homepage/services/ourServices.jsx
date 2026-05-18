import React from "react";
import {useTranslations} from "next-intl";
import {motion} from "motion/react";
import ServiceSection from "./ServiceSection";
import SectionHeader from "./SectionHeader";
import DiscoverButton from "./DiscoverButton";
import {getServiceIcons} from "./serviceIcons";
import {useResponsive} from "./useResponsive";
import {POSITIONS} from "./constants";

/**
 * Main component to display all services with animations
 */
const OurServices = () => {
    const t = useTranslations("pages.homepage.sections.services");
    const {isMobile, isTablet} = useResponsive();

    // Helper function to get translated items
    const getTranslatedItems = (section) =>
        Object.keys(t.raw(`${section}.items`)).map((key) =>
            t(`${section}.items.${key}`)
        );

    // Get section data
    const getServiceData = () => {
        const data = {
            [POSITIONS.TOP_LEFT]: {
                title: t("dev.title"),
                items: getTranslatedItems("dev"),
            },
            [POSITIONS.BOTTOM_LEFT]: {
                title: t("maintenance.title"),
                items: getTranslatedItems("maintenance"),
            },
            [POSITIONS.TOP_RIGHT]: {
                title: t("ai.title"),
                items: getTranslatedItems("ai"),
            },
            [POSITIONS.BOTTOM_RIGHT]: {
                title: t("analysis.title"),
                items: getTranslatedItems("analysis"),
            },
        };

        // Get icons
        const icons = getServiceIcons(isMobile);

        // Create services with icons
        return Object.keys(data).reduce((acc, key) => {
            acc[key] = {
                ...data[key],
                icon: icons[key],
                position: key,
            };
            return acc;
        }, {});
    };

    const services = getServiceData();

    // Animation variants for the container
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                delayChildren: 0.2,
                staggerChildren: 0.1,
            },
        },
    };

    // Animation variants for the grid items (desktop)
    const gridItemVariants = {
        hidden: {opacity: 0, scale: 0.9},
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    // Render mobile layout
    if (isMobile) {
        return renderMobileLayout(services, t, containerVariants);
    }

    // Render desktop/tablet layout
    return renderDesktopLayout(
        services,
        t,
        isTablet,
        containerVariants,
        gridItemVariants,
    );
};

/**
 * Renders the mobile layout with animations and glassmorphism effect
 */
const renderMobileLayout = (services, t, containerVariants, handleDiscoverClick) => (
    <section className="relative w-full py-8 px-4">
        <SectionHeader title={t("title")} subtitle={t("subtitle")}/>

        <motion.div
            className="container mx-auto px-4 relative"
            style={{margin: "0 auto"}}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.2}}
        >
            <motion.div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    margin: 0,
                    padding: "0 1.25rem",
                }}
            >
                {Object.keys(services).map((key) => (
                    <motion.div
                        key={key}
                        style={{
                            margin: "1rem 0",
                            padding: "1.5rem",
                            background: "rgba(17, 12, 41, 0.6)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            borderRadius: "16px",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                        whileInView={{opacity: 1, y: 0}}
                        initial={{opacity: 0, y: 50}}
                        transition={{duration: 0.5}}
                        viewport={{once: true, amount: 0.3}}
                    >
                        <ServiceSection {...services[key]} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Add Discover Button */}
            <DiscoverButton  href={"services"}/>
        </motion.div>
    </section>
);

/**
 * Renders the desktop/tablet layout with animations
 */
const renderDesktopLayout = (
    services,
    t,
    isTablet,
    containerVariants,
    gridItemVariants,
    handleDiscoverClick
) => (
    <section className="relative w-full">
        <SectionHeader title={t("title")} subtitle={t("subtitle")}/>

        <motion.div
            className="container mx-auto px-4 relative"
            style={{margin: "0 auto"}}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.2}}
        >
            <motion.div
                style={{
                    display: "grid",
                    gridTemplateColumns: isTablet ? "5fr 2fr 5fr" : "repeat(3, 1fr)",
                    gap: isTablet ? "1rem" : "2rem",
                    margin: 0,
                }}
            >
                {/* Left Column */}
                <motion.div
                    style={{
                        marginTop: "0",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: isTablet ? "45vh" : "70vh",
                    }}
                    variants={gridItemVariants}
                >
                    <motion.div
                        style={{margin: "1rem 0"}}
                        initial={{x: -100, opacity: 0}}
                        whileInView={{x: 0, opacity: 1}}
                        transition={{duration: 0.6, type: "spring"}}
                        viewport={{once: true}}
                    >
                        <ServiceSection {...services[POSITIONS.TOP_LEFT]} />
                    </motion.div>
                    <motion.div
                        style={{margin: "2rem 0"}}
                        initial={{x: -100, opacity: 0}}
                        whileInView={{x: 0, opacity: 1}}
                        transition={{duration: 0.6, delay: 0.2, type: "spring"}}
                        viewport={{once: true}}
                    >
                        <ServiceSection {...services[POSITIONS.BOTTOM_LEFT]} />
                    </motion.div>
                </motion.div>

                {/* Middle Column - Add Discover Button */}
                <motion.div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    initial={{opacity: 0, scale: 0}}
                    whileInView={{opacity: 1, scale: 1}}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        type: "spring",
                        stiffness: 100
                    }}
                    viewport={{once: true}}
                >
                    <DiscoverButton href={"services"}/>
                </motion.div>

                {/* Right Column */}
                <motion.div
                    style={{
                        marginTop: "0",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: isTablet ? "45vh" : "70vh",
                    }}
                    variants={gridItemVariants}
                >
                    <motion.div
                        style={{margin: "2rem 0"}}
                        initial={{x: 100, opacity: 0}}
                        whileInView={{x: 0, opacity: 1}}
                        transition={{duration: 0.6, type: "spring"}}
                        viewport={{once: true}}
                    >
                        <ServiceSection {...services[POSITIONS.TOP_RIGHT]} />
                    </motion.div>
                    <motion.div
                        style={{margin: "2rem 0"}}
                        initial={{x: 100, opacity: 0}}
                        whileInView={{x: 0, opacity: 1}}
                        transition={{duration: 0.6, delay: 0.2, type: "spring"}}
                        viewport={{once: true}}
                    >
                        <ServiceSection {...services[POSITIONS.BOTTOM_RIGHT]} />
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    </section>
);

export default OurServices;
