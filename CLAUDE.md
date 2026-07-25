# answer.cloud site

- Site kind: hosting
- Slug: {slug}                  <!-- fill in once known / after first deploy -->
- Served at: https://{slug}.answer.cloud
- Organization: {org name/slug}
- Source: Astro. Never hand-write plain HTML, llms.txt, sitemaps, analytics, or
  chat-widget scripts — the platform generates that layer at deploy time.
- Deploy: through the answercloud MCP server only, and only when explicitly requested.

## What this project is

This is the **default brand style guide and UI design system** for answer.cloud sites —
a single-page, responsive reference derived from a restrained, technical, editorial visual
language (poolside.ai as reference). It is intended to be the default starting point for new
answer.cloud sites.

Design constraints (do not violate):
- **Maximum font size anywhere is 32px.** No oversized hero typography.
- Instrument Sans (UI) + JetBrains Mono (code/metadata only).
- Accent `#2E7BFF` / deep `#0058EF`, used intentionally — not on every component.
- Border- and grid-driven hierarchy; shadows only for floating elements.

Key files:
- `src/styles/tokens.css` — the single source of truth for all design tokens.
- `src/styles/styleguide.css` — base + component styles built on those tokens.
- `src/layouts/StyleGuide.astro` — page shell, navigation, fonts, footer.
- `src/pages/index.astro` — the full 23-section style guide.
- `public/assets/answercloud-chat.css` — brand-matched chat widget theme (scoped to
  `#llmo-chat-button`, `#llmo-chat-iframe`, `#llmo-chat-widget` only).

For ANY work on this site — authoring, styling, CMS templates, building, deploying,
or verifying/debugging the chat widget — invoke the `answer-cloud-site` skill first
and follow it.
