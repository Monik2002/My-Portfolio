import { SITE_URL } from "../lib/site-metadata";

const routes = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/me", priority: 0.7, changeFrequency: "yearly" },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
];

export default function sitemap() {
  return routes.map(({ path, ...metadata }) => ({
    url: path === "/" ? SITE_URL.origin : new URL(path, SITE_URL).toString(),
    ...metadata,
  }));
}
