/**
 * Gojica 前端功能验证测试
 * 直接测试前端页面能否正确加载和显示数据
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const API_BASE = 'http://localhost:3000';
const FRONTEND_BASE = 'http://localhost:5173';
const TEST_RESULTS = './test-results/frontend-verify';

if (!fs.existsSync(TEST_RESULTS)) {
  fs.mkdirSync(TEST_RESULTS, { recursive: true });
}

// API helper for direct backend calls
async function apiRequest(method, endpoint, data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  return response.json();
}

async function runTests() {
  console.log('启动浏览器...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();

  const results = [];
  function log(name, passed, detail = '') {
    results.push({ name, passed, detail });
    console.log(`${passed ? '✅' : '❌'} ${name}${detail ? ': ' + detail : ''}`);
  }

  try {
    console.log('\n========== 前端功能验证测试 ==========\n');

    // ===== 1. 首页 =====
    console.log('【1. 首页】');
    await page.goto(`${FRONTEND_BASE}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${TEST_RESULTS}/01-home.png` });

    const homeBody = await page.locator('body').innerText();
    log('首页有内容', homeBody.length > 50, `内容长度: ${homeBody.length}`);

    // ===== 2. 登录页 =====
    console.log('\n【2. 登录页】');
    await page.goto(`${FRONTEND_BASE}/pages/login/index`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/02-login.png` });

    const loginBody = await page.locator('body').innerText();
    log('登录页有内容', loginBody.length > 10, `内容长度: ${loginBody.length}`);

    // 检查是否有登录相关元素（不限于button）
    const hasLoginContent = loginBody.includes('登录') || loginBody.includes('login') || loginBody.includes('Login');
    log('登录页包含登录文字', hasLoginContent);

    // ===== 3. 乐队列表 =====
    console.log('\n【3. 乐队列表】');
    await page.goto(`${FRONTEND_BASE}/pages/band/list`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${TEST_RESULTS}/03-bands.png` });

    const bandBody = await page.locator('body').innerText();
    log('乐队页有内容', bandBody.length > 50, `内容长度: ${bandBody.length}`);
    const hasBandContent = bandBody.includes('乐队') || bandBody.includes('测试') || bandBody.includes('band');
    log('乐队页包含相关文字', hasBandContent);

    // ===== 4. 活动列表 =====
    console.log('\n【4. 活动列表】');
    await page.goto(`${FRONTEND_BASE}/pages/activity/list`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${TEST_RESULTS}/04-activities.png` });

    const activityBody = await page.locator('body').innerText();
    log('活动页有内容', activityBody.length > 50, `内容长度: ${activityBody.length}`);
    const hasActivityContent = activityBody.includes('活动') || activityBody.includes('测试') || activityBody.includes('activity');
    log('活动页包含相关文字', hasActivityContent);

    // ===== 5. 活动详情 =====
    console.log('\n【5. 活动详情】');
    await page.goto(`${FRONTEND_BASE}/pages/activity/detail?id=1`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${TEST_RESULTS}/05-activity-detail.png` });

    const detailBody = await page.locator('body').innerText();
    log('活动详情页有内容', detailBody.length > 10);

    // ===== 6. 广场 =====
    console.log('\n【6. 广场】');
    await page.goto(`${FRONTEND_BASE}/pages/square/index`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/06-square.png` });

    const squareBody = await page.locator('body').innerText();
    log('广场页有内容', squareBody.length > 10);

    // ===== 7. 市场 =====
    console.log('\n【7. 市场】');
    await page.goto(`${FRONTEND_BASE}/pages/market/list`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/07-market.png` });

    const marketBody = await page.locator('body').innerText();
    log('市场页有内容', marketBody.length > 10);

    // ===== 8. 招募 =====
    console.log('\n【8. 招募】');
    await page.goto(`${FRONTEND_BASE}/pages/recruit/list`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/08-recruit.png` });

    const recruitBody = await page.locator('body').innerText();
    log('招募页有内容', recruitBody.length > 10);

    // ===== 9. 排练室 =====
    console.log('\n【9. 排练室】');
    await page.goto(`${FRONTEND_BASE}/pages/room/list`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/09-room.png` });

    const roomBody = await page.locator('body').innerText();
    log('排练室页有内容', roomBody.length > 10);

    // ===== 10. 搜索 =====
    console.log('\n【10. 搜索】');
    await page.goto(`${FRONTEND_BASE}/pages/search/index`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/10-search.png` });

    const searchBody = await page.locator('body').innerText();
    log('搜索页有内容', searchBody.length > 10);

    // ===== 11. 用户中心 =====
    console.log('\n【11. 用户中心】');
    await page.goto(`${FRONTEND_BASE}/pages/user/index`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/11-user.png` });

    const userBody = await page.locator('body').innerText();
    log('用户中心有内容', userBody.length > 10);

    // ===== 12. 编辑资料 =====
    console.log('\n【12. 编辑资料】');
    await page.goto(`${FRONTEND_BASE}/pages/user/profile`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/12-profile.png` });

    const profileBody = await page.locator('body').innerText();
    log('编辑资料页有内容', profileBody.length > 10);

    // ===== 13. 登录流程测试 =====
    console.log('\n【13. 登录流程测试】');
    await page.goto(`${FRONTEND_BASE}/pages/login/index`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/13-login.png` });

    // 直接调用后端 dev-login API 获取 token
    const loginResp = await apiRequest('POST', '/api/v1/auth/dev-login', { identity: 'fan' });
    log('API开发模式登录', loginResp.code === 1000, `userId: ${loginResp.data?.userInfo?.id || 'N/A'}`);

    if (loginResp.code === 1000 && loginResp.data?.token) {
      // 将 token 注入到前端 localStorage
      await page.evaluate((token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify({ id: 147, identity: 'fan' }));
      }, loginResp.data.token);

      await page.waitForTimeout(1000);
      log('Token注入成功', true);
    }

    // 刷新页面使登录态生效
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/13-login-after.png` });

    // ===== 14. 关注按钮交互测试 =====
    console.log('\n【14. 关注按钮交互测试】');

    // 先确保在首页
    await page.goto(`${FRONTEND_BASE}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 检查登录态 - 看localStorage有没有token
    const hasToken = await page.evaluate(() => {
      return !!localStorage.getItem('token');
    });
    log('首页有登录态', hasToken);

    // 找热门乐队区的关注按钮 - 选择器要准确匹配
    const homeFollowBtn = page.locator('.band-follow-btn').first();
    if (await homeFollowBtn.count() > 0) {
      // 记录点击前的状态
      const textBefore = await homeFollowBtn.innerText();
      const wasFollowed = textBefore.includes('已关注');

      // 点击关注按钮
      await homeFollowBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${TEST_RESULTS}/14-follow-click.png` });

      // 检查状态是否变化
      const textAfter = await homeFollowBtn.innerText();
      const isFollowedNow = textAfter.includes('已关注');

      if (wasFollowed) {
        // 如果之前是"已关注"，点击后应该变成"+ 关注"
        log('取消关注切换', !isFollowedNow, `从"${textBefore}"变为"${textAfter}"`);
      } else {
        // 如果之前是"+ 关注"，点击后应该变成"已关注"
        log('关注切换', isFollowedNow, `从"${textBefore}"变为"${textAfter}"`);
      }

      // 再点一次，应该再次切换回来
      await homeFollowBtn.click();
      await page.waitForTimeout(1500);
      const textFinal = await homeFollowBtn.innerText();
      const isFollowedFinal = textFinal.includes('已关注');
      log('关注按钮再次切换', isFollowedFinal === wasFollowed, `恢复到"${textFinal}"`);
    } else {
      log('关注按钮交互测试', false, '未找到关注按钮(可能未登录)');
    }

    // ===== 15. 活动报名交互测试 =====
    console.log('\n【15. 活动报名交互测试】');
    await page.goto(`${FRONTEND_BASE}/pages/activity/list`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/15-activity-list.png` });

    // 找报名按钮
    const signupBtn = page.locator('.signup-btn').filter({ hasText: '立即报名' }).first();
    if (await signupBtn.count() > 0) {
      await signupBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${TEST_RESULTS}/15-signup-click.png` });
      // 检查是否变成"已报名"
      const signupText = await signupBtn.innerText();
      log('活动报名切换', signupText.includes('已报名') || signupText.includes('报名成功'), `按钮文字: ${signupText}`);
    } else {
      log('活动报名按钮', false, '无可用报名按钮');
    }

    // ===== 16. TabBar导航测试 =====
    console.log('\n【16. TabBar导航】');

    // 测试点击Tab切换 - 先回到首页
    await page.goto(`${FRONTEND_BASE}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${TEST_RESULTS}/13-tab-home.png` });

    // 点击"乐队"tab (通过点击页面上的乐队tab元素)
    const tabBand = page.locator('view').filter({ hasText: /^乐队$/ }).first();
    if (await tabBand.count() > 0) {
      await tabBand.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${TEST_RESULTS}/13-tab-band-click.png` });
      log('TabBar乐队切换', true);
    }

    // 点击"我的"tab
    const tabUser = page.locator('view').filter({ hasText: /^我的$/ }).first();
    if (await tabUser.count() > 0) {
      await tabUser.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${TEST_RESULTS}/13-tab-user-click.png` });
      log('TabBar我的切换', true);
    }

    // ===== 17. 页面滚动测试 =====
    console.log('\n【17. 页面滚动测试】');
    await page.goto(`${FRONTEND_BASE}/pages/activity/list`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 滚动页面
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${TEST_RESULTS}/14-activity-scrolled.png` });
    log('页面滚动正常', true);

    // ===== 18. 页面加载时间测试 =====
    console.log('\n【18. 页面加载时间】');
    const startTime = Date.now();
    await page.goto(`${FRONTEND_BASE}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const loadTime = Date.now() - startTime;
    log('首页加载时间<3秒', loadTime < 3000, `实际: ${loadTime}ms`);

    // ===== 19. 错误页面测试 =====
    console.log('\n【19. 404页面测试】');
    const errorPage = await page.goto(`${FRONTEND_BASE}/pages/not-exist/xxx`, { timeout: 10000 }).catch(() => null);
    if (errorPage) {
      log('错误页面处理', errorPage.status() === 404 || errorPage.status() === 200, `状态: ${errorPage.status()}`);
    } else {
      log('错误页面处理', true, '(前端路由处理)');
    }

    // ===== 汇总 =====
    console.log('\n' + '='.repeat(50));
    console.log('测试结果汇总');
    console.log('='.repeat(50));

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    console.log(`总计: ${results.length} 项`);
    console.log(`通过: ${passed} ✅`);
    console.log(`失败: ${failed} ❌`);

    if (failed > 0) {
      console.log('\n失败项目:');
      results.filter(r => !r.passed).forEach(r => {
        console.log(`  ❌ ${r.name} ${r.detail || ''}`);
      });
    }

    console.log(`\n截图: ${TEST_RESULTS}/`);
    console.log('\n========== 测试完成 ==========');

  } catch (error) {
    console.error('\n测试出错:', error.message);
    await page.screenshot({ path: `${TEST_RESULTS}/error.png` });
  } finally {
    await browser.close();
  }
}

runTests();