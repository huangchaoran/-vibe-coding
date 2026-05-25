/**
 * Gojica 项目 Playwright 测试脚本
 * 用于测试 uni-app H5 版本
 */

const { chromium } = require('playwright');

async function testGojicaApp() {
  console.log('🚀 启动浏览器...');
  
  // 启动本地 Chrome 浏览器
  const browser = await chromium.launch({
    channel: "chrome",  // 使用本地安装的 Chrome
    headless: false,    // 显示浏览器窗口，方便调试
    slowMo: 100,        // 减慢操作速度，方便观察
  });

  // 创建一个新的浏览器上下文
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },  // iPhone X 尺寸
    deviceScaleFactor: 2,
  });

  // 创建一个新的页面
  const page = await context.newPage();

  try {
    console.log('📱 打开登录页面...');
    await page.goto('http://localhost:5173/#/pages/login/index', {
      waitUntil: 'networkidle',  // 等待网络空闲
      timeout: 30000  // 30秒超时
    });

    // 等待页面加载完成
    await page.waitForTimeout(2000);

    // 截取登录页面截图
    console.log('📸 截取登录页面...');
    await page.screenshot({
      path: './test-results/login-page.png',
      fullPage: false
    });

    // 填写手机号
    console.log('✏️ 填写手机号...');
    await page.fill('input[type="number"]', '13800138000');

    // 点击获取验证码按钮
    console.log('🔔 点击获取验证码...');
    await page.click('text=获取验证码');

    // 等待提示
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: './test-results/after-send-code.png',
      fullPage: false
    });

    // 填写验证码（假设为123456）
    console.log('✏️ 填写验证码...');
    const codeInputs = await page.$$('input[type="number"]');
    if (codeInputs.length > 1) {
      await codeInputs[1].fill('123456');
    }

    await page.waitForTimeout(500);
    await page.screenshot({
      path: './test-results/form-filled.png',
      fullPage: false
    });

    // 点击开发模式登录按钮
    console.log('🔐 点击开发模式登录...');
    await page.click('text=开发模式登录(调试)');

    // 等待登录结果
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: './test-results/after-login.png',
      fullPage: false
    });

    // 检查是否跳转到首页
    console.log('✅ 登录成功，跳转到首页');
    const currentUrl = page.url();
    console.log('当前页面 URL:', currentUrl);

    // 测试首页功能
    console.log('🧪 测试首页功能...');

    // 点击乐队 Tab
    await page.click('text=乐队');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: './test-results/band-list.png',
      fullPage: false
    });

    // 点击活动 Tab
    await page.click('text=活动');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: './test-results/activity-list.png',
      fullPage: false
    });

    console.log('✅ 所有测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    await page.screenshot({
      path: './test-results/error-state.png',
      fullPage: false
    });
  } finally {
    // 关闭浏览器
    await browser.close();
    console.log('👋 浏览器已关闭');
  }
}

// 运行测试
testGojicaApp();
