"use client";

import {useTranslations} from "next-intl";
import {
    CtaLink,
    Intro,
    Lead,
    PromoCard,
    PromoSection,
    PromoTitle,
    Step,
    StepBody,
    StepText,
    StepTitle,
    StepWeek,
    Timeline,
} from "./mvp-promo.styled";

const STEP_KEYS = ["scope", "build", "launch"];

const MvpPromo = () => {
    const t = useTranslations("pages.homepage.sections.mvp-promo");

    return (
        <PromoSection className="mvp-promo">
            <div className="container">
                <PromoCard>
                    <Intro>
                        <PromoTitle>
                            {t("title") + " "}
                            <span className="accent">{t("titleAccent")}</span>
                        </PromoTitle>
                        <Lead>{t("lead")}</Lead>
                        <CtaLink href="/contact" aria-label={t("cta")}>
                            {t("cta")}
                            <span className="arrow" aria-hidden="true">→</span>
                        </CtaLink>
                    </Intro>

                    <Timeline>
                        {STEP_KEYS.map((key) => (
                            <Step key={key}>
                                <StepWeek>{t(`steps.${key}.week`)}</StepWeek>
                                <StepBody>
                                    <StepTitle>{t(`steps.${key}.title`)}</StepTitle>
                                    <StepText>{t(`steps.${key}.text`)}</StepText>
                                </StepBody>
                            </Step>
                        ))}
                    </Timeline>
                </PromoCard>
            </div>
        </PromoSection>
    );
};

export default MvpPromo;
