"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import ProjectCard from "@/components/pages/portfolio/components/projectCards";
import {
  RecentWorksSection,
  ContentContainer,
  SectionTitle,
  ProjectsGrid,
  ViewAllButton,
} from "./recent-works.styled";

const RecentWorks = () => {

  const tHomepage = useTranslations("pages.homepage.sections.recent-works");


  const { getLatestProjects } = usePortfolioData();
  const latestProjects = getLatestProjects(6);

  return (
    <RecentWorksSection>
      <ContentContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          whileinview={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          }}
          viewport={{ once: true, amount: 0.1 }}
        >
          {tHomepage("title")}
        </SectionTitle>

        <ProjectsGrid>
          {latestProjects.map((project, index) => (
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

        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <ViewAllButton href="/portfolio">
            {tHomepage("view-all")}
          </ViewAllButton>
        </div>
      </ContentContainer>
    </RecentWorksSection>
  );
};

export default RecentWorks;
