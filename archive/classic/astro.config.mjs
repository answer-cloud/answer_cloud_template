// @ts-check
import { defineConfig } from 'astro/config';

// Static output only — answer.cloud serves the built HTML from dist/.
export default defineConfig({
  output: 'static',
  server: {
    port: 4331,
  },
  build: {
    format: 'directory',
  },
});
