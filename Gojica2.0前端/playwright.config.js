// Playwright 配置文件
const { defineConfig, devices } = require('playwright');

module.exports = defineConfig({
  testDir: './tests',  // 测试文件目录
  timeout: 30000,     // 测试超时时间
  retries: 0,          // 失败重试次数
  
  use: {
    baseURL: 'http://localhost:8080',  // 本地服务器地址
    headless: false,     // 显示浏览器
    viewport: { width: 375, height: 812 },
    screenshot: 'only-on-failure',  // 仅在失败时截图
    video: 'retain-on-failure',     // 保留失败时的视频
    trace: 'on-first-retry',        // 第一次失败时记录 trace
  },

  projects: [
    // iPhone X
    {
      name: 'iPhone X',
      use: { ...devices['iPhone X'] },
    },
    // iPhone 12
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] },
    },
    // Pixel 5
    {
      name: 'Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev:h5',  // 启动 H5 开发服务器
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
