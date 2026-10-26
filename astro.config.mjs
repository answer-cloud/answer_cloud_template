import { defineConfig } from 'astro/config';
import { siteUrl } from './scripts/site-url.mjs';

export default defineConfig({
  site: siteUrl(process.env.SITE_URL),
  output: 'static',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  server: { port: 4332, host: '127.0.0.1' },
});
