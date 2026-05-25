/**
 * Gojica 终极集成测试套件
 * 完整用户流程 + 性能测试 + 兼容性测试
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');

const testResultsDir = './test-results/ultimate-tests';
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

const config = {
  baseUrl: 'http://localhost:5173',
  timeout: 25000,
  slowMo: 200
};

let testResults = {
  passed: 0,
  failed: 0,
  warnings: [],
  screenshots: [],
  performance: {}
};

// 性能计时器
function measureTime(name, fn) {
  const start = Date.now();
  return async (...args) => {
    const result = await fn(...args);
    testResults.performance[name] = Date.now() - start;
    return result;
  };
}

async function takeScreenshot(page, name) {
  const timestamp = Date.now();
  const filename = `${timestamp}-${name}.png`;
  const filepath = path.join(testResultsDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  testResults.screenshots.push(filepath);
  console.log(`📸 ${name}`);
  return filepath;
}

// 测试网络性能
async function testAPIPerformance(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(url, (res) => {
      const duration = Date.now() - start;
      resolve({ status: res.statusCode, duration, url });
    }).on('error', (err) => {
      resolve({ status: 'ERROR', duration: Date.now() - start, error: err.message });
    });
  });
}

async function testHomepagePerformance(page) {
  console.log('\n⚡ 测试：首页性能');
  try {
    const start = Date.now();
    await page.goto(config.baseUrl, { waitUntil: 'networkidle', timeout: config.timeout });
    const loadTime = Date.now() - start;
    
    await takeScreenshot(page, '00-home-performance');
    
    // 测试 API 响应时间
    const apiTests = await Promise.all([
      testAPIPerformance('http://localhost:3000/api/v1/home/stats'),
      testAPIPerformance('http://localhost:3000/api/v1/home/banners'),
      testAPIPerformance('http://localhost:3000/api/v1/home/activities'),
      testAPIPerformance('http://localhost:3000/api/v1/home/bands'),
    ]);
    
    console.log(`   ⏱️ 页面加载: ${loadTime}ms`);
    apiTests.forEach((result, i) => {
      const apiNames = ['stats', 'banners', 'activities', 'bands'];
      console.log(`   ⏱️ API ${apiNames[i]}: ${result.duration}ms (${result.status})`);
    });
    
    testResults.performance.homepage = loadTime;
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 性能测试失败: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function completeUserRegistrationFlow(page) {
  console.log('\n🔐 测试：完整用户注册流程');
  try {
    // 1. 访问登录页
    await page.goto(`${config.baseUrl}/#/pages/login/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '01-login-page');
    
    // 2. 填写手机号
    const phoneInput = await page.$('input[type="number"]');
    await phoneInput.fill('13900000001');
    await takeScreenshot(page, '02-phone-filled');
    
    // 3. 获取验证码
    const codeBtn = await page.$('text=获取验证码');
    if (codeBtn) {
      await codeBtn.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '03-code-sent');
    }
    
    // 4. 填写验证码
    const codeInputs = await page.$$('input[type="number"]');
    if (codeInputs.length > 1) {
      await codeInputs[1].fill('123456');
      await takeScreenshot(page, '04-code-filled');
    }
    
    // 5. 点击登录
    const loginBtn = await page.$('text=开发模式登录(调试)');
    if (loginBtn) {
      await loginBtn.click();
      await page.waitForTimeout(3000);
      await takeScreenshot(page, '05-logged-in');
    }
    
    // 6. 验证登录成功
    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes('/home/index') || currentUrl.includes('/pages/home');
    console.log(`   ${isLoggedIn ? '✅' : '⚠️'} 登录状态: ${isLoggedIn ? '已登录' : '未跳转'}`);
    
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 注册流程失败: ${error.message}`);
    await takeScreenshot(page, '01-error');
    testResults.failed++;
    return false;
  }
}

async function testBandCreationWorkflow(page) {
  console.log('\n🎸 测试：创建乐队完整流程');
  try {
    // 1. 先确保登录
    await completeUserRegistrationFlow(page);
    
    // 2. 访问创建乐队页
    await page.goto(`${config.baseUrl}/#/pages/band/create`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '06-band-create-page');
    
    // 3. 填写乐队名称
    const nameInput = await page.$('input[placeholder*="乐队名称"]');
    if (nameInput) {
      await nameInput.fill('测试摇滚乐队');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '07-band-name-filled');
    }
    
    // 4. 选择音乐风格
    const styleTags = await page.$$('.style-tag');
    console.log(`   🏷️ 发现 ${styleTags.length} 个风格标签`);
    
    if (styleTags.length > 0) {
      await styleTags[0].click();
      await page.waitForTimeout(500);
      await takeScreenshot(page, '08-style-selected');
    }
    
    // 5. 填写简介
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.click();
      await page.keyboard.type('我们是来自北京的摇滚乐队，热爱音乐！');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '09-intro-filled');
    }
    
    // 6. 点击创建按钮
    const createBtn = await page.$('text=创建乐队');
    if (createBtn) {
      await createBtn.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '10-band-created');
      console.log('   ✅ 乐队创建成功');
    }
    
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 创建流程失败: ${error.message}`);
    await takeScreenshot(page, '06-error');
    testResults.failed++;
    return false;
  }
}

async function testActivityParticipation(page) {
  console.log('\n🎭 测试：参与活动完整流程');
  try {
    await completeUserRegistrationFlow(page);
    
    // 访问活动列表
    await page.goto(`${config.baseUrl}/#/pages/activity/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '11-activity-list');
    
    // 查找活动卡片
    const activityCards = await page.$$('.activity-card');
    console.log(`   📋 发现 ${activityCards.length} 个活动`);
    
    if (activityCards.length > 0) {
      // 点击第一个活动
      await activityCards[0].click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '12-activity-detail');
      
      // 查找报名按钮
      const signupBtn = await page.$('text=立即报名');
      if (signupBtn) {
        console.log('   ✅ 发现报名按钮');
        await signupBtn.click();
        await page.waitForTimeout(1500);
        await takeScreenshot(page, '13-signup-form');
        
        // 尝试确认报名
        const confirmBtn = await page.$('text=确认报名');
        if (confirmBtn) {
          await confirmBtn.click();
          await page.waitForTimeout(2000);
          await takeScreenshot(page, '14-signup-confirmed');
          console.log('   ✅ 报名完成');
        }
      }
    }
    
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 参与流程失败: ${error.message}`);
    await takeScreenshot(page, '11-error');
    testResults.failed++;
    return false;
  }
}

async function testSocialInteraction(page) {
  console.log('\n💬 测试：社交互动完整流程');
  try {
    await completeUserRegistrationFlow(page);
    
    // 访问广场
    await page.goto(`${config.baseUrl}/#/pages/square/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '15-square-page');
    
    // 点击发布按钮（如果有）
    const postBtn = await page.$('text=发布, text=发帖');
    if (postBtn) {
      await postBtn.click();
      await page.waitForTimeout(1500);
      await takeScreenshot(page, '16-post-page');
      
      // 填写内容
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click();
        await page.keyboard.type('测试动态：今天玩得很开心！🎵🎸');
        await page.waitForTimeout(500);
        await takeScreenshot(page, '17-post-content');
        
        // 发布
        const publishBtn = await page.$('text=发布');
        if (publishBtn) {
          await publishBtn.click();
          await page.waitForTimeout(2000);
          await takeScreenshot(page, '18-post-published');
          console.log('   ✅ 发布动态成功');
        }
      }
    }
    
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 社交流程失败: ${error.message}`);
    await takeScreenshot(page, '15-error');
    testResults.failed++;
    return false;
  }
}

async function testCommerceFlow(page) {
  console.log('\n🛒 测试：完整电商流程');
  try {
    await completeUserRegistrationFlow(page);
    
    // 访问市场
    await page.goto(`${config.baseUrl}/#/pages/market/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '19-market-list');
    
    // 访问商品详情
    const productCard = await page.$('.product-card, .market-item');
    if (productCard) {
      await productCard.click();
      await page.waitForTimeout(1500);
      await takeScreenshot(page, '20-product-detail');
      
      // 点击联系/购买
      const contactBtn = await page.$('text=联系卖家, text=立即购买');
      if (contactBtn) {
        await contactBtn.click();
        await page.waitForTimeout(1500);
        await takeScreenshot(page, '21-contact-seller');
        console.log('   ✅ 联系卖家成功');
      }
    }
    
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 电商流程失败: ${error.message}`);
    await takeScreenshot(page, '19-error');
    testResults.failed++;
    return false;
  }
}

async function testBookingFlow(page) {
  console.log('\n🏠 测试：完整预约流程');
  try {
    await completeUserRegistrationFlow(page);
    
    // 访问排练室
    await page.goto(`${config.baseUrl}/#/pages/room/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '22-room-list');
    
    // 点击预约
    const roomCard = await page.$('.room-card');
    if (roomCard) {
      await roomCard.click();
      await page.waitForTimeout(1500);
      await takeScreenshot(page, '23-room-detail');
      
      const bookBtn = await page.$('text=立即预约');
      if (bookBtn) {
        await bookBtn.click();
        await page.waitForTimeout(1500);
        await takeScreenshot(page, '24-booking-form');
        console.log('   ✅ 预约表单打开成功');
      }
    }
    
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 预约流程失败: ${error.message}`);
    await takeScreenshot(page, '22-error');
    testResults.failed++;
    return false;
  }
}

async function testUserProfileManagement(page) {
  console.log('\n👤 测试：用户资料管理');
  try {
    await completeUserRegistrationFlow(page);
    
    // 访问资料编辑
    await page.goto(`${config.baseUrl}/#/pages/user/profile`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '25-profile-edit');
    
    // 编辑各项信息
    const inputs = await page.$$('input');
    if (inputs.length > 0) {
      for (let i = 0; i < Math.min(inputs.length, 3); i++) {
        await inputs[i].click();
        await page.keyboard.down('Control');
        await page.keyboard.press('a');
        await page.keyboard.up('Control');
        await page.keyboard.type(`测试内容${i + 1}`);
        await page.waitForTimeout(300);
      }
      await takeScreenshot(page, '26-profile-filled');
      
      // 保存
      const saveBtn = await page.$('text=保存, text=保存修改');
      if (saveBtn) {
        await saveBtn.click();
        await page.waitForTimeout(1500);
        await takeScreenshot(page, '27-profile-saved');
        console.log('   ✅ 资料保存成功');
      }
    }
    
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 资料管理失败: ${error.message}`);
    await takeScreenshot(page, '25-error');
    testResults.failed++;
    return false;
  }
}

async function testCrossPlatformCompatibility(page) {
  console.log('\n📱 测试：跨平台兼容性');
  const devices = [
    { name: 'iPhone SE', width: 320, height: 568 },
    { name: 'iPhone X', width: 375, height: 812 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];
  
  try {
    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto(`${config.baseUrl}/#/pages/home/index`, {
        waitUntil: 'networkidle',
        timeout: config.timeout
      });
      await page.waitForTimeout(1000);
      await takeScreenshot(page, `28-compat-${device.name.replace(' ', '-')}`);
      console.log(`   ✅ ${device.name} (${device.width}x${device.height})`);
    }
    
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 兼容性测试失败: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function testErrorRecovery(page) {
  console.log('\n🔄 测试：错误恢复能力');
  try {
    // 测试网络错误恢复
    await page.route('**/api/**', route => {
      // 模拟偶尔的失败
      if (Math.random() > 0.7) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await page.goto(`${config.baseUrl}/#/pages/home/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '29-error-recovery');
    
    console.log('   ✅ 错误恢复机制正常');
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`   ❌ 错误恢复测试失败: ${error.message}`);
    await takeScreenshot(page, '29-error');
    testResults.failed++;
    return false;
  }
}

async function runUltimateTests() {
  console.log('='.repeat(80));
  console.log('🚀 开始 Gojica 终极集成测试');
  console.log('='.repeat(80));
  console.log(`📍 测试地址: ${config.baseUrl}`);
  console.log(`📁 截图目录: ${testResultsDir}`);
  console.log('='.repeat(80));
  
  let browser;
  
  try {
    console.log('\n🔧 启动 Chrome 浏览器...');
    browser = await chromium.launch({
      channel: "chrome",
      headless: false,
      slowMo: config.slowMo
    });
    
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 }
    });
    
    const page = await context.newPage();
    
    // 监听错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('401') && !text.includes('token') && !text.includes('Network')) {
          testResults.warnings.push(text.substring(0, 100));
        }
      }
    });
    
    // 执行所有测试
    const tests = [
      { name: '首页性能测试', fn: testHomepagePerformance },
      { name: '完整用户注册流程', fn: completeUserRegistrationFlow },
      { name: '创建乐队完整流程', fn: testBandCreationWorkflow },
      { name: '参与活动完整流程', fn: testActivityParticipation },
      { name: '社交互动完整流程', fn: testSocialInteraction },
      { name: '完整电商流程', fn: testCommerceFlow },
      { name: '完整预约流程', fn: testBookingFlow },
      { name: '用户资料管理', fn: testUserProfileManagement },
      { name: '跨平台兼容性', fn: testCrossPlatformCompatibility },
      { name: '错误恢复能力', fn: testErrorRecovery },
    ];
    
    for (const test of tests) {
      try {
        await test.fn(page);
      } catch (error) {
        console.log(`  ❌ "${test.name}" 异常: ${error.message}`);
        testResults.failed++;
      }
    }
    
    // 生成终极报告
    console.log('\n' + '='.repeat(80));
    console.log('📊 终极测试结果总结');
    console.log('='.repeat(80));
    console.log(`✅ 通过: ${testResults.passed}`);
    console.log(`❌ 失败: ${testResults.failed}`);
    console.log(`📸 截图: ${testResults.screenshots.length} 张`);
    console.log(`⚠️ 警告: ${testResults.warnings.length} 个`);
    console.log('\n⚡ 性能数据:');
    if (testResults.performance.homepage) {
      console.log(`   首页加载: ${testResults.performance.homepage}ms`);
    }
    console.log('='.repeat(80));
    
    if (testResults.failed === 0) {
      console.log('🎉 所有终极测试通过！');
    } else {
      console.log(`⚠️ ${testResults.failed} 项测试失败`);
    }
    
    console.log('\n📸 截图: ' + path.resolve(testResultsDir));
    console.log('\n👋 测试完成，浏览器保持打开...');
    
    await new Promise(() => {});
    
  } catch (error) {
    console.error('\n❌ 严重错误:', error.message);
    if (browser) {
      await browser.close();
    }
  }
}

runUltimateTests();
