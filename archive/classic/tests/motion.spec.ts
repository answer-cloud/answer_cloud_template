import { test, expect } from '@playwright/test';

test('hero loads separately, pauses, and releases resources on preference change', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const hero = page.locator('hero-scene').first();
  await expect(hero).toHaveAttribute('data-state', 'ready');
  await expect(hero).toHaveAttribute('data-running', 'true');
  await hero.getByRole('button', { name: 'Pause motion' }).click();
  await expect(hero).toHaveAttribute('data-running', 'false');
  await expect(hero.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await hero.getByRole('button', { name: 'Resume motion' }).click();
  await expect(hero).toHaveAttribute('data-running', 'true');
  await page.locator('#motion').scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-running', 'false');
  for (const preset of ['sculpture', 'network', 'landscape']) {
    await expect(page.locator(`#motion hero-scene[data-preset="${preset}"]`)).toHaveAttribute('data-state', 'ready');
  }
  await hero.scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-running', 'true');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(hero).toHaveAttribute('data-running', 'false');
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(hero).toHaveAttribute('data-running', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(hero).toHaveAttribute('data-state', 'static');
  await expect(hero.locator('.scene-fallback')).toHaveCSS('opacity', '1');
  await expect(hero.getByRole('button')).toBeHidden();
  await expect(page.locator('h1')).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(hero).toHaveAttribute('data-state', 'ready');
  await expect(hero.locator('canvas')).toHaveCount(1);
  await hero.evaluate(element => { const parent = element.parentElement!; element.remove(); parent.append(element); });
  await expect(hero).toHaveAttribute('data-running', 'true');
  expect(errors).toEqual([]);
});

test('reduced motion never requests the Three.js scene bundle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('hero-scene').first()).toHaveAttribute('data-state', 'static');
  expect(requests.filter(url => /hero-scene.*\.js/.test(url))).toEqual([]);
  await expect(page.locator('h1')).toBeVisible();
});

test('missing WebGL keeps artwork and page controls usable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null;
      return original.apply(this, [type, ...args] as never);
    } as typeof original;
  });
  await page.goto('/');
  const hero = page.locator('hero-scene').first();
  await expect(hero).toHaveAttribute('data-state', 'fallback');
  await expect(hero.locator('.scene-fallback')).toHaveCSS('opacity', '1');
  await expect(page.locator('h1')).toBeVisible();
  await page.getByRole('link', { name: 'Explore motion', exact: true }).click();
  await expect(page).toHaveURL(/#motion$/);
});

test('context loss restores the static composition and stops rendering', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('hero-scene').first();
  await expect(hero).toHaveAttribute('data-state', 'ready');
  await hero.locator('canvas').evaluate(canvas => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(hero).toHaveAttribute('data-state', 'fallback');
  await expect(hero).toHaveAttribute('data-running', 'false');
  await expect(hero.locator('.scene-fallback')).toHaveCSS('opacity', '1');
});

test('failed animation imports preserve content and fallback', async ({ page }) => {
  await page.route(/\/(?:hero-scene|motion)\.[^/]+\.js/, route => route.abort());
  await page.goto('/');
  await expect(page.locator('hero-scene').first()).toHaveAttribute('data-state', 'fallback');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveCSS('transform', 'none');
});

test('mobile hero fits and keeps its controls accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const hero = page.locator('hero-scene').first();
  await hero.scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-state', 'ready');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  await hero.getByRole('button').focus();
  await page.keyboard.press('Enter');
  await expect(hero).toHaveAttribute('data-running', 'false');
});

test('without JavaScript, the headline, artwork, and links remain available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4332/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('hero-scene').first().locator('.scene-fallback')).toHaveCSS('opacity', '1');
  await expect(page.locator('hero-scene').first().getByRole('button')).toBeHidden();
  await expect(page.getByRole('link', { name: 'Explore motion', exact: true })).toHaveAttribute('href', '#motion');
  await context.close();
});
