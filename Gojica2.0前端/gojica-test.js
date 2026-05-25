const { chromium } = require('playwright');

(async () => {
  console.log('🚀 启动 Chrome 浏览器...');
  const browser = await chromium.launch({
    channel: "chrome",  // 使用本地 Chrome
    headless: false,    // 显示浏览器窗口
    slowMo: 100        // 减慢操作速度
  });
  
  const page = await browser.newPage();
  
  // 设置视口大小（模拟手机）
  await page.setViewportSize({ width: 375, height: 812 });
  
  console.log('🌐 访问 Gojica 应用...');
  try {
    await page.goto("http://localhost:5173", {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    console.log('✅ 页面加载成功！');
    
    // 等待页面稳定
    await page.waitForTimeout(2000);
    
    // 截图
    const timestamp = Date.now();
    await page.screenshot({
      path: `./test-results/${timestamp}-homepage.png`,
      fullPage: false
    });
    console.log('📸 截图已保存');
    
    // 获取页面标题
    const title = await page.title();
    console.log('📄 页面标题:', title);
    
    // 检查是否有错误
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000);
    
    if (errors.length > 0) {
      console.log('❌ 控制台错误:', errors);
    } else {
      console.log('✅ 没有控制台错误');
    }
    
    console.log('✅ 测试完成！浏览器将保持打开以便查看');
    console.log('按 Ctrl+C 结束测试...');
    
    // 保持浏览器打开
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({
      path: './test-results/error-state.png'
    });
  }
})();
