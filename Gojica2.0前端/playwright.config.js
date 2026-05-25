// Playwright 配置文件
const { devices } = require('playwright');

module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 0,

  use: {
    baseURL: 'http://localhost:5173',
    headless: false,
    viewport: { width: 375, height: 812 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'iPhone X',
      use: { ...devices['iPhone X'] },
    },
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
  ],
};
