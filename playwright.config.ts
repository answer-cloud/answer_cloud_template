import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4332', headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4332',
    url: 'http://127.0.0.1:4332',
    reuseExistingServer: false,
  },
});
