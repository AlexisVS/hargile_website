"use client";

import React, {useState} from "react";
import {useTranslations} from "next-intl";
import {FileText, Menu, Printer, X} from "lucide-react";
import {
    ActionButton,
    ActionButtons,
    BulletItem,
    BulletList,
    ContentWrapper,
    Header,
    LastUpdate,
    MainContent,
    MenuButton,
    NavItem,
    PageContainer,
    Paragraph,
    Section,
    SectionTitle,
    Sidebar,
    SidebarTitle,
    SubSectionTitle,
    Title
} from "@/app/[locale]/(context)/(client)/legal/privacy-policy/PrivacyPocilyPageClient.styled";

export default function PrivacyPolicyPageClient() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("termsConditions");

    const t = useTranslations("pages.privacy-policy");

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId);
        setMenuOpen(false);
    };

    return (
        <PageContainer>
            <ContentWrapper>
                <Header>
                    <div>
                        <Title>{t("title")}</Title>
                        <LastUpdate>
                            {t("lastUpdate")}: {t("lastUpdateDate")}
                        </LastUpdate>
                    </div>
                    <MenuButton aria-label={'display menu'} onClick={toggleMenu}>
                        {menuOpen ? <X size={24}/> : <Menu size={24}/>}
                    </MenuButton>
                </Header>

                {/* Fix: Use $menuOpen with $ prefix, which styled-components will handle properly */}
                <Sidebar $menuOpen={menuOpen}>
                    <SidebarTitle>{t("inThisPage")}</SidebarTitle>

                    <NavItem
                        href="#terms"
                        data-active={(activeSection === "termsConditions").toString()}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("termsConditions");
                        }}
                    >
                        1. {t("sections.termsConditions.title")}
                    </NavItem>

                    <NavItem
                        href="#privacy"
                        data-active={(activeSection === "privacyPolicy").toString()}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("privacyPolicy");
                        }}
                    >
                        2. {t("sections.privacyPolicy.title")}
                    </NavItem>

                    <NavItem
                        href="#cookies"
                        data-active={(activeSection === "cookies").toString()}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("cookies");
                        }}
                    >
                        3. {t("sections.cookies.title")}
                    </NavItem>

                    <NavItem
                        href="#rights"
                        data-active={(activeSection === "userRights").toString()}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("userRights");
                        }}
                    >
                        4. {t("sections.userRights.title")}
                    </NavItem>

                    <NavItem
                        href="#prospection"
                        data-active={(activeSection === "prospection").toString()}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("prospection");
                        }}
                    >
                        5. {t("sections.prospection.title")}
                    </NavItem>

                    <NavItem
                        href="#contact"
                        data-active={(activeSection === "contactUs").toString()}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("contactUs");
                        }}
                    >
                        6. {t("sections.contactUs.title")}
                    </NavItem>

                    <NavItem
                        href="#international"
                        data-active={(activeSection === "international").toString()}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("international");
                        }}
                    >
                        7. {t("sections.international.title")}
                    </NavItem>

                    <NavItem
                        href="#contact-us"
                        data-active={(activeSection === "contactSupport").toString()}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("contactSupport");
                        }}
                    >
                        8. {t("sections.contactSupport.title")}
                    </NavItem>
                </Sidebar>

                <MainContent>
                    {activeSection === "termsConditions" && (
                        <Section id="terms">
                            <SectionTitle>
                                1. {t("sections.termsConditions.title")}
                            </SectionTitle>
                            <Paragraph>{t("sections.termsConditions.welcome")}</Paragraph>

                            <SubSectionTitle>
                                1.1 {t("sections.termsConditions.intellectualProperty.title")}
                            </SubSectionTitle>
                            <Paragraph>
                                {t("sections.termsConditions.intellectualProperty.content")}
                            </Paragraph>

                            <SubSectionTitle>
                                1.2 {t("sections.termsConditions.liability.title")}
                            </SubSectionTitle>
                            <Paragraph>
                                {t("sections.termsConditions.liability.content")}
                            </Paragraph>
                        </Section>
                    )}

                    {activeSection === "privacyPolicy" && (
                        <Section id="privacy">
                            <SectionTitle>
                                2. {t("sections.privacyPolicy.title")}
                            </SectionTitle>
                            <Paragraph>{t("sections.privacyPolicy.introduction")}</Paragraph>

                            <SubSectionTitle>
                                2.1 {t("sections.privacyPolicy.dataCollection.title")}
                            </SubSectionTitle>
                            <Paragraph>
                                {t("sections.privacyPolicy.dataCollection.content")}
                            </Paragraph>

                            <SubSectionTitle>
                                2.2 {t("sections.privacyPolicy.dataUsage.title")}
                            </SubSectionTitle>
                            <Paragraph>
                                {t("sections.privacyPolicy.dataUsage.content")}
                            </Paragraph>
                            <BulletList>
                                <BulletItem>
                                    {t("sections.privacyPolicy.dataUsage.purposes.services")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.privacyPolicy.dataUsage.purposes.transactions")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.privacyPolicy.dataUsage.purposes.responses")}
                                </BulletItem>
                            </BulletList>
                        </Section>
                    )}

                    {activeSection === "cookies" && (
                        <Section id="cookies">
                            <SectionTitle>3. {t("sections.cookies.title")}</SectionTitle>
                            <Paragraph>{t("sections.cookies.introduction")}</Paragraph>

                            <SubSectionTitle>
                                3.1 {t("sections.cookies.types.title")}
                            </SubSectionTitle>
                            <BulletList>
                                <BulletItem>{t("sections.cookies.types.essential")}</BulletItem>
                                <BulletItem>{t("sections.cookies.types.analytics")}</BulletItem>
                                <BulletItem>
                                    {t("sections.cookies.types.functional")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.cookies.types.advertising")}
                                </BulletItem>
                            </BulletList>

                            <SubSectionTitle>
                                3.2 {t("sections.cookies.control.title")}
                            </SubSectionTitle>
                            <Paragraph>{t("sections.cookies.control.content")}</Paragraph>
                        </Section>
                    )}

                    {activeSection === "userRights" && (
                        <Section id="rights">
                            <SectionTitle>4. {t("sections.userRights.title")}</SectionTitle>
                            <Paragraph>{t("sections.userRights.introduction")}</Paragraph>
                            <BulletList>
                                <BulletItem>
                                    {t("sections.userRights.rights.access")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.userRights.rights.rectification")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.userRights.rights.erasure")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.userRights.rights.restriction")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.userRights.rights.portability")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.userRights.rights.objection")}
                                </BulletItem>
                                <BulletItem>
                                    {t("sections.userRights.rights.complaint")}
                                </BulletItem>
                            </BulletList>
                        </Section>
                    )}

                    {activeSection === "prospection" && (
                        <Section id="prospection">
                            <SectionTitle>5. {t("sections.prospection.title")}</SectionTitle>
                            <Paragraph>{t("sections.prospection.introduction")}</Paragraph>

                            <SubSectionTitle>
                                5.1 {t("sections.prospection.source.title")}
                            </SubSectionTitle>
                            <Paragraph>{t("sections.prospection.source.content")}</Paragraph>

                            <SubSectionTitle>
                                5.2 {t("sections.prospection.legalBasis.title")}
                            </SubSectionTitle>
                            <Paragraph>{t("sections.prospection.legalBasis.content")}</Paragraph>

                            <SubSectionTitle>
                                5.3 {t("sections.prospection.optOut.title")}
                            </SubSectionTitle>
                            <Paragraph>{t("sections.prospection.optOut.content")}</Paragraph>

                            <SubSectionTitle>
                                5.4 {t("sections.prospection.retention.title")}
                            </SubSectionTitle>
                            <Paragraph>{t("sections.prospection.retention.content")}</Paragraph>
                        </Section>
                    )}

                    {activeSection === "contactUs" && (
                        <Section id="contact">
                            <SectionTitle>6. {t("sections.contactUs.title")}</SectionTitle>
                            <Paragraph>{t("sections.contactUs.content")}</Paragraph>
                        </Section>
                    )}

                    {activeSection === "international" && (
                        <Section id="international">
                            <SectionTitle>
                                7. {t("sections.international.title")}
                            </SectionTitle>
                            <Paragraph>{t("sections.international.content")}</Paragraph>
                        </Section>
                    )}

                    {activeSection === "contactSupport" && (
                        <Section id="contact-us">
                            <SectionTitle>
                                8. {t("sections.contactSupport.title")}
                            </SectionTitle>
                            <Paragraph>{t("sections.contactSupport.content")}</Paragraph>
                        </Section>
                    )}

                    <ActionButtons aria-label={'Action buttons'}>
                        <ActionButton>
                            <FileText size={18}/>
                            {t("downloadPDF")}
                        </ActionButton>
                        <ActionButton>
                            <Printer size={18}/>
                            {t("print")}
                        </ActionButton>
                    </ActionButtons>
                </MainContent>
            </ContentWrapper>
        </PageContainer>
    );
}
