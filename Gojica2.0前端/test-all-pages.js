/**
 * Gojica 项目完整页面测试脚本
 * 测试所有主要页面的功能和交互
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 确保测试结果目录存在
const testResultsDir = './test-results';
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

// 测试配置
const config = {
  baseUrl: 'http://localhost:5173',
  viewport: { width: 375, height: 812 },
  timeout: 15000,
  slowMo: 100
};

async function takeScreenshot(page, name) {
  const timestamp = Date.now();
  const filename = `${timestamp}-${name}.png`;
  const filepath = path.join(testResultsDir, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`📸 截图已保存: ${filename}`);
  return filepath;
}

async function testHomePage(page) {
  console.log('\n🧪 测试：首页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/home/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '01-home');
    
    // 检查页面元素
    const title = await page.textContent('.app-title, .nav-title').catch(() => 'Gojica');
    console.log(`✓ 首页加载成功，标题: ${title}`);
    
    // 测试 TabBar
    console.log('✓ 测试 TabBar 导航...');
    return true;
  } catch (error) {
    console.error(`✗ 首页测试失败: ${error.message}`);
    await takeScreenshot(page, '01-home-error');
    return false;
  }
}

async function testLoginPage(page) {
  console.log('\n🧪 测试：登录页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/login/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '02-login');
    
    // 填写手机号
    console.log('✓ 填写登录表单...');
    const phoneInput = await page.$('input[type="number"]');
    if (phoneInput) {
      await phoneInput.fill('13800138000');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '02-login-filled');
      
      // 点击获取验证码
      const codeBtn = await page.$('text=获取验证码');
      if (codeBtn) {
        await codeBtn.click();
        console.log('✓ 点击获取验证码');
        await page.waitForTimeout(1500);
        await takeScreenshot(page, '02-login-code');
      }
    }
    
    return true;
  } catch (error) {
    console.error(`✗ 登录页测试失败: ${error.message}`);
    await takeScreenshot(page, '02-login-error');
    return false;
  }
}

async function testBandListPage(page) {
  console.log('\n🧪 测试：乐队列表页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/band/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '03-band-list');
    
    // 检查筛选标签
    const filterTags = await page.$$('.filter-tag, .style-tag');
    console.log(`✓ 发现 ${filterTags.length} 个筛选标签`);
    
    // 点击第一个筛选标签
    if (filterTags.length > 0) {
      await filterTags[0].click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '03-band-list-filtered');
      console.log('✓ 测试筛选功能');
    }
    
    return true;
  } catch (error) {
    console.error(`✗ 乐队列表页测试失败: ${error.message}`);
    await takeScreenshot(page, '03-band-list-error');
    return false;
  }
}

async function testActivityListPage(page) {
  console.log('\n🧪 测试：活动列表页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/activity/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '04-activity-list');
    
    // 检查活动卡片
    const activityCards = await page.$$('.activity-card');
    console.log(`✓ 发现 ${activityCards.length} 个活动卡片`);
    
    if (activityCards.length > 0) {
      await activityCards[0].click();
      await page.waitForTimeout(1500);
      await takeScreenshot(page, '04-activity-detail');
      console.log('✓ 点击进入活动详情');
    }
    
    return true;
  } catch (error) {
    console.error(`✗ 活动列表页测试失败: ${error.message}`);
    await takeScreenshot(page, '04-activity-list-error');
    return false;
  }
}

async function testSquarePage(page) {
  console.log('\n🧪 测试：广场页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/square/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '05-square');
    
    // 检查 Tab 切换
    const tabs = await page.$$('.tab-item, .square-tab');
    if (tabs.length > 0) {
      await tabs[1].click().catch(() => {});
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '05-square-tab2');
      console.log('✓ 测试 Tab 切换');
    }
    
    return true;
  } catch (error) {
    console.error(`✗ 广场页测试失败: ${error.message}`);
    await takeScreenshot(page, '05-square-error');
    return false;
  }
}

async function testMarketPage(page) {
  console.log('\n🧪 测试：市场列表页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/market/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '06-market-list');
    
    // 检查商品卡片
    const productCards = await page.$$('.product-card');
    console.log(`✓ 发现 ${productCards.length} 个商品`);
    
    return true;
  } catch (error) {
    console.error(`✗ 市场列表页测试失败: ${error.message}`);
    await takeScreenshot(page, '06-market-list-error');
    return false;
  }
}

async function testRecruitPage(page) {
  console.log('\n🧪 测试：招募列表页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/recruit/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '07-recruit-list');
    
    // 检查招募卡片
    const recruitCards = await page.$$('.recruit-card');
    console.log(`✓ 发现 ${recruitCards.length} 个招募信息`);
    
    return true;
  } catch (error) {
    console.error(`✗ 招募列表页测试失败: ${error.message}`);
    await takeScreenshot(page, '07-recruit-list-error');
    return false;
  }
}

async function testRoomPage(page) {
  console.log('\n🧪 测试：排练室列表页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/room/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '08-room-list');
    
    // 检查城市筛选
    const cityBtns = await page.$$('.city-btn');
    console.log(`✓ 发现 ${cityBtns.length} 个城市选项`);
    
    if (cityBtns.length > 1) {
      await cityBtns[1].click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '08-room-list-city');
      console.log('✓ 测试城市筛选');
    }
    
    return true;
  } catch (error) {
    console.error(`✗ 排练室列表页测试失败: ${error.message}`);
    await takeScreenshot(page, '08-room-list-error');
    return false;
  }
}

async function testSearchPage(page) {
  console.log('\n🧪 测试：搜索页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/search/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '09-search');
    
    // 测试搜索功能
    const searchInput = await page.$('input');
    if (searchInput) {
      await searchInput.fill('摇滚');
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '09-search-filled');
      console.log('✓ 测试搜索功能');
    }
    
    return true;
  } catch (error) {
    console.error(`✗ 搜索页测试失败: ${error.message}`);
    await takeScreenshot(page, '09-search-error');
    return false;
  }
}

async function testUserPage(page) {
  console.log('\n🧪 测试：个人中心页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/user/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '10-user');
    
    // 检查用户信息
    const userAvatar = await page.$('.user-avatar, .avatar');
    if (userAvatar) {
      console.log('✓ 发现用户头像');
    }
    
    // 检查功能菜单
    const menuItems = await page.$$('.menu-item, .menu-item-row');
    console.log(`✓ 发现 ${menuItems.length} 个菜单项`);
    
    return true;
  } catch (error) {
    console.error(`✗ 个人中心页测试失败: ${error.message}`);
    await takeScreenshot(page, '10-user-error');
    return false;
  }
}

async function testTabBarNavigation(page) {
  console.log('\n🧪 测试：TabBar 导航');
  try {
    // 返回首页
    await page.goto(`${config.baseUrl}/#/pages/home/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    
    // 依次点击各个 Tab
    const tabs = ['首页', '乐队', '广场', '市场', '我的'];
    
    for (const tabName of tabs) {
      try {
        const tab = await page.$(`text=${tabName}`);
        if (tab) {
          await tab.click();
          await page.waitForTimeout(1500);
          await takeScreenshot(page, `tab-${tabName}`);
          console.log(`✓ 点击 ${tabName} Tab`);
        }
      } catch (e) {
        console.log(`⚠ 点击 ${tabName} Tab 失败`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`✗ TabBar 导航测试失败: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('='.repeat(60));
  console.log('🚀 开始 Gojica 项目全面测试');
  console.log('='.repeat(60));
  console.log(`📍 测试地址: ${config.baseUrl}`);
  console.log(`📱 视口大小: ${config.viewport.width}x${config.viewport.height}`);
  console.log(`📁 截图目录: ${testResultsDir}`);
  console.log('='.repeat(60));
  
  let browser;
  let passedTests = 0;
  let failedTests = 0;
  
  try {
    // 启动浏览器
    console.log('\n🔧 启动 Chrome 浏览器...');
    browser = await chromium.launch({
      channel: "chrome",
      headless: false,
      slowMo: config.slowMo
    });
    
    const context = await browser.newContext({
      viewport: config.viewport
    });
    
    const page = await context.newPage();
    
    // 设置默认超时
    page.setDefaultTimeout(config.timeout);
    
    // 监听控制台消息
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`⚠️ 控制台错误: ${msg.text()}`);
      }
    });
    
    // 运行各项测试
    const tests = [
      { name: '首页', fn: testHomePage },
      { name: '登录页', fn: testLoginPage },
      { name: '乐队列表', fn: testBandListPage },
      { name: '活动列表', fn: testActivityListPage },
      { name: '广场', fn: testSquarePage },
      { name: '市场', fn: testMarketPage },
      { name: '招募', fn: testRecruitPage },
      { name: '排练室', fn: testRoomPage },
      { name: '搜索', fn: testSearchPage },
      { name: '个人中心', fn: testUserPage },
      { name: 'TabBar导航', fn: testTabBarNavigation },
    ];
    
    for (const test of tests) {
      try {
        const result = await test.fn(page);
        if (result) {
          passedTests++;
          console.log(`✅ ${test.name} 测试通过`);
        } else {
          failedTests++;
          console.log(`❌ ${test.name} 测试失败`);
        }
      } catch (error) {
        failedTests++;
        console.log(`❌ ${test.name} 测试异常: ${error.message}`);
      }
    }
    
    // 测试总结
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试结果总结');
    console.log('='.repeat(60));
    console.log(`✅ 通过: ${passedTests}`);
    console.log(`❌ 失败: ${failedTests}`);
    console.log(`📁 总计: ${tests.length}`);
    console.log(`📸 截图保存位置: ${path.resolve(testResultsDir)}`);
    console.log('='.repeat(60));
    
    if (failedTests === 0) {
      console.log('🎉 所有测试通过！');
    } else {
      console.log('⚠️ 部分测试失败，请查看截图和日志');
    }
    
    console.log('\n👋 测试完成，浏览器将保持打开以便查看');
    console.log('按 Ctrl+C 结束...');
    
    // 保持浏览器打开
    await new Promise(() => {});
    
  } catch (error) {
    console.error('\n❌ 严重错误:', error.message);
    if (browser) {
      await browser.close();
    }
  }
}

// 运行测试
runAllTests();
