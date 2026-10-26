import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { siteUrl } from './site-url.mjs';

try {
  const origin = siteUrl(process.env.SITE_URL, { required: true });
  const result = spawnSync(process.execPath, [
    fileURLToPath(new URL('../node_modules/astro/astro.js', import.meta.url)),
    'build', ...process.argv.slice(2),
  ], { stdio: 'inherit', env: { ...process.env, SITE_URL: origin } });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
