const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    channel: "chrome",  // 本地 Chrome
    headless: false
  });
  const page = await browser.newPage();
  await page.goto("https://www.baidu.com");
  console.log("测试成功！");
})();
