"use client"

import React from 'react';
import {FooterLinkStyled} from "@/components/footer/footer-link.styled";
import {ColumnStyled} from "@/components/footer/column.styled";
import {HeadingStyled} from "@/components/footer/heading.styled";
import {FooterContainerStyled} from "@/components/footer/footer-container.styled";
import {FooterContentStyled} from "@/components/footer/footer-content.styled";
import {BottomBarStyled} from "@/components/footer/bottom-bar.styled";
import {BottomLinksStyled} from "@/components/footer/bottom-links.styled";
import {BrandStyled} from "@/components/footer/brand.styled";
import {Link} from "@/i18n/navigation";
import {useTranslations} from 'next-intl';
import {Address} from "@/components/footer/Adress.styled";
import {Copyright} from "@/components/footer/Copyright.styled";
import {SocialLinkIcon} from "@/components/footer/social-medias.styled";
import {SiGithub, SiInstagram, SiYoutube} from "@icons-pack/react-simple-icons";
import LinkedinIcon from "@/components/icons/LinkedinIcon";


const Footer = () => {
    const t = useTranslations('components.footer');

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
            title: "HARGILE - innovative solutions",
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
            <FooterContentStyled>
                {/* Company info */}
                <ColumnStyled>
                    <BrandStyled as={Link} href="/">HARGILE</BrandStyled>
                    <Address>
                        {t('address.line1')}<br/>
                        {t('address.line2')}<br/>
                        {t('address.line3')}
                    </Address>

                    <FooterLinkStyled target={'_blank'} href="mailto:contact@hargile.com">
                        contact@hargile.com
                    </FooterLinkStyled>
                </ColumnStyled>

                {/* Company */}
                <ColumnStyled>
                    <HeadingStyled>{t('sections.company')}</HeadingStyled>
                    <FooterLinkStyled as={Link} href="/contact">{t('links.contact')}</FooterLinkStyled>
                </ColumnStyled>

                <ColumnStyled>
                    <HeadingStyled>{t('sections.socials')}</HeadingStyled>

                    <ColumnStyled>
                        {socials.map((social) => (
                            <SocialLinkIcon target={'_blank'} href={social.href} key={`social-${social.id}`}>
                                {social.icon}
                                <span>{social.title}</span>
                            </SocialLinkIcon>
                        ))}
                    </ColumnStyled>
                </ColumnStyled>
            </FooterContentStyled>

            {/* Bottom bar */}
            <BottomBarStyled>
                <Copyright>{t('copyright', {year: new Date().getFullYear()})}</Copyright>
                <BottomLinksStyled>
                    <FooterLinkStyled as={Link}
                                      href="/legal/privacy-policy">{t('links.privacyPolicy')}</FooterLinkStyled>
                    <FooterLinkStyled as={Link} href="/sitemap">{t('links.siteMap')}</FooterLinkStyled>
                </BottomLinksStyled>
            </BottomBarStyled>
        </FooterContainerStyled>
    );
};

export default Footer;
