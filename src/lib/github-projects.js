const FEATURED_PROJECTS = [
  {
    id: "featured-binge-box",
    name: "Binge Box",
    description: "A curated collection of top-rated movies and TV shows.",
    stargazers_count: null,
    created_at: null,
    language: null,
    html_url: "https://github.com/Monik2002/Binge-box-Project",
    demoLink: "https://main--bingeboxx.netlify.app/",
  },
  {
    id: "featured-shopping-list",
    name: "Shopping List",
    description: "Vanilla JS shopping list.",
    stargazers_count: null,
    created_at: null,
    language: "JavaScript",
    html_url: "https://github.com/Monik2002/Shopping-list-JS",
    demoLink: "https://shopping-list-js-1.netlify.app/",
  },
  {
    id: "featured-trippify",
    name: "Trippify Travel App",
    description: "Travel-planning app.",
    stargazers_count: null,
    created_at: null,
    language: null,
    html_url: "https://github.com/Monik2002/Trippify-Travel-App",
    demoLink: null,
  },
];

function isSafeGitHubRepositoryUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.username === "" &&
      url.password === "" &&
      /^\/Monik2002\/[^/]+\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

function getSafeDemoUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return null;

  try {
    const url = new URL(value);
    if (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.username === "" &&
      url.password === ""
    ) {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
}

export function normalizeGitHubProjects(value) {
  if (!Array.isArray(value)) {
    throw new TypeError("GitHub repository response must be an array.");
  }

  return value
    .filter(
      (project) =>
        project &&
        typeof project === "object" &&
        Number.isSafeInteger(project.id) &&
        project.id > 0 &&
        typeof project.name === "string" &&
        project.name.length > 0 &&
        project.name.length <= 100 &&
        project.name !== "Monik2002" &&
        typeof project.fork === "boolean" &&
        !project.fork &&
        typeof project.description === "string" &&
        project.description.trim().length > 0 &&
        project.description.length <= 5000 &&
        (project.language === null ||
          project.language === undefined ||
          (typeof project.language === "string" &&
            project.language.length <= 100)) &&
        Number.isSafeInteger(project.stargazers_count) &&
        project.stargazers_count >= 0 &&
        typeof project.created_at === "string" &&
        project.created_at.length <= 64 &&
        Number.isFinite(Date.parse(project.created_at)) &&
        isSafeGitHubRepositoryUrl(project.html_url)
    )
    .map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description.trim(),
      language:
        typeof project.language === "string" ? project.language : null,
      stargazers_count: project.stargazers_count,
      created_at: project.created_at,
      html_url: project.html_url,
      demoLink: getSafeDemoUrl(project.homepage),
    }));
}

export function getProjectsForDisplay(projects) {
  if (!Array.isArray(projects)) {
    throw new TypeError("Projects for display must be an array.");
  }

  return projects.length > 0 ? projects : FEATURED_PROJECTS;
}
