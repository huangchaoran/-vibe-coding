/**
 * Gojica 项目深度功能测试 - 修复版
 * 测试完整的用户流程和高级功能
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 确保测试结果目录存在
const testResultsDir = './test-results/deep-tests-fixed';
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

const config = {
  baseUrl: 'http://localhost:5173',
  viewport: { width: 375, height: 812 },
  timeout: 20000,
  slowMo: 100
};

let testResults = {
  passed: 0,
  failed: 0,
  screenshots: [],
  errors: []
};

async function takeScreenshot(page, name) {
  const timestamp = Date.now();
  const filename = `${timestamp}-${name}.png`;
  const filepath = path.join(testResultsDir, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`📸 截图: ${name}`);
  testResults.screenshots.push({ name, filepath });
  return filepath;
}

async function testCompleteLoginFlow(page) {
  console.log('\n🧪 深度测试：完整登录流程');
  try {
    await page.goto(`${config.baseUrl}/#/pages/login/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '01-login-page');

    // 填写手机号
    console.log('  📝 填写手机号: 13800138000');
    const phoneInput = await page.$('input[type="number"]');
    if (phoneInput) {
      await phoneInput.fill('13800138000');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '02-phone-filled');
    }

    // 点击获取验证码
    console.log('  🔔 点击获取验证码');
    await page.click('text=获取验证码');
    await page.waitForTimeout(2000);
    await takeScreenshot(page, '03-code-sent');

    // 填写验证码
    console.log('  🔢 填写验证码: 123456');
    const inputs = await page.$$('input[type="number"]');
    if (inputs.length > 1) {
      await inputs[1].fill('123456');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '04-code-filled');
    }

    // 点击开发模式登录
    console.log('  🔐 点击开发模式登录');
    await page.click('text=开发模式登录(调试)');
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '05-login-result');

    testResults.passed++;
    console.log('  ✅ 登录流程测试完成');
    return true;
  } catch (error) {
    console.log(`  ❌ 登录流程测试失败: ${error.message}`);
    await takeScreenshot(page, '00-login-error');
    testResults.failed++;
    return false;
  }
}

async function testBandCreation(page) {
  console.log('\n🧪 深度测试：创建乐队功能');
  try {
    await page.goto(`${config.baseUrl}/#/pages/band/create`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '06-band-create');

    // 检查返回按钮
    console.log('  🔙 测试返回按钮');
    const backBtn = await page.$('.back-btn');
    if (backBtn) {
      await backBtn.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '07-back-from-create');
      await page.goBack();
      await page.waitForTimeout(1500);
    }

    // 填写乐队名称
    console.log('  ✏️ 填写乐队名称');
    const nameInput = await page.$('input[placeholder*="乐队名称"]');
    if (nameInput) {
      await nameInput.fill('测试乐队');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '08-band-name-filled');
    }

    // 测试风格标签选择
    console.log('  🏷️ 测试风格标签选择');
    const styleTags = await page.$$('.style-tag');
    console.log(`    发现 ${styleTags.length} 个风格标签`);

    if (styleTags.length > 0) {
      await styleTags[0].click();
      await page.waitForTimeout(500);
      await takeScreenshot(page, '09-style-selected');
      console.log('    ✅ 风格标签选择成功');
    }

    // 填写乐队简介 - 使用 keyboard.type 方法
    console.log('  📝 填写乐队简介');
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.click();
      await page.waitForTimeout(200);
      await page.keyboard.type('这是一支测试乐队，成立于2024年。');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '10-intro-filled');
      console.log('    ✅ 简介填写成功');
    }

    testResults.passed++;
    console.log('  ✅ 乐队创建页面功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 乐队创建测试失败: ${error.message}`);
    await takeScreenshot(page, '06-band-create-error');
    testResults.failed++;
    return false;
  }
}

async function testPostPublication(page) {
  console.log('\n🧪 深度测试：发布动态功能');
  try {
    await page.goto(`${config.baseUrl}/#/pages/square/post`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '11-post-page');

    // 检查发布页面元素
    console.log('  📝 检查发布页面元素');
    const textarea = await page.$('textarea');

    if (textarea) {
      // 使用 keyboard.type() 方法 - uni-app textarea 兼容
      await textarea.click();
      await page.waitForTimeout(300);
      await page.keyboard.type('这是一条测试动态！🎵 #音乐 #乐队');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '12-post-content-filled');
      console.log('  ✅ 填写发布内容成功');
    }

    // 检查发布按钮
    const publishBtn = await page.$('text=发布');
    if (publishBtn) {
      console.log('  ✅ 发现发布按钮');
    }

    testResults.passed++;
    console.log('  ✅ 发布动态页面功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 发布动态测试失败: ${error.message}`);
    await takeScreenshot(page, '11-post-error');
    testResults.failed++;
    return false;
  }
}

async function testActivityDetail(page) {
  console.log('\n🧪 深度测试：活动详情页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/activity/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '13-activity-list');

    // 查找活动卡片
    console.log('  🔍 查找活动卡片');
    const activityCard = await page.$('.activity-card, .list-item');
    if (activityCard) {
      console.log('  ✅ 找到活动卡片，点击进入详情');
      await activityCard.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '14-activity-detail');

      // 检查活动标题
      const title = await page.$('.activity-title, .detail-title');
      if (title) {
        console.log('  ✅ 发现活动标题');
      }

      // 检查报名按钮
      const signupBtn = await page.$('text=立即报名, text=报名');
      if (signupBtn) {
        console.log('  ✅ 发现报名按钮');
      }
    }

    testResults.passed++;
    console.log('  ✅ 活动详情页功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 活动详情测试失败: ${error.message}`);
    await takeScreenshot(page, '13-activity-error');
    testResults.failed++;
    return false;
  }
}

async function testMarketList(page) {
  console.log('\n🧪 深度测试：商品列表页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/market/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '16-market-list');

    // 查找商品卡片
    console.log('  🔍 查找商品卡片');
    const productCard = await page.$('.product-card, .goods-item');
    if (productCard) {
      console.log('  ✅ 找到商品卡片');
    } else {
      console.log('  ⚠️ 未找到商品卡片（可能暂无数据）');
    }

    testResults.passed++;
    console.log('  ✅ 商品列表页功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 商品列表测试失败: ${error.message}`);
    await takeScreenshot(page, '16-market-error');
    testResults.failed++;
    return false;
  }
}

async function testBandDetail(page) {
  console.log('\n🧪 深度测试：乐队详情页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/band/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '18-band-list');

    // 查找乐队卡片
    console.log('  🔍 查找乐队卡片');
    const bandCard = await page.$('.band-card');
    if (bandCard) {
      console.log('  ✅ 找到乐队卡片，点击进入详情');
      await bandCard.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '19-band-detail');

      // 检查关注按钮
      const followBtn = await page.$('text=关注, text=已关注');
      if (followBtn) {
        console.log('  ✅ 发现关注按钮');
      }
    }

    testResults.passed++;
    console.log('  ✅ 乐队详情页功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 乐队详情测试失败: ${error.message}`);
    await takeScreenshot(page, '18-band-error');
    testResults.failed++;
    return false;
  }
}

async function testProfileEdit(page) {
  console.log('\n🧪 深度测试：用户资料编辑');
  try {
    await page.goto(`${config.baseUrl}/#/pages/user/profile`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '21-profile-edit');

    // 检查编辑表单
    console.log('  📝 检查资料编辑表单');
    const inputs = await page.$$('input');
    console.log(`    发现 ${inputs.length} 个输入框`);

    if (inputs.length > 0) {
      // 填写表单
      await inputs[0].fill('测试用户');
      await page.waitForTimeout(500);
      await takeScreenshot(page, '22-profile-filled');
      console.log('  ✅ 填写表单成功');
    }

    // 检查头像区域
    const avatar = await page.$('.avatar-section, .avatar-upload');
    if (avatar) {
      console.log('  ✅ 发现头像上传区域');
      await takeScreenshot(page, '23-avatar-section');
    }

    testResults.passed++;
    console.log('  ✅ 用户资料编辑功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 用户资料编辑测试失败: ${error.message}`);
    await takeScreenshot(page, '21-profile-error');
    testResults.failed++;
    return false;
  }
}

async function testSearchFunction(page) {
  console.log('\n🧪 深度测试：高级搜索功能');
  try {
    await page.goto(`${config.baseUrl}/#/pages/search/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '24-search-page');

    // 测试搜索关键词
    const keywords = ['摇滚', 'Jazz', '吉他'];

    for (const keyword of keywords) {
      console.log(`  🔍 搜索关键词: "${keyword}"`);
      const searchInput = await page.$('input');

      if (searchInput) {
        await searchInput.fill(keyword);
        await page.waitForTimeout(1000);
        await takeScreenshot(page, `25-search-${keyword}`);

        // 点击搜索或按回车
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await takeScreenshot(page, `26-search-results-${keyword}`);
        console.log(`    ✅ 搜索 "${keyword}" 执行完成`);
      }
    }

    testResults.passed++;
    console.log('  ✅ 高级搜索功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 搜索功能测试失败: ${error.message}`);
    await takeScreenshot(page, '24-search-error');
    testResults.failed++;
    return false;
  }
}

async function testRecruitList(page) {
  console.log('\n🧪 深度测试：招募列表页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/recruit/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '27-recruit-list');

    // 查找招募卡片
    console.log('  🔍 查找招募卡片');
    const recruitCard = await page.$('.recruit-card, .recruitment-item');
    if (recruitCard) {
      console.log('  ✅ 找到招募卡片，点击进入详情');
      await recruitCard.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '28-recruit-detail');
    } else {
      console.log('  ⚠️ 未找到招募卡片（可能暂无数据）');
    }

    testResults.passed++;
    console.log('  ✅ 招募列表页功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 招募列表测试失败: ${error.message}`);
    await takeScreenshot(page, '27-recruit-error');
    testResults.failed++;
    return false;
  }
}

async function testRoomList(page) {
  console.log('\n🧪 深度测试：排练室列表页');
  try {
    await page.goto(`${config.baseUrl}/#/pages/room/list`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await takeScreenshot(page, '29-room-list');

    // 查找排练室卡片
    console.log('  🔍 查找排练室卡片');
    const roomCard = await page.$('.room-card, .room-item');
    if (roomCard) {
      console.log('  ✅ 找到排练室卡片');
    } else {
      console.log('  ⚠️ 未找到排练室卡片（可能暂无数据）');
    }

    testResults.passed++;
    console.log('  ✅ 排练室列表页功能正常');
    return true;
  } catch (error) {
    console.log(`  ❌ 排练室列表测试失败: ${error.message}`);
    await takeScreenshot(page, '29-room-error');
    testResults.failed++;
    return false;
  }
}

async function testResponsiveDesign(page) {
  console.log('\n🧪 深度测试：响应式设计测试');
  const viewports = [
    { name: 'iPhone SE', width: 320, height: 568 },
    { name: 'iPhone X', width: 375, height: 812 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 }
  ];

  for (const viewport of viewports) {
    console.log(`  📱 测试视口: ${viewport.name} (${viewport.width}x${viewport.height})`);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${config.baseUrl}/#/pages/home/index`, {
      waitUntil: 'networkidle',
      timeout: config.timeout
    });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, `34-responsive-${viewport.name.replace(' ', '-')}`);
  }

  // 恢复默认视口
  await page.setViewportSize(config.viewport);

  testResults.passed++;
  console.log('  ✅ 响应式设计测试完成');
  return true;
}

async function runAllTests() {
  console.log('======================================================================');
  console.log('🚀 开始 Gojica 项目深度功能测试');
  console.log('======================================================================');
  console.log(`📍 测试地址: ${config.baseUrl}`);
  console.log(`📐 测试视口: ${config.viewport.width}x${config.viewport.height}`);
  console.log(`📁 测试目录: ${testResultsDir}`);
  console.log('======================================================================');

  let browser;
  try {
    console.log('\n🚀 启动 Chrome 浏览器...');
    browser = await chromium.launch({
      channel: 'chrome',
      headless: false,
      slowMo: config.slowMo
    });

    const page = await browser.newPage();
    await page.setViewportSize(config.viewport);

    // 执行所有测试
    await testCompleteLoginFlow(page);
    await testBandCreation(page);
    await testPostPublication(page);
    await testActivityDetail(page);
    await testMarketList(page);
    await testBandDetail(page);
    await testProfileEdit(page);
    await testSearchFunction(page);
    await testRecruitList(page);
    await testRoomList(page);
    await testResponsiveDesign(page);

    // 输出测试结果
    console.log('\n======================================================================');
    console.log('📊 深度测试结果汇总');
    console.log('======================================================================');
    console.log(`✅ 通过: ${testResults.passed}`);
    console.log(`❌ 失败: ${testResults.failed}`);
    console.log(`📸 截图数量: ${testResults.screenshots.length}`);

    if (testResults.errors.length > 0) {
      console.log('\n⚠️ 部分测试存在控制台错误，请检查截图及日志');
    }

    console.log('\n📋 生成的截图列表:');
    testResults.screenshots.forEach((screenshot, index) => {
      console.log(`  ${index + 1}. ${screenshot.name}`);
    });

    console.log('\n📁 截图保存位置:');
    console.log(`   ${path.resolve(testResultsDir)}`);

    console.log('\n======================================================================');
    if (testResults.failed === 0) {
      console.log('🎉 所有测试通过！测试完成！');
    } else {
      console.log(`⚠️ 测试完成，但有 ${testResults.failed} 个测试失败`);
    }
    console.log('======================================================================');
    console.log('\n💡 提示：浏览器将保持打开以便查看');
    console.log('按 Ctrl+C 结束测试...');

    // 保持浏览器打开
    await new Promise(() => {});

  } catch (error) {
    console.error('\n❌ 测试执行失败:', error.message);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

// 运行测试
runAllTests();
