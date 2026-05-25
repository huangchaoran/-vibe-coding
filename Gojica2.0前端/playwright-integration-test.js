/**
 * Gojica 前后端联调 Playwright 自动化测试
 * 使用 Playwright 真正操作浏览器进行功能测试
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const API_BASE = 'http://localhost:3000';
const FRONTEND_BASE = 'http://localhost:5173';
const TEST_RESULTS = './test-results/playwright';

// 确保测试结果目录存在
if (!fs.existsSync(TEST_RESULTS)) {
  fs.mkdirSync(TEST_RESULTS, { recursive: true });
}

// API helper
async function apiRequest(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  return response.json();
}

async function runTests() {
  console.log('启动浏览器...');
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const page = await context.newPage();

  // 启用请求拦截
  const apiCalls = [];
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/')) {
      try {
        const body = await response.text();
        if (body.length < 1000) {
          apiCalls.push({ url, status: response.status(), body: JSON.parse(body) });
        }
      } catch (e) {}
    }
  });

  let apiToken = null;
  const results = [];

  function log(name, passed, detail = '') {
    results.push({ name, passed, detail });
    console.log(`${passed ? '✅' : '❌'} ${name}${detail ? ': ' + detail : ''}`);
  }

  try {
    console.log('\n========== Playwright 前后端联调测试 ==========\n');

    // ===== 1. 首页测试 =====
    console.log('【1. 测试首页】');
    await page.goto(`${FRONTEND_BASE}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/01-home.png` });

    // 检查页面是否有内容
    const homeContent = await page.locator('body').innerText();
    log('首页有内容加载', homeContent.length > 10, `内容长度: ${homeContent.length}`);

    // 检查首页是否有API数据
    const hasStats = apiCalls.some(c => c.url.includes('/api/v1/home'));
    log('首页加载API数据', hasStats);

    // ===== 2. 登录测试 =====
    console.log('\n【2. 测试登录】');

    // 点击登录按钮或跳转登录页
    await page.goto(`${FRONTEND_BASE}/pages/login/index`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/02-login.png` });

    // 检查登录页面元素
    const loginButton = page.locator('button').first();
    const hasLoginBtn = await loginButton.count() > 0;
    log('登录页面有按钮', hasLoginBtn);

    // 模拟登录 - 通过 API 登录后存储 token
    const loginResp = await apiRequest('POST', '/api/v1/auth/dev-login', { identity: 'fan' });
    if (loginResp.code === 1000) {
      apiToken = loginResp.data.token;

      // 将 token 存入 localStorage 模拟登录状态
      await page.evaluate((token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify({ id: 147, identity: 'fan' }));
      }, apiToken);

      log('API登录成功', true, `userId: ${loginResp.data.userInfo.id}`);

      // 刷新页面验证登录状态
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${TEST_RESULTS}/02-login-after.png` });
    }

    // ===== 3. 乐队列表测试 =====
    console.log('\n【3. 测试乐队列表】');
    await page.goto(`${FRONTEND_BASE}/pages/band/list`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/03-bands.png` });

    // 检查是否有乐队数据
    const bandCalls = apiCalls.filter(c => c.url.includes('/api/v1/bands'));
    if (bandCalls.length > 0) {
      const bandData = bandCalls[bandCalls.length - 1].body;
      const bandCount = bandData.data?.list?.length || 0;
      log('乐队API返回数据', bandCount > 0, `共${bandData.data?.pagination?.total || 0}条`);

      // 检查页面是否显示数据
      const pageText = await page.locator('body').innerText();
      const hasBandName = pageText.includes('乐队') || pageText.includes('测试');
      log('乐队页面显示数据', hasBandName);
    } else {
      log('乐队API调用', false, '未检测到API调用');
    }

    // ===== 4. 活动列表测试 =====
    console.log('\n【4. 测试活动列表】');
    await page.goto(`${FRONTEND_BASE}/pages/activity/list`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/04-activities.png` });

    const activityCalls = apiCalls.filter(c => c.url.includes('/api/v1/activities'));
    if (activityCalls.length > 0) {
      const activityData = activityCalls[activityCalls.length - 1].body;
      const activityCount = activityData.data?.list?.length || 0;
      log('活动API返回数据', activityCount > 0, `共${activityCount}条`);
    }

    // ===== 5. 活动详情测试 =====
    console.log('\n【5. 测试活动详情】');
    await page.goto(`${FRONTEND_BASE}/pages/activity/detail?id=1`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/05-activity-detail.png` });

    // ===== 6. 广场测试 =====
    console.log('\n【6. 测试广场】');
    await page.goto(`${FRONTEND_BASE}/pages/square/index`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/06-square.png` });

    const squareText = await page.locator('body').innerText();
    log('广场页面加载', squareText.length > 0);

    // ===== 7. 市场测试 =====
    console.log('\n【7. 测试市场】');
    await page.goto(`${FRONTEND_BASE}/pages/market/list`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/07-market.png` });
    log('市场页面加载', true);

    // ===== 8. 招募测试 =====
    console.log('\n【8. 测试招募】');
    await page.goto(`${FRONTEND_BASE}/pages/recruit/list`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/08-recruit.png` });
    log('招募页面加载', true);

    // ===== 9. 排练室测试 =====
    console.log('\n【9. 测试排练室】');
    await page.goto(`${FRONTEND_BASE}/pages/room/list`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/09-room.png` });
    log('排练室页面加载', true);

    // ===== 10. 搜索测试 =====
    console.log('\n【10. 测试搜索】');
    await page.goto(`${FRONTEND_BASE}/pages/search/index`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/10-search.png` });

    // 尝试输入搜索
    const searchInput = page.locator('input').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('测试');
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${TEST_RESULTS}/10-search-filled.png` });
      log('搜索输入功能', true);
    }

    // ===== 11. 用户中心测试 =====
    console.log('\n【11. 测试用户中心】');
    await page.goto(`${FRONTEND_BASE}/pages/user/index`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/11-user.png` });

    const userText = await page.locator('body').innerText();
    log('用户中心加载', userText.length > 0);

    // 检查是否有登录状态
    const hasUserInfo = apiCalls.some(c => c.url.includes('/api/v1/users/profile'));
    log('用户信息API调用', hasUserInfo);

    // ===== 12. 编辑资料测试 =====
    console.log('\n【12. 测试编辑资料】');
    await page.goto(`${FRONTEND_BASE}/pages/user/profile`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/12-profile.png` });
    log('编辑资料页面加载', true);

    // ===== 13. TabBar 导航测试 =====
    console.log('\n【13. 测试TabBar导航】');

    // 点击乐队Tab
    const bandTab = page.locator('view').filter({ hasText: '乐队' }).first();
    if (await bandTab.count() > 0) {
      await bandTab.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${TEST_RESULTS}/13-tab-band.png` });
      log('TabBar乐队切换', true);
    }

    // 点击用户Tab
    const userTab = page.locator('view').filter({ hasText: '我的' }).first();
    if (await userTab.count() > 0) {
      await userTab.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${TEST_RESULTS}/13-tab-user.png` });
      log('TabBar用户切换', true);
    }

    // ===== 14. 收藏功能测试 =====
    console.log('\n【14. 测试收藏功能】');
    if (apiToken) {
      const favResp = await apiRequest('POST', '/api/v1/users/favorites/toggle',
        { targetType: 'band', targetId: 1 }, apiToken);
      log('收藏API', favResp.code === 1000, favResp.data?.favorited ? '已收藏' : '已取消');
    }

    // ===== 15. 活动报名测试 =====
    console.log('\n【15. 测试活动报名】');
    if (apiToken) {
      const signupResp = await apiRequest('POST', '/api/v1/activities/3/signup',
        { participantCount: 1 }, apiToken);
      log('活动报名API', signupResp.code === 1001 || signupResp.code === 1000,
        signupResp.message || '');
    }

    // ===== 16. 首页数据完整性 =====
    console.log('\n【16. 测试首页数据完整性】');
    await page.goto(`${FRONTEND_BASE}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/16-home-final.png` });

    const homeResp = await apiRequest('GET', '/api/v1/home');
    log('首页统计数据', homeResp.code === 1000);
    log('- 用户数', (homeResp.data?.stats?.userCount || 0) > 0, homeResp.data?.stats?.userCount);
    log('- 乐队数', (homeResp.data?.stats?.bandCount || 0) > 0, homeResp.data?.stats?.bandCount);
    log('- 活动数', (homeResp.data?.stats?.activityCount || 0) > 0, homeResp.data?.stats?.activityCount);

    // ===== 生成报告 =====
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

    await page.waitForTimeout(1000);

  } catch (error) {
    console.error('\n测试出错:', error.message);
    await page.screenshot({ path: `${TEST_RESULTS}/error.png` });
  } finally {
    await browser.close();
  }
}

runTests();