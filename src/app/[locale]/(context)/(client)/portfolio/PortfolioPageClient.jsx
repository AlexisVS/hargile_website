"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Header } from "@/components/header/mainHeader";
import ProjectCard from "@/components/pages/portfolio/components/projectCards";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import {
  CallToActionSection,
  ContentContainer,
  CTAButton,
  CTADescription,
  CTATitle,
  PageWrapper,
  ProjectsGrid,
  ProjectsSection,
  SectionTitle,
} from "./PortfolioPageClient.styled";
import SchemaMarkup from "@/components/SEO/SchemaMarkup";
import {
  generatePortfolioCollectionSchema,
  generatePortfolioItemSchema,
} from "@/seo/portfolio-schema-generator";

export default function PortfolioPageClient() {
  const t = useTranslations("pages.portfolio");
  const locale = useLocale();

  // --- KEY CHANGE: Get all projects from our central hook ---
  // The data is now fully translated and ready to use.
  const { getAllProjects } = usePortfolioData();
  const projects = getAllProjects();

  // --- Your existing SEO schema logic now uses the data from the hook ---
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const schemaOptions = { locale, domain };
  const collectionSchema = generatePortfolioCollectionSchema(
    projects,
    schemaOptions,
    t("title"),
    t("description")
  );
  const projectSchemas = projects.map((project) =>
    generatePortfolioItemSchema(project, schemaOptions)
  );

  return (
    <PageWrapper>
      {/* Schema Markup for the collection page */}
      <SchemaMarkup data={collectionSchema} />

      {/* Schema Markup for each individual project */}
      {projectSchemas.map((schema, index) => (
        <SchemaMarkup key={`schema-${projects[index].id}`} data={schema} />
      ))}

      <ContentContainer>
        <Header
          titleAs={"h1"}
          title={t("title")}
          subtitleRegular={t("subtitle.line1")}
          subtitleHighlight={t("subtitle.line2")}
          description={t("description")}
          showBackgroundBlur={true}
        />

        <ProjectsSection>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            }}
            viewport={{ once: true, amount: 0.01 }}
          >
            {t("featuredProjects")}
          </SectionTitle>

          <ProjectsGrid>
            {/* The map function now uses the 'projects' array from the hook */}
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                subtitle={project.subtitle}
                description={project.description}
                image={project.image}
                actionText={project.actionText}
                actionUrl={project.actionUrl}
                index={index}
              />
            ))}
          </ProjectsGrid>
        </ProjectsSection>

        <CallToActionSection
          initial={{ opacity: 0, y: 40 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
          }}
          viewport={{ once: true, amount: 0.01 }}
        >
          <CTATitle>{t("cta.title")}</CTATitle>
          <CTADescription>{t("cta.description")}</CTADescription>
          <CTAButton
            href="/contact"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.01 },
            }}
          >
            {t("cta.button")}
          </CTAButton>
        </CallToActionSection>
      </ContentContainer>
    </PageWrapper>
  );
}
