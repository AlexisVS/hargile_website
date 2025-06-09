class PortfolioDataService {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  /**
   * Get all portfolio projects
   * @returns {Array} Array of portfolio projects
   */
  getAllProjects() {
    return this.dataSource.getProjects();
  }

  /**
   * Get latest portfolio projects
   * @param {number} count - Number of latest projects to return
   * @returns {Array} Array of latest portfolio projects
   */
  getLatestProjects(count = 3) {
    const projects = this.getAllProjects();
    return projects
      .sort((a, b) => b.id - a.id) // Sort by ID descending (latest first)
      .slice(0, count);
  }

  /**
   * Get project by ID
   * @param {number} id - Project ID
   * @returns {Object|null} Project object or null if not found
   */
  getProjectById(id) {
    const projects = this.getAllProjects();
    return projects.find((project) => project.id === id) || null;
  }

  /**
   * Get projects by category/type
   * @param {string} category - Category to filter by
   * @returns {Array} Array of projects in the category
   */
  getProjectsByCategory(category) {
    const projects = this.getAllProjects();
    return projects.filter(
      (project) =>
        project.category &&
        project.category.toLowerCase() === category.toLowerCase()
    );
  }
}

// Data source implementation
class StaticPortfolioDataSource {
  getProjects() {
    // This data should ideally come from your translations or CMS
    // For now, using the static data from your portfolio page
    return [
      {
        id: 18,
        title: "Delphine Simonis",
        subtitle: "Professional Photography Portfolio",
        description:
          "A stunning photography portfolio showcasing professional work with elegant design and smooth user experience.",
        image: "/images/portfolio/delphine.webp",
        actionText: "View More",
        actionUrl: "https://delphinesimonis.com",
        category: "portfolio",
      },
      {
        id: 17,
        title: "Gîte de Trussogne",
        subtitle: "Luxury Accommodation Website",
        description:
          "Beautiful booking website for a luxury gîte featuring immersive galleries and seamless reservation system.",
        image: "/images/portfolio/trussogne.webp",
        actionText: "View More",
        actionUrl: "https://trussogne.com/",
        category: "hospitality",
      },
      {
        id: 1,
        title: "EREN",
        subtitle: "Energy Storage Solutions",
        description:
          "Modern corporate website for energy storage company with clean design and technical focus.",
        image: "/images/portfolio/eren2.webp",
        actionText: "View More",
        actionUrl: "https://erenenergystorage.be/",
        category: "corporate",
      },
      {
        id: 2,
        title: "ALUVI",
        subtitle: "Aluminum Solutions",
        description:
          "Professional website showcasing aluminum construction solutions with detailed product catalogs.",
        image: "/images/portfolio/aluviPortofolio.webp",
        actionText: "View Project",
        actionUrl: "https://aluvi.be/",
        category: "industrial",
      },
      {
        id: 3,
        title: "Artaban",
        subtitle: "Creative Studio",
        description:
          "Creative portfolio website for design studio featuring bold visuals and interactive elements.",
        image: "/images/portfolio/artaban.webp",
        actionText: "Read Case Study",
        actionUrl: "https://artabanstudio.com/",
        category: "creative",
      },
      {
        id: 4,
        title: "Drip Drops",
        subtitle: "Fashion E-commerce",
        description:
          "Modern e-commerce platform for fashion brand with sleek product showcase and shopping experience.",
        image: "/images/portfolio/dripDrops.webp",
        actionText: "View More",
        actionUrl: "https://www.dripdrops.eu/",
        category: "ecommerce",
      },
      {
        id: 5,
        title: "Ferme de Basseilles",
        subtitle: "Agricultural Business",
        description:
          "Farm business website highlighting sustainable practices and local produce with warm, natural design.",
        image: "/images/portfolio/fdb.webp",
        actionText: "View More",
        actionUrl: "https://fermedebasseilles.be/",
        category: "agriculture",
      },
      {
        id: 6,
        title: "Azza Izzy",
        subtitle: "Personal Brand",
        description:
          "Dynamic personal brand website with bold design and engaging content presentation.",
        image: "/images/portfolio/azza.webp",
        actionText: "View More",
        actionUrl: "https://www.azzaworld.com/",
        category: "personal",
      },
    ];
  }
}

// Factory for creating the service
export const createPortfolioDataService = (dataSource = null) => {
    const source = dataSource || new StaticPortfolioDataSource();
    return new PortfolioDataService(source);
};
