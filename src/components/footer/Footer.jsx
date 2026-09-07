"use client"

import {FooterLinkStyled} from "@/components/footer/footer-link.styled";
import {FooterContainerStyled, FooterInnerStyled} from "@/components/footer/footer-container.styled";
import {FooterContentStyled} from "@/components/footer/footer-content.styled";
import {BottomBarStyled} from "@/components/footer/bottom-bar.styled";
import {BottomLinksStyled} from "@/components/footer/bottom-links.styled";
import {BrandBlockStyled, BrandStyled, BrandTaglineStyled} from "@/components/footer/brand.styled";
import {OfferLinksStyled, OfferLinkStyled} from "@/components/footer/offer-links.styled";
import {Link} from "@/i18n/navigation";
import {useTranslations} from 'next-intl';
import {Address} from "@/components/footer/Adress.styled";
import {Copyright} from "@/components/footer/Copyright.styled";
import {SocialContainer, SocialLinkIcon} from "@/components/footer/social-medias.styled";
import {SiGithub, SiInstagram} from "@icons-pack/react-simple-icons";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import {NAP, napCityLine} from "@/lib/nap";


/* HARG-302: two offers are now GEO and SEO. Both route to /services/seo
   until a dedicated GEO page exists. */
const OFFERS = [
    {id: 'geo', href: '/services/seo'},
    {id: 'seo', href: '/services/seo'},
];

const Footer = () => {
    const t = useTranslations('components.footer');
    // "Tech Studio" lives with the hero copy — one source for the label site-wide
    const tHero = useTranslations('pages.homepage.sections.hero.v2');
    const tOffers = useTranslations('pages.services.index.offers');

    // The *build* year, inlined by next.config.mjs. Calling new Date() during
    // render of a client component would be non-deterministic (server prerender
    // and hydration can straddle a year boundary), which Next.js 16 flags — and
    // the previous hardcoded 2025 meant the raw HTML, the only thing AI crawlers
    // ever read since none of them run JS, advertised a stale year indefinitely.
    //
    // An effect used to correct this to the live year after mount. It was
    // dropped: it fired a cascading render on every visit to fix a value that is
    // already correct in the HTML, and it only ever fixed it for JS-running
    // humans — crawlers kept reading the build year regardless. If a deploy ever
    // sits unrebuilt across New Year the footer lags, which is what `postbuild`
    // refreshing this env var on every build is there to prevent.
    const year = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || 2025;

    const iconSize = '22px'

    const socials = [
        {
            id: "instagram",
            title: "@hargile_tech_studio",
            icon: <SiInstagram title={"hargile"} size={iconSize}/>,
            href: "https://www.instagram.com/hargile_tech_studio/"
        },
        {
            id: "linkedin",
            title: "HARGILE - Tech Studio",
            icon: <LinkedinIcon title={"hargile"} size={iconSize}/>,
            href: "https://www.linkedin.com/company/hargile"
        },
        {
            id: "github",
            title: "HARGILE GitHub",
            icon: <SiGithub title={"hargile"} size={iconSize}/>,
            href: "https://github.com/HARGILE-tech-studio"
        }
    ]

    return (
        <FooterContainerStyled>
            <FooterInnerStyled>
                {/* Top bar: brand — nav column — socials. New site links belong in
                    the nav column. */}
                <FooterContentStyled>
                    <BrandBlockStyled>
                        <BrandStyled as={Link} href="/">HARGILE</BrandStyled>
                        <BrandTaglineStyled>{tHero('eyebrow')}</BrandTaglineStyled>
                    </BrandBlockStyled>

                    <BottomLinksStyled as="nav" aria-label={t('sections.company')}>
                        <FooterLinkStyled as={Link} href="/faq">{t('links.faq')}</FooterLinkStyled>
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

                {/* Bottom bar: address — offer pages — copyright. The offers sit in
                    the middle column, under the nav above and between the two lines
                    that were already here. DOM order is the wide-screen order; below
                    1100px the three no longer fit on one line and the offers take
                    their own row back, on top (see OfferLinksStyled). */}
                <BottomBarStyled>
                    {/* Address comes from @/lib/nap so the copy and the JSON-LD
                        entity cannot drift apart. Only the country is translated.

                        The email used to close this line. It was the fourth place
                        it appeared — it is still in the JSON-LD (Organization and
                        contactPoint), in llms.txt and in the overlay menu, and the
                        page already ends on a contact CTA. Dropping it here costs
                        no signal and buys the width that lets the offers sit in the
                        middle: the line now matches the copyright opposite it. */}
                    <Address>
                        {NAP.street} · {napCityLine} · {t('address.country')}
                    </Address>

                    <OfferLinksStyled aria-label={t('sections.services')}>
                        {OFFERS.map((offer) => (
                            <OfferLinkStyled as={Link} key={offer.id} href={offer.href}>
                                {tOffers(`${offer.id}.title`)}
                            </OfferLinkStyled>
                        ))}
                    </OfferLinksStyled>

                    <Copyright>{t('copyright', {year})}</Copyright>
                </BottomBarStyled>
            </FooterInnerStyled>
        </FooterContainerStyled>
    );
};

export default Footer;
