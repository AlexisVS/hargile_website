"use client"

import React from 'react';
import styled from 'styled-components';
import {FooterLinkStyled} from "@/components/footer/footer-link.styled";
import {ColumnStyled} from "@/components/footer/column.styled";
import {HeadingStyled} from "@/components/footer/heading.styled";
import {FooterContainerStyled} from "@/components/footer/footer-container.styled";
import {FooterContentStyled} from "@/components/footer/footer-content.styled";
import {BottomBarStyled} from "@/components/footer/bottom-bar.styled";
import {BottomLinksStyled} from "@/components/footer/bottom-links.styled";
import {TransitionLink} from "@/components/TransitionLink";

const Text = styled.p`
    margin-bottom: 0.5rem;
`;

const Copyright = styled.div`
    color: rgba(255, 255, 255, 0.7);
    order: 1;
    text-align: center;

    @media (min-width: 640px) {
        order: 2;
        text-align: right;
    }
`;

const Footer = () => {
    return (

        <FooterContainerStyled>
            <FooterContentStyled>
                {/* Company info */}
                <ColumnStyled>
                    <HeadingStyled>HARGILE</HeadingStyled>
                    {/*<Text>123 Lorem ipsum</Text>*/}
                    <dl>
                        <dd>Général</dd>
                        <dt>
                            <FooterLinkStyled target={'_blank'} href="mailto:info@hargile.com">
                                info@hargile.com
                            </FooterLinkStyled>
                        </dt>

                        <dd>Contact clients</dd>
                        <dt>
                            <FooterLinkStyled target={'_blank'} href="mailto:charles.dl@hargile.com">
                                charles.dl@hargile.com
                            </FooterLinkStyled>
                        </dt>

                        <dd>Administration</dd>
                        <dt>
                            <FooterLinkStyled target={'_blank'} href="mailto:pascal.l@hargile.com">
                                pascal.l@hargile.com
                            </FooterLinkStyled>
                        </dt>
                    </dl>
                    {/*<Text>Numéro de téléphone</Text>*/}
                </ColumnStyled>

                {/* Solutions */}
                <ColumnStyled>
                    <HeadingStyled>Solutions</HeadingStyled>
                    <FooterLinkStyled as={TransitionLink} href="/solutions/agves">AGVES</FooterLinkStyled>
                    <FooterLinkStyled as={TransitionLink} href="/solutions/i-go">I GO</FooterLinkStyled>
                    <FooterLinkStyled as={TransitionLink} href="/solutions/multipass">MultiPass</FooterLinkStyled>
                </ColumnStyled>

                {/* Services */}
                <ColumnStyled>
                    <HeadingStyled>Services</HeadingStyled>
                    <FooterLinkStyled as={TransitionLink} href="/services">Services</FooterLinkStyled>
                    {/*<FooterLinkStyled as={TransitionLink} href="/services/web-development">Web*/}
                    {/*    Development</FooterLinkStyled>*/}
                {/*    <FooterLinkStyled as={TransitionLink} href="/services/digital-marketing">Digital*/}
                {/*        Marketing</FooterLinkStyled>*/}
                {/*    <FooterLinkStyled as={TransitionLink} href="/services/mobile-applications">Mobile*/}
                {/*        applications</FooterLinkStyled>*/}
                {/*    <FooterLinkStyled as={TransitionLink} href="/services/ai-solutions">AI Solutions</FooterLinkStyled>*/}
                {/*    <FooterLinkStyled as={TransitionLink} href="/services/cloud">Cloud</FooterLinkStyled>*/}
                </ColumnStyled>

                {/* Company */}
                <ColumnStyled>
                    <HeadingStyled>Company</HeadingStyled>
                    <FooterLinkStyled as={TransitionLink} href="/about-us">About Us</FooterLinkStyled>
                    <FooterLinkStyled as={TransitionLink} href="/contact">Contact</FooterLinkStyled>
                </ColumnStyled>

                {/* Resources */}
                {/*<ColumnStyled>*/}
                {/*    <HeadingStyled>Resources</HeadingStyled>*/}
                {/*    <FooterLinkStyled as={TransitionLink} href="/blog">Blog</FooterLinkStyled>*/}
                {/*    <FooterLinkStyled as={TransitionLink} href="/case-studies">Case studies</FooterLinkStyled>*/}
                {/*</ColumnStyled>*/}
            </FooterContentStyled>

            {/* Newsletter */}
            {/*<NewsletterSectionStyled>*/}
            {/*    <HeadingStyled>Stay updated</HeadingStyled>*/}
            {/*    <Text>Subscribe to our newsletter</Text>*/}
            {/*    <EmailInputStyled type="email" placeholder="Your email address"/>*/}
            {/*</NewsletterSectionStyled>*/}

            {/* Bottom bar */}
            <BottomBarStyled>
                <Copyright>© 2025 Hargile. All Rights Reserved</Copyright>
                <BottomLinksStyled>
                    <FooterLinkStyled as={TransitionLink} href="/legal/privacy-policy">Privacy Policy</FooterLinkStyled>
                    {/*<FooterLinkStyled as={TransitionLink} href="/legal/terms">Terms of Services</FooterLinkStyled>*/}
                    {/*<FooterLinkStyled as={TransitionLink} href="/legal/cookies">Cookie Policy</FooterLinkStyled>*/}
                    {/*<FooterLinkStyled as={TransitionLink} href="/accessibility">Accessibility</FooterLinkStyled>*/}
                    <FooterLinkStyled as={TransitionLink} href="/sitemap">Site Map</FooterLinkStyled>
                </BottomLinksStyled>
            </BottomBarStyled>
        </FooterContainerStyled>
    );
};

export default Footer;
