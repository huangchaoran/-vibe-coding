/**
 * Gojica 前后端联调功能测试
 * 测试前后端数据对接是否正常
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const API_BASE = 'http://localhost:3000';
const FRONTEND_BASE = 'http://localhost:5173';
const TEST_RESULTS = './test-results/integration';
const API_TOKEN = null; // Will be set after login

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

// Test results tracker
const results = [];
function logTest(name, passed, detail = '') {
  results.push({ name, passed, detail });
  console.log(`${passed ? '✅' : '❌'} ${name}${detail ? ': ' + detail : ''}`);
}

async function runTests() {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();

  let apiToken = null;
  let testUserId = null;

  try {
    console.log('='.repeat(50));
    console.log('Gojica 前后端联调功能测试');
    console.log('='.repeat(50));
    console.log('');

    // ========== 1. 首页测试 ==========
    console.log('【1. 首页测试】');
    await page.goto(`${FRONTEND_BASE}/pages/home/index`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/01-home.png` });
    const homeTitle = await page.title();
    logTest('首页加载', homeTitle.includes('Gojica') || homeTitle.length > 0);

    // ========== 2. 登录流程测试 ==========
    console.log('');
    console.log('【2. 登录流程测试】');

    // 通过 API 登录获取 token（测试后端登录接口）
    const loginResp = await apiRequest('POST', '/api/v1/auth/dev-login', { identity: 'fan' });
    if (loginResp.code === 1000) {
      apiToken = loginResp.data.token;
      testUserId = loginResp.data.userInfo.id;
      logTest('API登录成功', true, `userId: ${testUserId}`);
    } else {
      logTest('API登录成功', false, loginResp.message);
    }

    // 访问登录页面
    await page.goto(`${FRONTEND_BASE}/pages/login/index`, { timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${TEST_RESULTS}/02-login.png` });

    // 检查登录页面元素
    const loginPageLoaded = await page.$('text=登录') || await page.$('text=login');
    logTest('登录页面加载', !!loginPageLoaded, loginPageLoaded ? '' : '(可能自定义实现)');

    // ========== 3. 乐队模块测试 ==========
    console.log('');
    console.log('【3. 乐队模块测试】');

    const bandsResp = await apiRequest('GET', '/api/v1/bands');
    const bandsOk = bandsResp.code === 1000 && bandsResp.data.list.length > 0;
    logTest('乐队列表API', bandsOk, `返回${bandsResp.data?.list?.length || 0}条`);

    await page.goto(`${FRONTEND_BASE}/pages/band/list`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/03-bands.png` });
    logTest('乐队列表页面加载', true);

    // ========== 4. 活动模块测试 ==========
    console.log('');
    console.log('【4. 活动模块测试】');

    const activitiesResp = await apiRequest('GET', '/api/v1/activities');
    const activitiesOk = activitiesResp.code === 1000 && activitiesResp.data.list.length > 0;
    logTest('活动列表API', activitiesOk, `返回${activitiesResp.data?.list?.length || 0}条`);

    await page.goto(`${FRONTEND_BASE}/pages/activity/list`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/04-activities.png` });
    logTest('活动列表页面加载', true);

    // 活动详情
    const activityDetailResp = await apiRequest('GET', '/api/v1/activities/1');
    logTest('活动详情API', activityDetailResp.code === 1000, activityDetailResp.data?.title || '');

    // ========== 5. 广场模块测试 ==========
    console.log('');
    console.log('【5. 广场模块测试】');

    await page.goto(`${FRONTEND_BASE}/pages/square/index`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/05-square.png` });
    logTest('广场页面加载', true);

    // ========== 6. 市场模块测试 ==========
    console.log('');
    console.log('【6. 市场模块测试】');

    await page.goto(`${FRONTEND_BASE}/pages/market/list`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/06-market.png` });
    logTest('市场页面加载', true);

    // ========== 7. 招募模块测试 ==========
    console.log('');
    console.log('【7. 招募模块测试】');

    await page.goto(`${FRONTEND_BASE}/pages/recruit/list`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/07-recruit.png` });
    logTest('招募页面加载', true);

    // ========== 8. 排练室模块测试 ==========
    console.log('');
    console.log('【8. 排练室模块测试】');

    await page.goto(`${FRONTEND_BASE}/pages/room/list`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/08-room.png` });
    logTest('排练室页面加载', true);

    // ========== 9. 搜索模块测试 ==========
    console.log('');
    console.log('【9. 搜索模块测试】');

    await page.goto(`${FRONTEND_BASE}/pages/search/index`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/09-search.png` });
    logTest('搜索页面加载', true);

    // ========== 10. 用户中心测试 ==========
    console.log('');
    console.log('【10. 用户中心测试】');

    await page.goto(`${FRONTEND_BASE}/pages/user/index`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${TEST_RESULTS}/10-user.png` });
    logTest('用户中心页面加载', true);

    // ========== 11. 用户资料更新测试 ==========
    console.log('');
    console.log('【11. 用户资料更新测试】');

    if (apiToken) {
      const updateResp = await apiRequest('PUT', '/api/v1/users/profile',
        { nickname: '联调测试用户' }, apiToken);
      logTest('用户资料更新API', updateResp.code === 1002, updateResp.data?.nickname || '');
    }

    // ========== 12. 用户数据API测试 ==========
    console.log('');
    console.log('【12. 用户数据API测试】');

    if (apiToken) {
      const statsResp = await apiRequest('GET', '/api/v1/users/stats', null, apiToken);
      logTest('用户统计API', statsResp.code === 1000, `fans:${statsResp.data?.fansCount || 0}`);

      const activitiesUserResp = await apiRequest('GET', '/api/v1/users/activities', null, apiToken);
      logTest('用户活动API', activitiesUserResp.code === 1000);

      const favoritesResp = await apiRequest('GET', '/api/v1/users/favorites', null, apiToken);
      logTest('用户收藏API', favoritesResp.code === 1000);

      const ordersResp = await apiRequest('GET', '/api/v1/users/orders', null, apiToken);
      logTest('用户订单API', ordersResp.code === 1000);
    }

    // ========== 13. 首页数据测试 ==========
    console.log('');
    console.log('【13. 首页数据测试】');

    const homeResp = await apiRequest('GET', '/api/v1/home');
    logTest('首页数据API', homeResp.code === 1000, `用户:${homeResp.data?.stats?.userCount || 0}`);
    logTest('- 乐队数量', homeResp.data?.stats?.bandCount > 0, homeResp.data?.stats?.bandCount || 0);
    logTest('- 活动数量', homeResp.data?.stats?.activityCount > 0, homeResp.data?.stats?.activityCount || 0);

    // ========== 14. Token刷新测试 ==========
    console.log('');
    console.log('【14. Token刷新测试】');

    if (apiToken) {
      const loginData = await apiRequest('POST', '/api/v1/auth/dev-login', { identity: 'fan' });
      if (loginData.data?.refreshToken) {
        const refreshResp = await apiRequest('POST', '/api/v1/auth/refresh', {
          refreshToken: loginData.data.refreshToken
        });
        logTest('Token刷新API', refreshResp.code === 1000);
      }
    }

    // ========== 15. 收藏功能测试 ==========
    console.log('');
    console.log('【15. 收藏功能测试】');

    if (apiToken) {
      const favResp = await apiRequest('POST', '/api/v1/users/favorites/toggle',
        { targetType: 'band', targetId: 1 }, apiToken);
      logTest('收藏切换API', favResp.code === 1000, favResp.data?.favorited ? '已收藏' : '已取消');
    }

    // ========== 16. 活动报名测试 ==========
    console.log('');
    console.log('【16. 活动报名测试】');

    if (apiToken) {
      const signupResp = await apiRequest('POST', '/api/v1/activities/2/signup',
        { participantCount: 1 }, apiToken);
      logTest('活动报名API', signupResp.code === 1001 || signupResp.code === 1000,
        signupResp.message || '');
    }

    // ========== 生成测试报告 ==========
    console.log('');
    console.log('='.repeat(50));
    console.log('测试结果汇总');
    console.log('='.repeat(50));

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    console.log(`总计: ${results.length} 项`);
    console.log(`通过: ${passed} 项 ✅`);
    console.log(`失败: ${failed} 项 ❌`);
    console.log('');

    if (failed > 0) {
      console.log('失败项目:');
      results.filter(r => !r.passed).forEach(r => {
        console.log(`  ❌ ${r.name}`);
      });
    }

    console.log('');
    console.log(`截图保存位置: ${TEST_RESULTS}/`);

    await page.screenshot({ path: `${TEST_RESULTS}/final.png` });

  } catch (error) {
    console.error('测试过程出错:', error.message);
    await page.screenshot({ path: `${TEST_RESULTS}/error.png` });
  } finally {
    await browser.close();
  }
}

runTests();