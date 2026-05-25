const { chromium } = require('playwright');

(async () => {
  console.log('🚀 启动浏览器...');
  const browser = await chromium.launch({
    channel: "chrome",  // 本地 Chrome
    headless: false
  });
  
  const page = await browser.newPage();
  
  console.log('🌐 访问应用...');
  await page.goto("https://www.baidu.com");
  
  console.log('✅ 测试完成，浏览器将保持打开');
  
  // 等待用户关闭
  await new Promise(() => {});
})();
