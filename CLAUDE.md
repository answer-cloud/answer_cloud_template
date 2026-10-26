# SaaaaS — the primary Answer Cloud template

- Site kind: hosting; reusable local Astro source template.
- Role: primary/default standalone starter for `answer-cloud/answer_cloud_template`. The previous design is retained separately in `archive/classic` upstream and `templates/archive/classic` in the application repository.
- Name: SaaaaS. Slug, organization, and public origin are unassigned.
- Source: based on `answer-cloud/answer_cloud_template`, with a visual direction inspired by https://guideless.ai/.
- Invoke the answer-cloud-site skill for site authoring and deployment.
- Deploy through Answer Cloud only when the user requests publication. The reusable template builds without `SITE_URL`. Derived public sites use `SITE_URL=https://their-real-domain.com npm run build:site`, which validates the public HTTPS origin.
- Do not hand-write HTML pages, llms.txt, sitemaps, analytics, or widget scripts. Astro generates static HTML; Answer Cloud supplies its answer-engine layer.

## Visual language

- `src/styles/tokens.css` is canonical; `src/styles/site.css` contains shared components. Both pages use `SiteLayout.astro`.
- Inter variable is self-hosted and SIL OFL licensed. The wordmark pairs a serif face with the reusable `BrandMark.astro` answer.cloud spark, using the original supplied SVG path and #0058EF blue. Use this mark rather than a Unicode glyph at every size. Use Inter for all other prose and UI, monospace for token labels only.
- White surfaces, charcoal `--color-ink`, restrained gray `--color-muted`, fine `--color-border` lines. Black primary buttons. Fresh blue, lilac, peach, and mint support the canonical `--gradient-aurora`, `--gradient-dawn`, `--gradient-sky`, and `--gradient-meadow` color moments. Keep them vibrant around the white product frame, in illustrations, and in the closing call to action; retain a quiet white canvas for prose.
- Display text is fluid 40–56px; section headings 30–36px; body 16px; interface labels 12–14px. Weights predominantly 400 and 500. Keep heading tracking slightly tight.
- `IntegrationLogo.astro` supplies crisp SVG marks with accessible brand labels for illustrative integration tiles. Keep optical sizing consistent; do not replace logos with letters or approximate Unicode symbols.
- 4px spacing scale, 1180px maximum content, generous section padding, 6/10/16/24px radii. Shadows are for floating UI, product frames, and dialogs.
- Responsive layout changes at 640, 768, and 1024px, drawn from the reference's 40/48/64rem breakpoints.
- Preserve visible keyboard focus, semantic headings, reduced motion, native dialogs and disclosures. Use restrained GSAP ScrollTrigger reveals, staggered card groups, and a small product-frame drift on scroll. Keep native scrolling and skip motion when reduced motion is preferred. Do not introduce autoplay or a 3D hero.
- Use the answer.cloud spark for identity in the header, footer, and brand specimens. Product illustrations use tidy, aligned UI. Gradient specimens show only color. Chat uses a text header and simple controls. Avoid oversized decorative logos, tilted decorative cards or sticky notes, floating slogan banners, sparkle badges, and handwritten annotations.
- Marketing copy, workspace data, and plans are illustrative template content. Do not add invented real customer endorsements or performance claims.
- The style guide defaults to search `noindex,follow` and `answercloud:index=exclude`. Use `indexable={true}` only when intentionally publishing it as public documentation. Mark illustrative sections with `data-aeo-exclude` to omit their data from answer extraction while keeping the UI visible.
- Audit the production build with `npm run preview`, since the development server deliberately serves unminified tooling. Keep GSAP deferred and preserve reduced-motion behavior.
- Hero load entrances use CSS; the headline stays visible from first paint. Keep these transforms separate from the GSAP workspace drift. The animated Aurora uses `GradientBackdrop.astro`, with a pause control and automatic pausing outside the viewport or in hidden tabs. Honor reduced motion for both.
- The hero workspace is a static product illustration, styled in `workspace.css` and exposed as one accessible image. Prioritize visual clarity over simulated interactions; use no interactive tabs, task inputs, or demo triggers inside it. Keep the real product-tour buttons outside the illustration.
- The independently loaded `public/assets/answercloud-chat.css` must use the same palette; scope every selector to supported widget IDs. Never import it into the page stylesheet.
