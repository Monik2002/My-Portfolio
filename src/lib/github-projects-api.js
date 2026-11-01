const GITHUB_REPOSITORIES_URL =
  "https://api.github.com/users/Monik2002/repos?per_page=100";
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

export async function getGitHubRepositories(fetcher = fetch) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetcher(GITHUB_REPOSITORIES_URL, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `GitHub repository request failed with HTTP ${response.status}.`
      );
      return {
        body: { error: "GitHub repositories are temporarily unavailable." },
        status: response.status >= 500 ? 502 : response.status,
        cacheControl: "no-store",
      };
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new TypeError("GitHub returned an invalid repository response.");
    }

    return {
      body: repositories,
      status: 200,
      cacheControl: CACHE_CONTROL,
    };
  } catch (error) {
    console.error("Could not retrieve GitHub repositories.", error);
    return {
      body: { error: "GitHub repositories are temporarily unavailable." },
      status: 502,
      cacheControl: "no-store",
    };
  }
}
