# UI guidelines

_Updated 2026-11-01._

## Design and layout

The portfolio uses a compact editorial layout with a centered content column, fixed navigation, cards, and a shared footer. Preserve the existing component and CSS conventions rather than introducing a second design system.

## Colors and themes

`src/App.css` defines the color tokens. The light theme uses white surfaces, gray borders/text, and indigo links; highlights use green, yellow, and pink accents. Dark-mode classes use `dark-bg` (`#121212`) and light text. Theme preference is stored as the non-sensitive value `theme` in local storage.

## Typography and spacing

Inter is the base/heading face and IBM Plex Mono is the monospace face, loaded from Google Fonts. The content width is 780px (with 560px and 700px variants); the small navigation height is 60px. Reuse existing `.container`, `.segment`, `.card`, and `.button` classes.

## Responsive behavior

Existing CSS switches at 700px and 1280px. Check navigation, cards, contact form, and footer on narrow and desktop viewports after shared styling changes.

Tailwind CSS 4 uses `@tailwindcss/postcss`; `src/index.css` explicitly loads the JavaScript theme configuration and retains class-based dark mode. Tailwind 4 requires Safari 16.4+, Chrome 111+, or Firefox 128+.

## Component, animation, and accessibility conventions

- Use shared components in `src/components/` and keep route rendering in `src/app/`.
- Use semantic headings, labels, descriptive link text, and accessible names for icon-only buttons.
- Each route should have one page-level H1; icon-only social links must announce the correct destination.
- Keep external new-tab links `rel="noopener noreferrer"`.
- Keep animation brief, avoid blocking access to page content, and respect reduced-motion preferences.
- Use imported local assets with Next Image where practical; do not add untrusted remote image hosts.
- Keep keyboard focus visible and maintain sufficient contrast in both themes.

## Current UI notes

The welcome overlay is animated by GSAP; route content remains server-rendered beneath it. The project loader and scroll-to-top button use local CSS rather than separate UI packages.
