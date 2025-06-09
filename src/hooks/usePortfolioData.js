// src/hooks/usePortfolioData.js
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { projectsData } from "@/data/portfolio-data"; // Import the raw data

/**
 * A service class to handle portfolio logic.
 * It is instantiated inside the hook where we have access to the t function.
 */
class PortfolioDataService {
  constructor(rawProjects, t) {
    // The service now holds the raw data and the translation function
    this.rawProjects = rawProjects;
    this.t = t;

    // We create the translated projects list once upon instantiation
    this.translatedProjects = this.rawProjects.map((project) => ({
      ...project,
      // Overwrite keys with translated text
      subtitle: this.t(project.subtitleKey),
      description: this.t(project.descriptionKey),
      actionText: this.t(project.actionKey),
    }));
  }

  /**
   * Get all portfolio projects, fully translated.
   * @returns {Array} Array of translated portfolio projects
   */
  getAllProjects() {
    return this.translatedProjects;
  }

  /**
   * Get the latest portfolio projects.
   * @param {number} count - Number of latest projects to return
   * @returns {Array} Array of latest translated projects
   */
  getLatestProjects(count) {
    return this.getAllProjects().slice(0, count);
  }

  /**
   * Get a project by its ID.
   * @param {number} id - Project ID
   * @returns {Object|null} Translated project object or null if not found
   */
  getProjectById(id) {
    return this.getAllProjects().find((project) => project.id === id) || null;
  }
}

/**
 * The main hook that components will use.
 * It bridges the gap between our static data and the React translation context.
 */
export const usePortfolioData = () => {
  // We can use the hook here! This is the key.
  const t = useTranslations("pages.portfolio");

  // useMemo ensures the service is only created when the language (and thus `t`) changes.
  const portfolioService = useMemo(() => {
    return new PortfolioDataService(projectsData, t);
  }, [t]);

  return {
    getAllProjects: () => portfolioService.getAllProjects(),
    getLatestProjects: (count) => portfolioService.getLatestProjects(count),
    getProjectById: (id) => portfolioService.getProjectById(id),
  };
};
