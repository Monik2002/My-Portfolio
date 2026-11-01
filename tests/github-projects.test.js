import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  getProjectsForDisplay,
  normalizeGitHubProjects,
} from "../src/lib/github-projects.js";

const validRepository = {
  id: 1,
  name: "portfolio-demo",
  description: "<script>alert(1)</script>",
  fork: false,
  stargazers_count: 2,
  created_at: "2024-01-01T00:00:00Z",
  language: "JavaScript",
  html_url: "https://github.com/Monik2002/portfolio-demo",
  homepage: "javascript:alert(1)",
};

test("normalizes repository data and rejects unsafe demo URLs", () => {
  const [project] = normalizeGitHubProjects([validRepository]);

  assert.equal(project.html_url, validRepository.html_url);
  assert.equal(project.demoLink, null);
  assert.equal(project.description, validRepository.description);
  assert.equal(project.language, "JavaScript");
});

test("omits repositories without a displayable description", () => {
  const projects = normalizeGitHubProjects([
    validRepository,
    { ...validRepository, id: 2, description: null },
    { ...validRepository, id: 3, description: "   " },
  ]);

  assert.deepEqual(projects.map(({ id }) => id), [1]);
});

test("React renders untrusted project descriptions as text", () => {
  const html = renderToStaticMarkup(
    createElement("p", null, validRepository.description)
  );

  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
});

test("rejects forks, non-owner repository links, and unsafe schemes", () => {
  const projects = normalizeGitHubProjects([
    validRepository,
    { ...validRepository, id: 2, fork: true },
    {
      ...validRepository,
      id: 3,
      html_url: "https://github.com/another-owner/repo",
    },
    {
      ...validRepository,
      id: 4,
      html_url: "javascript:alert(1)",
    },
  ]);

  assert.deepEqual(projects.map(({ id }) => id), [1]);
});

test("rejects malformed API responses", () => {
  assert.throws(() => normalizeGitHubProjects({}), TypeError);
});

test("accepts a safe external demo URL", () => {
  const [project] = normalizeGitHubProjects([
    { ...validRepository, homepage: "https://example.com/" },
  ]);

  assert.equal(project.demoLink, "https://example.com/");
});

test("shows featured owner projects when the live GitHub list is unavailable", () => {
  const projects = getProjectsForDisplay([]);

  assert.deepEqual(
    projects.map(({ name }) => name),
    ["Binge Box", "Shopping List", "Trippify Travel App"]
  );
  assert.ok(
    projects.every((project) =>
      project.html_url.startsWith("https://github.com/Monik2002/")
    )
  );
  assert.ok(projects.every((project) => project.description.trim().length > 0));
});

test("prefers live GitHub projects when they are available", () => {
  const liveProjects = normalizeGitHubProjects([validRepository]);

  assert.equal(getProjectsForDisplay(liveProjects), liveProjects);
});

test("rejects invalid input to the project display fallback", () => {
  assert.throws(() => getProjectsForDisplay(null), TypeError);
});
