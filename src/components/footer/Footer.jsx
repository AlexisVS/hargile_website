"use client"

import React from 'react';
import {FooterLinkStyled} from "@/components/footer/footer-link.styled";
import {ColumnStyled} from "@/components/footer/column.styled";
import {HeadingStyled} from "@/components/footer/heading.styled";
import {FooterContainerStyled} from "@/components/footer/footer-container.styled";
import {FooterContentStyled} from "@/components/footer/footer-content.styled";
import {BottomBarStyled} from "@/components/footer/bottom-bar.styled";
import {BottomLinksStyled} from "@/components/footer/bottom-links.styled";
import {TransitionLink} from "@/components/TransitionLink";
import {useTranslations} from 'next-intl';
import {Address} from "@/components/footer/Adress.styled";
import {Copyright} from "@/components/footer/Copyright.styled";
import {SocialLinkIcon} from "@/components/footer/social-medias.styled";
import {SiGithub, SiGooglemaps, SiInstagram, SiYoutube} from "@icons-pack/react-simple-icons";
import {LucideLinkedin} from "lucide-react";


const Footer = () => {
    const t = useTranslations('components.footer');

    const iconSize = '22px'

    const socials = [
        {
            title: "@hargile_is",
            icon: <SiInstagram title={"hargile"} size={iconSize}/>,
            href: "https://www.instagram.com/hargile_is/"
        },
        {
            title: "HARGILE - innovative solutions",
            icon: <LucideLinkedin size={iconSize}/>,
            href: "https://www.linkedin.com/company/hargile"
        },
        {
            title: "@HARGILEinnovativesolutions",
            icon: <SiYoutube title={"hargile"} size={iconSize}/>,
            href: "https://www.youtube.com/@HARGILEinnovativesolutions"
        },
        {
            title: "HARGILE innovative solutions",
            icon: <SiGooglemaps size={iconSize}/>,
            href: "https://maps.app.goo.gl/RuYC96MNXGnuPrpM7"
        },
        {
            title: "HARGILE innovative solutions",
            icon: <SiGithub title={"hargile"} size={iconSize}/>,
            href: "https://github.com/HARGILE-innovative-solutions"
        }
    ]

    return (
        <FooterContainerStyled>
            <FooterContentStyled>
                {/* Company info */}
                <ColumnStyled>
                    <HeadingStyled>Hargile</HeadingStyled>
                    <Address>
                        {t('address.line1')}<br/>
                        {t('address.line2')}<br/>
                        {t('address.line3')}
                    </Address>
                    <dl>
                        <dd>{t('contact.general')}</dd>
                        <dt>
                            <FooterLinkStyled target={'_blank'} href="mailto:info@hargile.com">
                                info@hargile.com
                            </FooterLinkStyled>
                        </dt>

                        <dd>{t('contact.clients')}</dd>
                        <dt>
                            <FooterLinkStyled target={'_blank'} href="mailto:charles.dl@hargile.com">
                                charles.dl@hargile.com
                            </FooterLinkStyled>
                        </dt>

                        <dd>{t('contact.administration')}</dd>
                        <dt>
                            <FooterLinkStyled target={'_blank'} href="mailto:pascal.l@hargile.com">
                                pascal.l@hargile.com
                            </FooterLinkStyled>
                        </dt>
                    </dl>
                </ColumnStyled>

                {/* Solutions */}
                <ColumnStyled>
                    <HeadingStyled>{t('sections.solutions')}</HeadingStyled>
                    <FooterLinkStyled as={TransitionLink} href="/solutions/agves">AGVES</FooterLinkStyled>
                    <FooterLinkStyled as={TransitionLink} href="/solutions/i-go">I GO</FooterLinkStyled>
                    <FooterLinkStyled as={TransitionLink} href="/solutions/multipass">MultiPass</FooterLinkStyled>
                </ColumnStyled>

                {/* Services */}
                <ColumnStyled>
                    <HeadingStyled>{t('sections.services')}</HeadingStyled>
                    <FooterLinkStyled as={TransitionLink} href="/services">{t('sections.services')}</FooterLinkStyled>
                </ColumnStyled>

                {/* Company */}
                <ColumnStyled>
                    <HeadingStyled>{t('sections.company')}</HeadingStyled>
                    <FooterLinkStyled as={TransitionLink} href="/about-us">{t('links.aboutUs')}</FooterLinkStyled>
                    <FooterLinkStyled as={TransitionLink} href="/contact">{t('links.contact')}</FooterLinkStyled>
                </ColumnStyled>

                <ColumnStyled>
                    <HeadingStyled>{t('sections.socials')}</HeadingStyled>

                    <ColumnStyled>
                        {socials.map((social) => (
                            <SocialLinkIcon key={`social-${social.title}`}>
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
                    <FooterLinkStyled as={TransitionLink}
                                      href="/legal/privacy-policy">{t('links.privacyPolicy')}</FooterLinkStyled>
                    <FooterLinkStyled as={TransitionLink} href="/sitemap">{t('links.siteMap')}</FooterLinkStyled>
                </BottomLinksStyled>
            </BottomBarStyled>
        </FooterContainerStyled>
    );
};

export default Footer;
