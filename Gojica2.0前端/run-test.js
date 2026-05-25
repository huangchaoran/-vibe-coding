/**
 * Gojica 快速测试脚本
 * 
 * 使用方法：
 * 1. 先在 HBuilderX 中运行项目到 Chrome（H5版本）
 * 2. 然后运行此脚本：node quick-test.js
 */

const { chromium } = require('playwright');
const path = require('path');

async function quickTest() {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });

  const page = await context.newPage();

  try {
    // 访问 H5 版本（假设在 localhost:8080 运行）
    console.log('🌐 访问应用...');
    await page.goto('http://localhost:5173', {
      timeout: 10000,
      waitUntil: 'domcontentloaded'
    });

    await page.waitForTimeout(2000);
    
    // 截图
    const timestamp = Date.now();
    await page.screenshot({
      path: `./test-results/${timestamp}-home.png`
    });
    
    console.log('✅ 截图已保存到 test-results 目录');
    
    // 等待用户查看
    console.log('按 Ctrl+C 结束测试...');
    
    // 保持浏览器打开
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

quickTest();
