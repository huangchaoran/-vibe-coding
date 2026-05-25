const { chromium } = require('playwright');

console.log('测试开始...');

(async () => {
  try {
    console.log('正在启动浏览器...');
    const browser = await chromium.launch({
      channel: "chrome",
      headless: false
    });
    
    console.log('浏览器启动成功！');
    
    const page = await browser.newPage();
    console.log('新页面创建成功！');
    
    console.log('正在访问百度...');
    await page.goto("https://www.baidu.com", { timeout: 10000 });
    
    console.log('页面加载成功！');
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    console.log('页面标题:', title);
    
    console.log('测试完成！浏览器将保持打开...');
    await page.waitForTimeout(60000); // 等待60秒
    
  } catch (error) {
    console.error('发生错误:', error.message);
  }
})();
