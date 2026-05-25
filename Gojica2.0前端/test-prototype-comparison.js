/**
 * Gojica 页面与原型图对比测试
 * 逐个检查页面与原型图的差异
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const testResultsDir = './test-results/prototype-comparison';
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

const config = {
  baseUrl: 'http://localhost:5173',
  viewport: { width: 375, height: 812 },
  timeout: 20000
};

let results = {
  passed: [],
  failed: [],
  warnings: [],
  screenshots: []
};

async function takeScreenshot(page, name) {
  const timestamp = Date.now();
  const filename = `${timestamp}-${name}.png`;
  const filepath = path.join(testResultsDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  results.screenshots.push({ name, filepath });
  console.log(`📸 ${name}`);
  return filepath;
}

async function checkElement(page, selector, description) {
  try {
    const element = await page.$(selector);
    if (element) {
      results.passed.push({ selector, description, status: '✅ 存在' });
      return true;
    } else {
      results.warnings.push({ selector, description, status: '⚠️ 缺失' });
      return false;
    }
  } catch (error) {
    results.failed.push({ selector, description, error: error.message, status: '❌ 错误' });
    return false;
  }
}

async function checkText(page, selector, expectedText, description) {
  try {
    const element = await page.$(selector);
    if (element) {
      const text = await element.textContent();
      if (text && text.includes(expectedText)) {
        results.passed.push({ selector, description, status: '✅ 文本匹配' });
        return true;
      } else {
        results.warnings.push({ selector, description, status: `⚠️ 文本不匹配 (期望: ${expectedText}, 实际: ${text})` });
        return false;
      }
    } else {
      results.warnings.push({ selector, description, status: '⚠️ 元素不存在' });
      return false;
    }
  } catch (error) {
    results.failed.push({ selector, description, error: error.message, status: '❌ 错误' });
    return false;
  }
}

async function testLoginPage(page) {
  console.log('\n1️⃣ 测试登录页...');
  await page.goto(`${config.baseUrl}/#/pages/login/index`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '01-login-page');
  
  // 检查关键元素
  await checkElement(page, '.app-name', '品牌名称');
  await checkText(page, '.app-name', 'GOJICA', 'GOJICA品牌名');
  await checkText(page, '.slogan', '音乐', '标语');
  await checkElement(page, 'input[type="number"]', '手机号输入框');
  await checkElement(page, 'text=开发模式登录(调试)', '开发模式登录按钮');
  await checkElement(page, 'text=微信一键登录', '微信登录按钮');
}

async function testHomePage(page) {
  console.log('\n2️⃣ 测试首页...');
  await page.goto(`${config.baseUrl}/#/pages/home/index`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(3000);
  await takeScreenshot(page, '02-home-page');
  
  // 检查关键元素
  await checkElement(page, '.app-title', '应用标题');
  await checkElement(page, '.search-bar', '搜索栏');
  await checkElement(page, 'swiper', '轮播图');
  await checkElement(page, '.stats-row', '统计行');
  await checkElement(page, '.section', '内容区块');
  await checkElement(page, '.bottom-nav', '底部导航');
  
  // 检查底部TabBar
  await checkElement(page, 'text=首页', '首页Tab');
  await checkElement(page, 'text=乐队', '乐队Tab');
  await checkElement(page, 'text=广场', '广场Tab');
  await checkElement(page, 'text=市场', '市场Tab');
  await checkElement(page, 'text=我的', '我的Tab');
}

async function testBandListPage(page) {
  console.log('\n3️⃣ 测试乐队列表页...');
  await page.goto(`${config.baseUrl}/#/pages/band/list`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '03-band-list');
  
  // 检查关键元素
  await checkElement(page, '.nav-title', '页面标题');
  await checkElement(page, '.filter-tags, .style-tags', '筛选标签');
  await checkElement(page, '.band-card, .band-item', '乐队卡片');
}

async function testBandCreatePage(page) {
  console.log('\n4️⃣ 测试创建乐队页...');
  await page.goto(`${config.baseUrl}/#/pages/band/create`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '04-band-create');
  
  // 检查关键元素
  await checkElement(page, '.nav-title', '页面标题');
  await checkElement(page, 'input[placeholder*="乐队名称"]', '乐队名称输入框');
  await checkElement(page, '.style-tag', '风格标签');
  await checkElement(page, 'textarea', '简介输入框');
  await checkElement(page, 'text=创建乐队', '创建按钮');
}

async function testActivityListPage(page) {
  console.log('\n5️⃣ 测试活动列表页...');
  await page.goto(`${config.baseUrl}/#/pages/activity/list`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '05-activity-list');
  
  // 检查关键元素
  await checkElement(page, '.nav-title', '页面标题');
  await checkElement(page, '.filter-scroll', '筛选区域');
  await checkElement(page, '.activity-card', '活动卡片');
}

async function testSquarePage(page) {
  console.log('\n6️⃣ 测试广场页...');
  await page.goto(`${config.baseUrl}/#/pages/square/index`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '06-square-page');
  
  // 检查关键元素
  await checkElement(page, '.tab-item, .square-tab', 'Tab切换');
  await checkElement(page, '.post-card, .square-item', '动态卡片');
}

async function testUserPage(page) {
  console.log('\n7️⃣ 测试个人中心页...');
  await page.goto(`${config.baseUrl}/#/pages/user/index`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '07-user-page');
  
  // 检查关键元素
  await checkElement(page, '.user-info, .user-avatar', '用户信息');
  await checkElement(page, '.menu-item', '菜单项');
}

async function testSearchPage(page) {
  console.log('\n8️⃣ 测试搜索页...');
  await page.goto(`${config.baseUrl}/#/pages/search/index`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '08-search-page');
  
  // 检查关键元素
  await checkElement(page, 'input', '搜索输入框');
}

async function testRecruitPage(page) {
  console.log('\n9️⃣ 测试招募列表页...');
  await page.goto(`${config.baseUrl}/#/pages/recruit/list`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '09-recruit-list');
  
  // 检查关键元素
  await checkElement(page, '.filter-tags, .instrument-tags', '乐器筛选');
  await checkElement(page, '.recruit-card', '招募卡片');
}

async function testMarketPage(page) {
  console.log('\n🔟 测试市场列表页...');
  await page.goto(`${config.baseUrl}/#/pages/market/list`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '10-market-list');
  
  // 检查关键元素
  await checkElement(page, '.filter-tags, .category-tags', '商品分类');
  await checkElement(page, '.product-card, .market-item', '商品卡片');
}

async function testRoomPage(page) {
  console.log('\n1️⃣1️⃣ 测试排练室列表页...');
  await page.goto(`${config.baseUrl}/#/pages/room/list`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '11-room-list');
  
  // 检查关键元素
  await checkElement(page, '.city-btns, .city-tags', '城市筛选');
  await checkElement(page, '.room-card', '排练室卡片');
}

async function runPrototypeComparisonTests() {
  console.log('='.repeat(70));
  console.log('🎨 开始 Gojica 页面与原型图对比测试');
  console.log('='.repeat(70));
  console.log(`📍 测试地址: ${config.baseUrl}`);
  console.log(`📁 截图目录: ${testResultsDir}`);
  console.log('='.repeat(70));
  
  let browser;
  
  try {
    console.log('\n🔧 启动 Chrome 浏览器...');
    browser = await chromium.launch({
      channel: "chrome",
      headless: false,
      slowMo: 100
    });
    
    const context = await browser.newContext({
      viewport: config.viewport
    });
    
    const page = await context.newPage();
    
    // 运行所有测试
    await testLoginPage(page);
    await testHomePage(page);
    await testBandListPage(page);
    await testBandCreatePage(page);
    await testActivityListPage(page);
    await testSquarePage(page);
    await testUserPage(page);
    await testSearchPage(page);
    await testRecruitPage(page);
    await testMarketPage(page);
    await testRoomPage(page);
    
    // 生成报告
    console.log('\n' + '='.repeat(70));
    console.log('📊 测试结果总结');
    console.log('='.repeat(70));
    
    console.log('\n✅ 通过的检查:');
    results.passed.forEach(item => {
      console.log(`  ✓ ${item.description}: ${item.status}`);
    });
    
    console.log('\n⚠️ 警告/缺失:');
    results.warnings.forEach(item => {
      console.log(`  ⚠ ${item.description}: ${item.status}`);
    });
    
    console.log('\n❌ 失败的检查:');
    if (results.failed.length > 0) {
      results.failed.forEach(item => {
        console.log(`  ✗ ${item.description}: ${item.error}`);
      });
    } else {
      console.log('  无');
    }
    
    console.log('\n📸 截图已保存到:', testResultsDir);
    
    console.log('\n' + '='.repeat(70));
    console.log('🎨 页面与原型图对比测试完成！');
    console.log('='.repeat(70));
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    if (browser) {
      await browser.close();
    }
  }
}

runPrototypeComparisonTests();
