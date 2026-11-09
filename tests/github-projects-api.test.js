import assert from "node:assert/strict";
import test from "node:test";
import { getGitHubRepositories } from "../src/lib/github-projects-api.js";

const GITHUB_REPOSITORIES_URL =
  "https://api.github.com/users/Monik2002/repos?per_page=100";
const repository = {
  id: 1,
  name: "portfolio-demo",
  description: "A test repository",
};

async function withMockedEnvironment(token, callback) {
  const originalToken = process.env.GITHUB_TOKEN;

  try {
    if (token === undefined) {
      delete process.env.GITHUB_TOKEN;
    } else {
      process.env.GITHUB_TOKEN = token;
    }
    await callback();
  } finally {
    if (originalToken === undefined) {
      delete process.env.GITHUB_TOKEN;
    } else {
      process.env.GITHUB_TOKEN = originalToken;
    }
  }
}

test("uses a server-only GitHub token and caches successful repository data", async () => {
  await withMockedEnvironment("test-token", async () => {
    const result = await getGitHubRepositories(async (url, options) => {
      assert.equal(url, GITHUB_REPOSITORIES_URL);
      assert.equal(options.headers.Authorization, "Bearer test-token");
      assert.equal(options.next.revalidate, 3600);

      return Response.json([repository]);
    });

    assert.equal(result.status, 200);
    assert.deepEqual(result.body, [repository]);
    assert.equal(
      result.cacheControl,
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
  });
});

test("fetches public repositories without requiring a token", async () => {
  await withMockedEnvironment(undefined, async () => {
    const result = await getGitHubRepositories(async (url, options) => {
      assert.equal(url, GITHUB_REPOSITORIES_URL);
      assert.equal(options.headers.Authorization, undefined);
      return Response.json([repository]);
    });

    assert.equal(result.status, 200);
    assert.deepEqual(result.body, [repository]);
  });
});

test("returns a generic uncached error when GitHub is rate-limited", async () => {
  await withMockedEnvironment(undefined, async () => {
    const result = await getGitHubRepositories(async () => {
      return Response.json({ message: "rate limit exceeded" }, { status: 403 });
    });

    assert.equal(result.status, 403);
    assert.deepEqual(result.body, {
      error: "GitHub repositories are temporarily unavailable.",
    });
    assert.equal(result.cacheControl, "no-store");
  });
});
