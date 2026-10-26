import test from 'node:test';
import assert from 'node:assert/strict';
import { siteUrl } from './site-url.mjs';

test('an unassigned template builds without an origin', () => {
  assert.equal(siteUrl(undefined), undefined);
  assert.equal(siteUrl('  '), undefined);
});

test('a derived site requires an origin and normalizes HTTPS domains', () => {
  assert.throws(() => siteUrl(undefined, { required: true }), /Set SITE_URL/);
  assert.equal(siteUrl(' https://saas.example/ '), 'https://saas.example');
});

test('a derived site rejects local URLs and malformed canonical origins', () => {
  for (const value of [
    'not a url', 'http://saas.example', 'https://localhost', 'https://preview.localhost',
    'https://preview.local', 'https://intranet', 'https://127.0.0.1', 'https://192.168.1.1',
    'https://[::1]', 'https://user:pass@saas.example', 'https://saas.example/path',
    'https://saas.example/?preview=1', 'https://saas.example/#home',
  ]) assert.throws(() => siteUrl(value), /SITE_URL/, value);
});
