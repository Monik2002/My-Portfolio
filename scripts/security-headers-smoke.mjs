import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { spawn } from "node:child_process";
import { SITE_ORIGIN } from "../src/lib/site-metadata.js";

const buildId = resolve(".next", "BUILD_ID");
if (!existsSync(buildId)) {
  throw new Error("Run `npm run build` before the security smoke test.");
}

const port = 3100 + Math.floor(Math.random() * 1000);
const baseUrl = `http://127.0.0.1:${port}`;
const nextCli = resolve("node_modules", "next", "dist", "bin", "next");
const server = spawn(
  process.execPath,
  [nextCli, "start", "--hostname", "127.0.0.1", "--port", String(port)],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(port),
    },
  }
);

async function waitForServer() {
  const deadline = Date.now() + 45_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js server exited with code ${server.exitCode}.`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
    }
    await delay(400);
  }

  throw new Error("Next.js production server did not become ready.");
}

try {
  await waitForServer();

  for (const [route, expectedText, expectedTitle] of [
    ["/", "Hey, I&#x27;m Monik", "Home | Monik Chatterjee"],
    ["/me", "About me", "About | Monik Chatterjee"],
    ["/projects", "Projects", "Projects | Monik Chatterjee"],
    ["/contact", "Contact Me!", "Contact | Monik Chatterjee"],
  ]) {
    const response = await fetch(new URL(route, baseUrl));
    assert.equal(response.status, 200, `${route} should render`);

    const html = await response.text();
    assert.ok(html.includes(expectedText), `${route} should include page content`);
    assert.ok(html.includes('href="#layout"'), `${route} should offer a skip link`);
    assert.match(html, /id="layout"[^>]*tabindex="-1"/, `${route} should have a focusable skip target`);
    assert.ok(
      html.includes(`<title>${expectedTitle}</title>`),
      `${route} should have its own page title`
    );
    assert.ok(
      html.includes(`property="og:title" content="${expectedTitle}"`),
      `${route} should have a route-specific Open Graph title`
    );
    assert.ok(
      html.includes(
        `rel="canonical" href="${SITE_ORIGIN}${route === "/" ? "" : route}"`
      ),
      `${route} should have a canonical URL`
    );

    for (const [header, expectedValue] of [
      ["x-content-type-options", "nosniff"],
      ["x-frame-options", "DENY"],
      ["referrer-policy", "strict-origin-when-cross-origin"],
      [
        "permissions-policy",
        "camera=(), microphone=(), geolocation=(), payment=()",
      ],
      ["cross-origin-opener-policy", "same-origin"],
    ]) {
      assert.equal(
        response.headers.get(header),
        expectedValue,
        `${header} should be configured on ${route}`
      );
    }

    const csp = response.headers.get("content-security-policy");
    assert.ok(csp?.includes("frame-ancestors 'none'"), "CSP should block framing");
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    assert.ok(nonce, "CSP should include a per-response script nonce");
    assert.ok(html.includes(`nonce="${nonce}"`), "HTML scripts should use the CSP nonce");
    assert.ok(!response.headers.has("x-powered-by"), "server version header should be absent");
  }

  const contactHtml = await (await fetch(new URL("/contact", baseUrl))).text();
  assert.match(
    contactHtml,
    /<h1(?:\s[^>]*)?>Contact Me!<\/h1>/,
    "contact page should have a semantic page heading"
  );

  const aboutHtml = await (await fetch(new URL("/me", baseUrl))).text();
  for (const name of [
    "TypeScript", "Docker", "Next.js", "Redis", "PostgreSQL", "React",
    "Tailwind CSS", "Node.js", "Go", "JavaScript", "Amazon Web Services",
    "WebStorm", "webpack", "Babel", "Yarn", "Git", "Spotify", "MongoDB",
    "Visual Studio Code", "Discord",
  ]) {
    assert.ok(
      aboutHtml.includes(`role="img" aria-label="${name}"`),
      `About should give the ${name} icon an accessible name`
    );
  }

  const invalidVerification = await fetch(
    new URL("/api/contact/verification", baseUrl),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    }
  );
  assert.equal(invalidVerification.status, 400, "verification should validate email");

  const invalidConfirmation = await fetch(
    new URL("/api/contact/verification/confirm", baseUrl),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email", code: "123456" }),
    }
  );
  assert.equal(invalidConfirmation.status, 400, "confirmation should validate input");

  const unverifiedContact = await fetch(new URL("/api/contact", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Sender",
      email: "sender@example.com",
      subject: "Test",
      message: "Must not send without verification.",
    }),
  });
  assert.equal(
    unverifiedContact.status,
    403,
    "contact submission should require an email verification token"
  );

  const footerHtml = await (await fetch(baseUrl)).text();
  assert.ok(
    footerHtml.includes('alt="LinkedIn"'),
    "LinkedIn icon should have an accessible name"
  );
  assert.ok(
    footerHtml.includes('href="https://github.com/Monik2002/Shopping-list-JS"'),
    "home page should feature the owner's Shopping List repository"
  );
  assert.ok(
    footerHtml.includes('href="https://github.com/Monik2002/Trippify-Travel-App"'),
    "home page should feature the owner's Trippify repository"
  );
  assert.ok(
    !footerHtml.includes("github.com/taniarascia/"),
    "home page should not attribute third-party repositories to the owner"
  );

  const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
  assert.equal(sitemapResponse.status, 200, "sitemap should render");
  const sitemapXml = await sitemapResponse.text();
  for (const route of ["/", "/me", "/projects", "/contact"]) {
    const sitemapPath = route === "/" ? "" : route;
    assert.ok(
      sitemapXml.includes(
        `<loc>${SITE_ORIGIN}${sitemapPath}</loc>`
      ),
      `sitemap should include ${route}`
    );
  }

  const robotsResponse = await fetch(new URL("/robots.txt", baseUrl));
  assert.equal(robotsResponse.status, 200, "robots.txt should render");
  const robotsTxt = await robotsResponse.text();
  assert.ok(robotsTxt.includes("Allow: /"), "robots.txt should allow public pages");
  assert.ok(
    robotsTxt.includes(
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`
    ),
    "robots.txt should point to the deployed sitemap"
  );

  const homeResponse = await fetch(baseUrl);
  const hsts = homeResponse.headers.get("strict-transport-security");
  if (process.env.ENABLE_HSTS === "true") {
    assert.equal(hsts, "max-age=31536000");
  } else {
    assert.equal(hsts, null, "HSTS stays disabled until HTTPS is verified");
  }

  console.log("Security headers and production route rendering passed.");
} finally {
  if (server.exitCode === null) {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill();
    await exited;
  }
}
