import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './.output/e2e-results',
  timeout: 30000,
  expect: { timeout: 8000 },
  workers: 2,
  reporter: [['list'], ['json', { outputFile: '.output/e2e-report.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4175/jihuang/',
    browserName: 'chromium',
    ...(process.platform === 'win32' ? { channel: 'chrome' } : {}),
    screenshot: 'only-on-failure', trace: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } }
  ],
  webServer: process.env.CAMPFIRE_E2E_EXTERNAL ? undefined : {
    command: 'node scripts/preview-static.mjs',
    url: 'http://127.0.0.1:4175/jihuang/',
    reuseExistingServer: false,
    env: { CAMPFIRE_PREVIEW_PORT: '4175', CAMPFIRE_PREVIEW_ROOT: process.env.CAMPFIRE_PREVIEW_ROOT || '.output/public' }
  }
})
