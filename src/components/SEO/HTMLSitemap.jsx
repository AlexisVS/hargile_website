"use client";

import {useLocale, useTranslations} from "next-intl";
import {
    Description,
    Header,
    LinkItem,
    LinksList,
    SectionCard,
    SectionGrid,
    SectionTitle,
    SitemapContainer,
    StyledLink,
    Title
} from "@/components/SEO/HTMLSitemap.styled";


const HtmlSitemap = () => {
    const t = useTranslations('pages.sitemap');
    const locale = useLocale();

    // Define site structure
    const siteStructure = [
        {
            id: "main",
            title: t("title"),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
            ),
            links: [
                {title: t("sections.main.home"), href: "/"},
                {title: t("sections.main.services"), href: "/services"},
                {title: t("sections.main.contact"), href: "/contact"},
            ],
        },
        {
            id: "services",
            title: t("sections.services.title"),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                    <path d="M12 18V6"/>
                </svg>
            ),
            links: [
                {title: t("sections.services.webDesign"), href: "/services"},
                {title: t("sections.services.mobileDev"), href: "/services"},
                {title: t("sections.services.seo"), href: "/services"},
                {title: t("sections.services.marketing"), href: "/services"},
            ],
        },
        {
            id: "tools",
            title: t("sections.tools.title"),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path
                        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
            ),
            links: [
                {title: t("sections.tools.seoAudit"), href: "/audit"},
                {title: t("sections.tools.performanceCheck"), href: "/audit/result"},
            ],
        },
        {
            id: "legal",
            title: t("sections.legal.title"),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
            ),
            links: [
                {title: t("sections.legal.terms"), href: "/legal/terms-of-service"},
                {title: t("sections.legal.privacy"), href: "/legal/privacy-policy"},
                {title: t("sections.legal.cookies"), href: "/legal/privacy-policy#cookies"},
            ],
        },
        {
            id: "support",
            title: t("sections.support.title"),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            ),
            links: [
                {title: t("sections.support.contact"), href: "/contact"},
            ],
        },
    ];

    return (
        <SitemapContainer>
            <Header>
                <Title>{t("title")}</Title>
                <Description>{t("description")}</Description>
            </Header>

            <SectionGrid>
                {siteStructure.map((section) => (
                    <SectionCard key={section.id}>
                        <SectionTitle>
                            {section.icon}
                            {section.title}
                        </SectionTitle>
                        <LinksList>
                            {section.links.map((link, idx) => (
                                <LinkItem key={idx}>
                                    <StyledLink href={`/${locale}${link.href}`}>{link.title}</StyledLink>
                                </LinkItem>
                            ))}
                        </LinksList>
                    </SectionCard>
                ))}
            </SectionGrid>
        </SitemapContainer>
    );
};

export default HtmlSitemap;
