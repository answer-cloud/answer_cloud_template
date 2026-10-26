# Standalone site motion

Choose a visual concept from the customer's brief and replace the style-guide showcase.
The default is one tailored Three.js hero, a coordinated GSAP entrance, two or three selected
section sequences when the page has enough sections, and clear hover/focus states. Vary the
composition and typography as well as the scene. Existing sites and CMS companions keep their
visual system. A request for quiet or animation-free design takes precedence.

```astro
---
import HeroScene from './components/HeroScene.astro';
import SiteMotion from './components/SiteMotion.astro';
---
<SiteMotion>
  <section>
    <h1 data-hero-reveal>A real headline in static HTML</h1>
    <p data-hero-reveal>Factual content, immediately available.</p>
    <a href="/contact/" data-hero-reveal>Get in touch</a>
    <HeroScene preset="network" color="#285c55" secondary="#c58049" />
  </section>
  <section data-reveal>More useful content.</section>
</SiteMotion>
```

Paths above are relative to `src`; adjust them for the page's location. Import your site's
tokens and styles from its layout. `HeroScene` presets are `sculpture`, `network`, and
`landscape`. Color defaults to the host's `--color-accent`; `color` and `secondary` accept CSS
colors understood by Three.js. The presets are starting points: customize geometry,
materials, and composition in `src/scripts/hero-scene.ts`. Update the static SVG in
`HeroScene.astro` to match a custom scene. Keep one scene on a customer homepage; the showcase
contains extra scenes to demonstrate the options.

`SiteMotion` scopes its selectors to its children and only moves elements explicitly marked
with `data-hero-reveal` or `data-reveal`. Avoid nesting these markers on the same element or
wrapping the platform chat. Motion does not hide content in default CSS. Shared tokens are
`--motion-duration` (seconds), `--motion-stagger` (seconds), `--motion-distance` (pixels),
and `--motion-ease` (GSAP easing name). Keep native scrolling.

For an animation-free brief, omit both wrappers/components or use `SiteMotion enabled={false}`
and `HeroScene animated={false}` for static artwork. The browser preference for reduced motion
automatically disables animation and the Three.js import. Preference changes revert GSAP
styles and dispose WebGL resources. The scene also has an accessible pause/resume control.

Three.js is dynamically loaded when the scene enters the viewport. Rendering pauses when
offscreen or in a hidden tab. Geometry stays small, pixel ratio is capped at 1.5, and narrower
scenes use fewer objects. Unsupported WebGL, failed imports, and context loss retain the static
composition. Custom elements clean up on removal, including Astro client navigation.

## Validate changes

```sh
npm ci
npm run build
npm run typecheck
npx playwright install chromium
npm run test:motion
```

To use an installed Chrome instead, run `PLAYWRIGHT_CHANNEL=chrome npm run test:motion`.

Tests use the built static artifact, a local preview server, and Chromium. They cover desktop
and mobile, deferred imports, all three presets, pause/offscreen behavior, reduced motion,
context loss, unavailable WebGL, failed imports, no JavaScript, and teardown. Review screenshots
alongside the tests; passing assertions alone do not establish visual quality. Measure loading
and bundle size on representative customer pages. Do not claim unmeasured performance scores.
After an authorized deployment, verify the same site with the injected chat at desktop and
mobile widths. Local template tests cannot verify the production widget or AEO ingestion.

Keep npm lockfiles and third-party license notices. This template uses GSAP for generated
website animation; review its license separately before building a visual animation editor.
