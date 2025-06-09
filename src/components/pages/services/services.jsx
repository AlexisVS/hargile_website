import React, {useRef} from "react";
import {useTranslations} from "next-intl";
import {motion, useInView} from "framer-motion";
import {
    BarChart3,
    Brain,
    ClipboardCheck,
    Cloud,
    Code,
    Database,
    FileText,
    Fingerprint,
    Globe,
    LandmarkIcon,
    Lightbulb,
    LineChart,
    RefreshCw,
    Search,
    Settings,
    ShoppingCart,
    Smartphone,
    Zap
} from "lucide-react";

import {
    CardContent,
    CardDescription,
    CardIcon,
    CardTitle,
    PageContainer,
    SectionContainer,
    SectionHeader,
    SectionIcon,
    SectionTitle,
    ServiceCard,
    ServiceGrid
} from "./services.styled";
import {OptimizedImage} from "@/components/optimizedImage";

const Services = () => {
    const t = useTranslations("pages.services");
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {once: true, amount: 0.01});

    // Animation variants
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.5, ease: "easeOut"}
        }
    };

    // Couleurs par section
    const sectionColors = {
        development: {
            main: "#3B82F6", // Bleu
            bg: "rgba(59, 130, 246, 0.15)"
        },
        maintenance: {
            main: "#8B5CF6", // Violet
            bg: "rgba(139, 92, 246, 0.15)"
        },
        ai: {
            main: "#06B6D4", // Cyan
            bg: "rgba(6, 182, 212, 0.15)"
        },
        analysis: {
            main: "#10B981", // Vert
            bg: "rgba(16, 185, 129, 0.15)"
        }
    };

    // Service sections with their respective services
    const serviceSections = [
        {
            id: "development",
            title: t("categories.dev.title"),
            icon: <Globe size={32} strokeWidth={1.5}/>,
            color: sectionColors.development.main,
            bgColor: sectionColors.development.bg,
            services: [
                {
                    id: "web",
                    title: t("services.web.title"),
                    description: t("services.web.description"),
                    icon: <Globe size={24} strokeWidth={1.5}/>
                },
                {
                    id: "mobile",
                    title: t("services.mobile.title"),
                    description: t("services.mobile.description"),
                    icon: <Smartphone size={24} strokeWidth={1.5}/>
                },
                {
                    id: "cms",
                    title: t("services.cms.title"),
                    description: t("services.cms.description"),
                    icon: <FileText size={24} strokeWidth={1.5}/>
                },
                {
                    id: "ecommerce",
                    title: t("services.ecommerce.title"),
                    description: t("services.ecommerce.description"),
                    icon: <ShoppingCart size={24} strokeWidth={1.5}/>
                },
                {
                    id: "api",
                    title: t("services.api.title"),
                    description: t("services.api.description"),
                    icon: <Code size={24} strokeWidth={1.5}/>
                },
                {
                    id: "seo",
                    title: t("services.seo.title"),
                    description: t("services.seo.description"),
                    icon: <Search size={24} strokeWidth={1.5}/>
                },
                {
                    id: "banking-connector",
                    title: t("services.banking-connector.title"),
                    description: t("services.banking-connector.description"),
                    icon: <LandmarkIcon size={24} strokeWidth={1.5}/>
                }
            ]
        },
        {
            id: "maintenance",
            title: t("categories.maintenance.title"),
            icon: <Settings size={32} strokeWidth={1.5}/>,
            color: sectionColors.maintenance.main,
            bgColor: sectionColors.maintenance.bg,
            services: [
                {
                    id: "support",
                    title: t("services.support.title"),
                    description: t("services.support.description"),
                    icon: <Settings size={24} strokeWidth={1.5}/>
                },
                {
                    id: "migration",
                    title: t("services.migration.title"),
                    description: t("services.migration.description"),
                    icon: <RefreshCw size={24} strokeWidth={1.5}/>
                },
                {
                    id: "performance",
                    title: t("services.performance.title"),
                    description: t("services.performance.description"),
                    icon: <Zap size={24} strokeWidth={1.5}/>
                }
            ]
        },
        {
            id: "ai",
            title: t("categories.ai.title"),
            icon: <Brain size={32} strokeWidth={1.5}/>,
            color: sectionColors.ai.main,
            bgColor: sectionColors.ai.bg,
            services: [
                {
                    id: "agents",
                    title: t("services.agents.title"),
                    description: t("services.agents.description"),
                    icon: <Fingerprint size={24} strokeWidth={1.5}/>
                },
                {
                    id: "cloud",
                    title: t("services.cloud.title"),
                    description: t("services.cloud.description"),
                    icon: <Cloud size={24} strokeWidth={1.5}/>
                },
                {
                    id: "automation",
                    title: t("services.automation.title"),
                    description: t("services.automation.description"),
                    icon: <Zap size={24} strokeWidth={1.5}/>
                },
                {
                    id: "ml",
                    title: t("services.ml.title"),
                    description: t("services.ml.description"),
                    icon: <LineChart size={24} strokeWidth={1.5}/>
                },
                {
                    id: "consulting",
                    title: t("services.consulting.title"),
                    description: t("services.consulting.description"),
                    icon: <Lightbulb size={24} strokeWidth={1.5}/>
                }
            ]
        },
        {
            id: "analysis",
            title: t("categories.analysis.title"),
            icon: <BarChart3 size={32} strokeWidth={1.5}/>,
            color: sectionColors.analysis.main,
            bgColor: sectionColors.analysis.bg,
            services: [
                {
                    id: "reporting",
                    title: t("services.reporting.title"),
                    description: t("services.reporting.description"),
                    icon: <BarChart3 size={24} strokeWidth={1.5}/>
                },
                {
                    id: "qa",
                    title: t("services.qa.title"),
                    description: t("services.qa.description"),
                    icon: <ClipboardCheck size={24} strokeWidth={1.5}/>
                },
                {
                    id: "apidev",
                    title: t("services.apidev.title"),
                    description: t("services.apidev.description"),
                    icon: <Database size={24} strokeWidth={1.5}/>
                }
            ]
        }
    ];

    return (
        <PageContainer ref={sectionRef}>
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                {serviceSections.map((section) => (
                    <SectionContainer key={section.id} as={motion.section} variants={itemVariants}>
                        <SectionHeader>
                            <SectionIcon $bgcolor={section.bgColor}>{section.icon}</SectionIcon>
                            <SectionTitle>{section.title}</SectionTitle>
                        </SectionHeader>

                        <ServiceGrid>
                            {section.services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    as={motion.div}
                                    variants={itemVariants}
                                    $sectionColor={section.color}
                                >
                                    <CardIcon $bgColor={section.bgColor}>{service.icon}</CardIcon>
                                    <CardContent>
                                        <CardTitle>{service.title}</CardTitle>
                                        <CardDescription>{service.description}</CardDescription>
                                        {service.id === 'banking-connector' && (
                                            <div style={{
                                                display: "flex",
                                                width: "100%",
                                                justifyContent: "space-evenly",
                                            }}>
                                                <OptimizedImage width={30} src="/icons/banking-brands/mastercard.svg"
                                                                alt=""/>
                                                <OptimizedImage width={30} src="/icons/banking-brands/amex.svg" alt=""/>
                                                <OptimizedImage width={30} src="/icons/banking-brands/visa.svg" alt=""/>
                                                <OptimizedImage width={30} src="/icons/banking-brands/maestro.svg"
                                                                alt=""/>
                                                <OptimizedImage width={30} src="/icons/banking-brands/paypal.svg"
                                                                alt=""/>
                                            </div>
                                        )}
                                    </CardContent>
                                    {/*<ServiceArrow $color={section.color} />*/}
                                </ServiceCard>
                            ))}
                        </ServiceGrid>
                    </SectionContainer>
                ))}
            </motion.div>
        </PageContainer>
    );
};

export default Services;
