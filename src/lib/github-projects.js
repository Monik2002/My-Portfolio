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
