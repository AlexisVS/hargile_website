"use client"

import React, {useEffect, useState} from 'react';
import {FooterLinkStyled} from "@/components/footer/footer-link.styled";
import {FooterContainerStyled} from "@/components/footer/footer-container.styled";
import {FooterContentStyled} from "@/components/footer/footer-content.styled";
import {BottomBarStyled} from "@/components/footer/bottom-bar.styled";
import {BottomLinksStyled} from "@/components/footer/bottom-links.styled";
import {BrandBlockStyled, BrandStyled, BrandTaglineStyled} from "@/components/footer/brand.styled";
import {Link} from "@/i18n/navigation";
import {useTranslations} from 'next-intl';
import {Address} from "@/components/footer/Adress.styled";
import {Copyright} from "@/components/footer/Copyright.styled";
import {SocialContainer, SocialLinkIcon} from "@/components/footer/social-medias.styled";
import {SiGithub, SiInstagram, SiYoutube} from "@icons-pack/react-simple-icons";
import LinkedinIcon from "@/components/icons/LinkedinIcon";


const Footer = () => {
    const t = useTranslations('components.footer');
    // "Tech Studio" lives with the hero copy — one source for the label site-wide
    const tHero = useTranslations('pages.homepage.sections.hero.v2');

    // Read the current year on the client only. Calling new Date() during render
    // of a client component makes the output non-deterministic (server prerender
    // vs. hydration can straddle a year boundary), which Next.js 16 flags. Seed
    // with a stable base year so the prerendered markup matches first paint, then
    // correct to the live year after mount.
    const [year, setYear] = useState(2025);
    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const iconSize = '22px'

    const socials = [
        {
            id: "instagram",
            title: "@hargile_is",
            icon: <SiInstagram title={"hargile"} size={iconSize}/>,
            href: "https://www.instagram.com/hargile_is/"
        },
        {
            id: "linkedin",
            title: "HARGILE - Tech Studio",
            icon: <LinkedinIcon title={"hargile"} size={iconSize}/>,
            href: "https://www.linkedin.com/company/hargile"
        },
        {
            id: "youtube",
            title: "@HARGILEinnovativesolutions",
            icon: <SiYoutube title={"hargile"} size={iconSize}/>,
            href: "https://www.youtube.com/@HARGILEinnovativesolutions"
        },
        {
            id: "github",
            title: "HARGILE GitHub",
            icon: <SiGithub title={"hargile"} size={iconSize}/>,
            href: "https://github.com/HARGILE-innovative-solutions"
        }
    ]

    return (
        <FooterContainerStyled>
            {/* Top bar: brand — site links — socials. New site links belong in the nav. */}
            <FooterContentStyled>
                <BrandBlockStyled>
                    <BrandStyled as={Link} href="/">HARGILE</BrandStyled>
                    <BrandTaglineStyled>{tHero('eyebrow')}</BrandTaglineStyled>
                </BrandBlockStyled>

                <BottomLinksStyled as="nav" aria-label={t('sections.company')}>
                    <FooterLinkStyled as={Link} href="/contact">{t('links.contact')}</FooterLinkStyled>
                    <FooterLinkStyled as={Link}
                                      href="/legal/privacy-policy">{t('links.privacyPolicy')}</FooterLinkStyled>
                </BottomLinksStyled>

                {/* Icon-only socials; each link keeps its full name for screen readers */}
                <SocialContainer>
                    {socials.map((social) => (
                        <SocialLinkIcon target={'_blank'} href={social.href} key={`social-${social.id}`}
                                        aria-label={social.title} title={social.title}>
                            {social.icon}
                        </SocialLinkIcon>
                    ))}
                </SocialContainer>
            </FooterContentStyled>

            {/* Bottom bar: address + email on one line, copyright on the other side */}
            <BottomBarStyled>
                <Address>
                    {t('address.line1')} · {t('address.line2')} · {t('address.line3')} ·{' '}
                    <a target={'_blank'} href="mailto:contact@hargile.com">contact@hargile.com</a>
                </Address>
                <Copyright>{t('copyright', {year})}</Copyright>
            </BottomBarStyled>
        </FooterContainerStyled>
    );
};

export default Footer;
