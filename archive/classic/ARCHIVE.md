# Archived Answer Cloud classic template

This is the previous official template, preserved before SaaaaS became primary.

- Source: https://github.com/answer-cloud/answer_cloud_template
- Commit: `4f952fb8bc7892e485931836074043bfc43df527`
- Archived: 2026-10-26
- Includes original source, assets, configuration, lockfile, instructions, and motion tests.
- Generated `node_modules/`, `dist/`, and `.astro/` are intentionally excluded; reinstall and rebuild from the lockfile.

To use this older design explicitly:

```sh
cd archive/classic
npm ci
npm run build
npm run dev
```

When working in the Answer Cloud application repository, this directory is `templates/archive/classic`. Its instructions apply only to this archived design. The current primary template uses the SaaaaS design and does not require Three.js.
