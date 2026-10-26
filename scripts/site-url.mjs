import { isIP } from 'node:net';

// Local template previews have no assigned origin. Published derivatives do.
export function siteUrl(value, { required = false } = {}) {
  if (!value?.trim()) {
    if (required) throw new Error('Set SITE_URL to this site’s public HTTPS origin before building a derived site.');
    return undefined;
  }

  let url;
  try { url = new URL(value.trim()); }
  catch { throw new Error('SITE_URL must be a public HTTPS origin, such as https://your-domain.com.'); }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  const local = !hostname.includes('.') || isIP(hostname) || hostname.startsWith('[')
    || /(?:^|\.)(localhost|local|internal|test|invalid)$/.test(hostname);
  if (url.protocol !== 'https:' || local || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be a public HTTPS domain origin without a path, credentials, query, or fragment.');
  }
  return url.origin;
}
