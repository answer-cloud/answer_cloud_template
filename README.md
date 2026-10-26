# SaaaaS

The primary standalone website template for Answer Cloud, inspired by [Guideless](https://guideless.ai/). Includes a home page, a living style guide, original components, a polished product illustration, and lightweight motion. SaaaaS is the illustrative site name; replace its branding and content for each new site.

The official scaffold is `answer-cloud/answer_cloud_template`. Its repository root uses this design. The previous template is preserved in `archive/classic/` upstream and `templates/archive/classic/` in the Answer Cloud application repository; use it only when the old design is explicitly wanted.

## Preview

```sh
npm install
npm run dev
```

- Home: `http://localhost:4332/`
- Style guide: `http://localhost:4332/style-guide/`

The home page includes a polished project-board illustration, a three-step product tour, features, illustrative pricing, FAQs, and a closing call to action. The style guide includes color copying, typography, spacing, shape, component states, local form validation, tables, and a local chat preview.

The hero workspace is a static product illustration, with an accessible image description and responsive composition. Its apparent controls are visual details. The product tour, example forms, and chat stay in the browser. Plans and product capabilities are illustrative; connect your own product, signup, billing, or demo flow before launching a real business.

## Make it yours

| File | Purpose |
| --- | --- |
| `src/pages/index.astro` | Home page content, plans, and FAQs |
| `src/pages/style-guide.astro` | Living design-system reference |
| `src/styles/tokens.css` | Shared palette, typography, spacing, radii, and motion |
| `src/styles/site.css` | Shared components and responsive page shell |
| `src/styles/home.css` | Home page and product illustration styles |
| `src/styles/guide.css` | Style guide layout and examples |
| `src/layouts/SiteLayout.astro` | Metadata, navigation, footer, mobile menu, product tour |
| `src/components/Workspace.astro` / `src/styles/workspace.css` | Static hero project-board illustration |
| `src/components/ProjectSetup.astro` / `DeliverySummary.astro` | Aligned product previews for the first and third steps |
| `src/components/BrandMark.astro` | Original answer.cloud spark, with a transparent artboard |
| `src/components/IntegrationLogo.astro` | Accessible SVG integration logos |
| `src/components/SiteMotion.astro` | GSAP loading and motion lifecycle |
| `src/components/GradientBackdrop.astro` | Animated Aurora layers and pause control |
| `src/scripts/motion.ts` | ScrollTrigger reveals, staggered groups, and workspace drift |
| `public/assets/answercloud-chat.css` | Independently loaded Answer Cloud chat theme |
| `public/assets/social-preview.png` | 1200 × 630 social preview |
| `CLAUDE.md` / `AGENTS.md` | Template conventions and visual language |

Keep both pages on the same tokens and components. Replace the sample content, and regenerate the social preview when changing the brand. Inter is self-hosted; its SIL Open Font License is included in `public/assets/INTER-LICENSE.txt`.

English text preloads the Latin Inter subset (about 109 KB, down from 352 KB). Latin Extended and the original full font remain available through CSS font ranges for other supported languages and symbols. All variable weights, optical sizing, and stylistic features are preserved. If adapting to a different primary language, change the font preload to the matching subset.

The supplied answer.cloud logo is retained at `public/assets/answercloud-logo.svg`; the component uses its exact path and original blue, cropped to the artwork so the white artboard does not cover gradients. SaaaaS remains the template name.

Scroll animations use GSAP and ScrollTrigger with native scrolling. `data-reveal` marks individual content, `data-reveal-group` staggers direct children, and `data-scroll-drift` adds a small vertical shift to the workspace frame. Shared motion tokens set timing and distance. The animation bundle loads after the page has loaded and the browser has spare time, or when the visitor starts scrolling. The hero uses lightweight CSS entrances, with the headline visible from first paint and keyboard focus completing entrances immediately. `GradientBackdrop.astro` moves three overlapping color layers through continuous loops; its pause control, visibility handling, and reduced-motion support keep that motion optional. Reduced motion disables all animation and the GSAP download; static HTML stays readable when JavaScript is unavailable.

## Build and publish

An unassigned template needs no `SITE_URL`:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4332
```

Use the production preview for Lighthouse. `npm run dev` includes Vite's development client and unminified modules, which inflate transfer size and unused-JavaScript findings.

When deriving a real site, build with its actual public HTTPS domain:

```sh
SITE_URL=https://your-actual-domain.com npm run build:site
```

`build:site` requires a public domain origin and rejects local URLs, IP addresses, credentials, paths, queries, and fragments. This sets absolute canonical, Open Graph, and Twitter image URLs. Replace the example domain with the final site’s real domain. `npm run build` still works without an assigned origin; when supplied, `SITE_URL` is validated there too. `dist/` contains two static pages plus their assets. Run `npm test` to check the URL rules.

Publish the built `dist/` artifact through Answer Cloud when requested. Answer Cloud supplies search, analytics, answer-engine files, and the live chat widget. The chat stylesheet ships ready to configure after deployment; the style guide's chat is a separate local UI example.

No account, public site, or deployment is created by this template. Add a real origin, organization, and release destination when publishing.

## Search and answer-engine indexing

The home page is indexable. The style guide defaults to `noindex,follow` for search engines and `<meta name="answercloud:index" content="exclude">` for Answer Cloud. It remains browsable, but does not consume an indexed-page allowance or enter chat retrieval, generated Markdown, `llms.txt`, or the sitemap. These are independent controls: search `noindex` by itself does not disable Answer Cloud retrieval. Pass `indexable={true}` to `SiteLayout` if a derived site intentionally publishes its design documentation.

Use `data-aeo-exclude` on illustrative sections that should remain visible in HTML but stay out of the answer corpus. The sample workspace and demo dialog use it. Answer Cloud extracts main content, omits navigation and hidden UI, preserves readable text boundaries, and classifies this landing page as `WebPage`. Keep schema types tied to the page’s purpose rather than the presence of FAQ disclosures or feature cards.
