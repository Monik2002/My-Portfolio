# UI guidelines

_Updated 2026-11-01._

## Design and layout

The portfolio uses an editorial layout with a centered, responsive content column, pixel-art navigation, selected project cards, and a shared footer. The home page introduces Monik and links directly to projects and contact, followed by featured projects and highlights. Preserve the existing component and CSS conventions rather than introducing a second design system.

## Colors and themes

`src/App.css` defines the color tokens. The light theme uses white and warm neutral surfaces, dark text, and a restrained green accent. The dark theme uses `#121212`, lighter text, and a lighter green accent; some existing pages retain their own colors. A subtle CSS dot pattern frames the home portrait. Theme preference is stored as the non-sensitive value `theme` in local storage.

Shared accent/surface pairs are `#315d43` on `#f5f4ed` in light mode and `#a5dbb6` on `#1c231e` in dark mode. Form placeholders use `#626b78` in light mode and `#d1d5db` in dark mode. Existing page-specific utility colors remain; these values are not a claim that every combination meets contrast requirements.

## Typography and spacing

Inter is the base/heading face and IBM Plex Mono is used for dates and technical metadata, loaded from Google Fonts. The main content width is 1120px (with 560px and 700px variants); the small navigation height is 60px. Headings use a responsive scale, and dates and counts use tabular numerals. Reuse existing `.container`, `.segment`, `.card`, and `.button` classes.

Shared tokens include `--space-small` (0.75rem), `--space-medium` (1.5rem), `--space-large` (3–5rem), `--surface-radius` (10px), and a 44px control target. Existing components retain some local spacing and Tailwind utility values. Surfaces use borders rather than a global elevation shadow.

## Responsive behavior

Existing CSS switches at 700px and 1280px. The home hero stacks text before the portrait on narrow screens and uses two columns on wider screens. Check navigation, cards, contact form, and footer on narrow and desktop viewports after shared styling changes.

## Component, animation, and accessibility conventions

- Use shared components in `src/components/` and keep route rendering in `src/app/`.
- Use semantic headings, labels, descriptive link text, and accessible names for icon-only buttons.
- Each route should have one page-level H1; icon-only social links must announce the correct destination.
- Keep external new-tab links `rel="noopener noreferrer"`.
- Keep animation brief, avoid blocking access to page content, and respect reduced-motion preferences.
- Shared controls use 220ms ease-out feedback. The home hero has an 800ms staggered entrance, and supported browsers use CSS view timelines for a short scroll reveal on selected content. Content remains visible without timeline support; reduced motion removes the entrance, scroll travel, and hover tilt. Avoid continuous decorative animation or scroll-dependent content.
- A skip link bypasses navigation. Buttons show disabled state; contact and project loading and errors use their existing status text and feedback. Scroll-to-top avoids smooth scrolling when reduced motion is requested.
- Standalone project links, social controls, and contact buttons use a 44px minimum target; inline prose links retain their text flow.
- Use imported local assets with Next Image where practical; do not add untrusted remote image hosts.
- Keep keyboard focus visible and maintain sufficient contrast in both themes.

## Current UI notes

The welcome overlay uses a CSS animation; route content remains server-rendered beneath it. The project loader and scroll-to-top button use local CSS rather than separate UI packages.

On wider screens the first featured project spans two rows, with a pixel-dot surface echoed in the portrait frame. Project cards tilt on precise-pointer hover and retain a visible border on keyboard focus. Touch devices use the static card layout. CSS scroll timelines progressively enhance supported browsers and do not conceal content when unsupported.
