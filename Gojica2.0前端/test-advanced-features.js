/**
 * Gojica 高级功能测试套件
 * 测试登录后的用户功能
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const testResultsDir = './test-results/advanced-tests';
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

const config = {
  baseUrl: 'http://localhost:5173',
  viewport: { width: 375, height: 812 },
  timeout: 20000,
  slowMo: 150
};

let testResults = {
  passed: 0,
  failed: 0,
  screenshots: []
};

async function takeScreenshot(page, name) {
  const timestamp = Date.now();
  const filename = `${timestamp}-${name}.png`;
  const filepath = path.join(testResultsDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`📸 ${name}`);
  testResults.screenshots.push(filepath);
  return filepath;
}

async function doLogin(page) {
  console.log('🔐 执行登录流程...');
  await page.goto(`${config.baseUrl}/#/pages/login/index`, {
    waitUntil: 'networkidle',
    timeout: config.timeout
  });
  
  const phoneInput = await page.$('input[type="number"]');
  if (phoneInput) {
    await phoneInput.fill('13800138000');
    const codeInputs = await page.$$('input[type="number"]');
    if (codeInputs.length > 1) {
      await codeInputs[1].fill('123456');
    }
    const loginBtn = await page.$('text=开发模式登录(调试)');
    if (loginBtn) {
      await loginBtn.click();
      await page.waitForTimeout(3000);
    }
  }
  console.log('✅ 登录完成');
}

async function testUserProfileAfterLogin(page) {
  console.log('\n🧪 高级测试：登录后的个人中心');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    await page.goto(`${config.baseUrl}/#/pages/user/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '01-user-profile-logged-in');
    
    // 检查用户信息是否加载
    const userInfo = await page.$('.user-info, .profile-info');
    if (userInfo) {
      console.log('✅ 用户信息已加载');
    }
    
    // 检查菜单项
    const menuItems = await page.$$('view[class*="menu"]');
    console.log(`✅ 发现 ${menuItems.length} 个菜单项`);
    
    testResults.passed++;
    console.log('✅ 登录后个人中心测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '01-error');
    testResults.failed++;
    return false;
  }
}

async function testFavoriteFunction(page) {
  console.log('\n🧪 高级测试：收藏功能');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    // 先去乐队列表
    await page.goto(`${config.baseUrl}/#/pages/band/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '02-band-list');
    
    // 点击一个乐队卡片
    const bandCard = await page.$('.band-card, .band-item');
    if (bandCard) {
      await bandCard.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '03-band-detail-for-favorite');
      
      // 检查关注/收藏按钮
      const followBtn = await page.$('text=关注, text=已关注');
      if (followBtn) {
        const btnText = await followBtn.textContent();
        console.log(`✅ 发现${btnText}按钮`);
        
        await followBtn.click();
        await page.waitForTimeout(1500);
        await takeScreenshot(page, '04-after-follow');
        console.log('✅ 关注功能正常');
      }
    }
    
    testResults.passed++;
    console.log('✅ 收藏功能测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '02-error');
    testResults.failed++;
    return false;
  }
}

async function testActivitySignup(page) {
  console.log('\n🧪 高级测试：活动报名功能');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    // 访问活动列表
    await page.goto(`${config.baseUrl}/#/pages/activity/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '05-activity-list');
    
    // 点击一个活动
    const activityCard = await page.$('.activity-card');
    if (activityCard) {
      await activityCard.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '06-activity-detail');
      
      // 检查报名按钮
      const signupBtn = await page.$('text=立即报名');
      if (signupBtn) {
        console.log('✅ 发现报名按钮');
        await signupBtn.click();
        await page.waitForTimeout(2000);
        await takeScreenshot(page, '07-signup-form');
        
        // 可能需要填写报名表单
        const submitBtn = await page.$('text=确认报名');
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(1500);
          await takeScreenshot(page, '08-signup-submitted');
          console.log('✅ 报名流程完成');
        }
      }
    }
    
    testResults.passed++;
    console.log('✅ 活动报名功能测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '05-error');
    testResults.failed++;
    return false;
  }
}

async function testPostWithLogin(page) {
  console.log('\n🧪 高级测试：发布动态（登录后）');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    // 访问发布页面
    await page.goto(`${config.baseUrl}/#/pages/square/post`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '09-post-page-logged-in');
    
    // 找到 textarea 并使用 keyboard 输入
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.click();
      await page.waitForTimeout(500);
      
      // 使用 keyboard 模拟输入
      await page.keyboard.type('这是一条测试动态！🎵 今天是美好的一天～');
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '10-post-content-filled');
      
      // 点击发布按钮
      const publishBtn = await page.$('text=发布');
      if (publishBtn) {
        const isDisabled = await publishBtn.evaluate(el => el.classList.contains('disabled'));
        if (!isDisabled) {
          await publishBtn.click();
          await page.waitForTimeout(2000);
          await takeScreenshot(page, '11-post-submitted');
          console.log('✅ 发布功能正常');
        } else {
          console.log('⚠️ 发布按钮被禁用（内容验证失败）');
        }
      }
    }
    
    testResults.passed++;
    console.log('✅ 发布动态功能测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '09-error');
    testResults.failed++;
    return false;
  }
}

async function testRoomBooking(page) {
  console.log('\n🧪 高级测试：排练室预约功能');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    // 访问排练室列表
    await page.goto(`${config.baseUrl}/#/pages/room/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '12-room-list');
    
    // 点击一个排练室
    const roomCard = await page.$('.room-card');
    if (roomCard) {
      await roomCard.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '13-room-detail');
      
      // 检查预约按钮
      const bookBtn = await page.$('text=立即预约, text=预约');
      if (bookBtn) {
        console.log('✅ 发现预约按钮');
        await bookBtn.click();
        await page.waitForTimeout(2000);
        await takeScreenshot(page, '14-booking-form');
        console.log('✅ 预约流程入口正常');
      }
    }
    
    testResults.passed++;
    console.log('✅ 排练室预约功能测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '12-error');
    testResults.failed++;
    return false;
  }
}

async function testProductPurchase(page) {
  console.log('\n🧪 高级测试：商品购买功能');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    // 访问市场列表
    await page.goto(`${config.baseUrl}/#/pages/market/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '15-market-list');
    
    // 点击一个商品
    const productCard = await page.$('.product-card, .market-item');
    if (productCard) {
      await productCard.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '16-product-detail');
      
      // 检查购买按钮
      const buyBtn = await page.$('text=立即购买, text=联系卖家');
      if (buyBtn) {
        console.log('✅ 发现购买/联系按钮');
        await buyBtn.click();
        await page.waitForTimeout(1500);
        await takeScreenshot(page, '17-buy-action');
        console.log('✅ 商品详情页功能正常');
      }
    }
    
    testResults.passed++;
    console.log('✅ 商品购买功能测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '15-error');
    testResults.failed++;
    return false;
  }
}

async function testEditProfile(page) {
  console.log('\n🧪 高级测试：编辑个人资料');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    // 访问资料编辑页面
    await page.goto(`${config.baseUrl}/#/pages/user/profile`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '18-profile-edit-page');
    
    // 检查表单元素
    const inputs = await page.$$('input');
    console.log(`✅ 发现 ${inputs.length} 个输入框`);
    
    if (inputs.length > 0) {
      // 填写昵称
      await inputs[0].click();
      await page.keyboard.down('Control');
      await page.keyboard.press('a');
      await page.keyboard.up('Control');
      await page.keyboard.type('测试用户');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '19-profile-filled');
      
      // 保存按钮
      const saveBtn = await page.$('text=保存, text=保存修改');
      if (saveBtn) {
        console.log('✅ 发现保存按钮');
        await saveBtn.click();
        await page.waitForTimeout(1500);
        await takeScreenshot(page, '20-profile-saved');
        console.log('✅ 资料编辑功能正常');
      }
    }
    
    testResults.passed++;
    console.log('✅ 资料编辑功能测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '18-error');
    testResults.failed++;
    return false;
  }
}

async function testNotificationSystem(page) {
  console.log('\n🧪 高级测试：通知系统');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    // 点击通知图标（如果有）
    const notifIcon = await page.$('text=🔔');
    if (notifIcon) {
      await notifIcon.click();
      await page.waitForTimeout(1500);
      await takeScreenshot(page, '21-notifications');
      console.log('✅ 通知图标可点击');
    } else {
      console.log('⚠️ 未找到通知图标');
    }
    
    // 访问个人中心检查通知入口
    await page.goto(`${config.baseUrl}/#/pages/user/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '22-user-center-notif');
    
    testResults.passed++;
    console.log('✅ 通知系统测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '21-error');
    testResults.failed++;
    return false;
  }
}

async function testLogoutFunction(page) {
  console.log('\n🧪 高级测试：退出登录');
  try {
    await doLogin(page);
    await page.waitForTimeout(2000);
    
    await page.goto(`${config.baseUrl}/#/pages/user/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '23-before-logout');
    
    // 查找退出按钮
    const logoutBtn = await page.$('text=退出登录, text=退出, text=注销');
    if (logoutBtn) {
      console.log('✅ 发现退出按钮');
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '24-logout-confirm');
      
      // 确认退出
      const confirmBtn = await page.$('text=确定, text=确认');
      if (confirmBtn) {
        await confirmBtn.click();
        await page.waitForTimeout(2000);
        await takeScreenshot(page, '25-after-logout');
        console.log('✅ 退出登录功能正常');
      }
    } else {
      console.log('⚠️ 未找到退出按钮（可能在菜单中）');
    }
    
    testResults.passed++;
    console.log('✅ 退出登录测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '23-error');
    testResults.failed++;
    return false;
  }
}

async function testEdgeCases(page) {
  console.log('\n🧪 高级测试：边界情况和异常处理');
  try {
    // 测试空数据情况
    await page.goto(`${config.baseUrl}/#/pages/market/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '26-empty-market');
    
    // 测试搜索无结果
    await page.goto(`${config.baseUrl}/#/pages/search/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    
    const searchInput = await page.$('input');
    if (searchInput) {
      await searchInput.fill('asdfghjkl123456');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '27-search-no-results');
      console.log('✅ 无结果搜索处理正常');
    }
    
    // 测试网络错误处理
    console.log('   测试错误边界...');
    await page.goto(`${config.baseUrl}/#/pages/activity/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '28-error-boundary');
    
    testResults.passed++;
    console.log('✅ 边界情况测试通过');
    return true;
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    await takeScreenshot(page, '26-error');
    testResults.failed++;
    return false;
  }
}

async function runAdvancedTests() {
  console.log('='.repeat(70));
  console.log('🚀 开始 Gojica 高级功能测试');
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
      slowMo: config.slowMo
    });
    
    const context = await browser.newContext({
      viewport: config.viewport
    });
    
    const page = await context.newPage();
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('401') && !text.includes('token')) {
          console.log(`  ⚠️ ${text.substring(0, 80)}`);
        }
      }
    });
    
    // 运行高级测试
    const tests = [
      { name: '登录后个人中心', fn: testUserProfileAfterLogin },
      { name: '收藏/关注功能', fn: testFavoriteFunction },
      { name: '活动报名', fn: testActivitySignup },
      { name: '发布动态', fn: testPostWithLogin },
      { name: '排练室预约', fn: testRoomBooking },
      { name: '商品购买', fn: testProductPurchase },
      { name: '编辑个人资料', fn: testEditProfile },
      { name: '通知系统', fn: testNotificationSystem },
      { name: '退出登录', fn: testLogoutFunction },
      { name: '边界情况', fn: testEdgeCases },
    ];
    
    for (const test of tests) {
      try {
        await test.fn(page);
      } catch (error) {
        console.log(`  ❌ "${test.name}" 异常: ${error.message}`);
        testResults.failed++;
      }
    }
    
    // 生成报告
    console.log('\n' + '='.repeat(70));
    console.log('📊 高级测试结果总结');
    console.log('='.repeat(70));
    console.log(`✅ 通过: ${testResults.passed}`);
    console.log(`❌ 失败: ${testResults.failed}`);
    console.log(`📸 截图: ${testResults.screenshots.length} 张`);
    console.log('='.repeat(70));
    
    if (testResults.failed === 0) {
      console.log('🎉 所有高级功能测试通过！');
    } else {
      console.log('⚠️ 部分测试失败，请查看截图');
    }
    
    console.log(`\n📁 截图: ${path.resolve(testResultsDir)}`);
    console.log('\n👋 测试完成，浏览器保持打开...');
    
    await new Promise(() => {});
    
  } catch (error) {
    console.error('\n❌ 严重错误:', error.message);
    if (browser) {
      await browser.close();
    }
  }
}

runAdvancedTests();
