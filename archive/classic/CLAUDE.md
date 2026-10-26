# answer.cloud site

- Site kind: hosting
- Slug: {slug}                  <!-- fill in once known / after first deploy -->
- Served at: https://{slug}.answer.cloud
- Organization: {org name/slug}
- Source: Astro. Never hand-write plain HTML, llms.txt, sitemaps, analytics, or
  chat-widget scripts — the platform generates that layer at deploy time.
- Deploy: through the answercloud MCP server only, and only when explicitly requested.

## What this project is

This is the default Astro source template and design-system showcase for answer.cloud
sites. Replace the showcase with the customer's actual pages. For new standalone sites,
choose an expressive concept from the brief: a tailored Three.js hero, coordinated GSAP
entrances, two or three scroll sequences where appropriate, and clear interactive states.

Design defaults:
- Choose a palette, display typography, imagery, and composition suited to the brief.
  Fluid hero typography is encouraged; there is no universal 32px type cap.
- Instrument Sans is a body/UI fallback; JetBrains Mono is for code and metadata.
- Retokenize the sample palette, including focus and on-accent contrast, for the real site.
- Honor explicit requests for quiet or animation-free designs. Preserve existing brand
  systems and CMS companion designs; they do not require 3D scenes.
- Keep meaningful content in static HTML. Reuse HeroScene and SiteMotion for deferred
  loading, static fallbacks, reduced motion, pause controls, and resource cleanup.
- Read MOTION.md before adapting the animation components and verify its browser cases.

Key files:
- `src/styles/tokens.css` — the single source of truth for all design tokens.
- `src/styles/styleguide.css` — base + component styles built on those tokens.
- `src/layouts/StyleGuide.astro` — page shell, navigation, fonts, footer.
- `src/pages/index.astro` — the style-guide showcase; replace it with customer content.
- `src/components/HeroScene.astro`, `SiteMotion.astro`, and `src/scripts/` — motion primitives.
- `MOTION.md` — component usage, customization, and browser verification.
- `public/assets/answercloud-chat.css` — brand-matched chat widget theme (scoped to
  `#llmo-chat-button`, `#llmo-chat-iframe`, `#llmo-chat-widget` only).

For ANY work on this site — authoring, styling, CMS templates, building, deploying,
or verifying/debugging the chat widget — invoke the `answer-cloud-site` skill first
and follow it.
