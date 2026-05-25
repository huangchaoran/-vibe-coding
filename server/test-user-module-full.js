const http = require('http');

console.log('='.repeat(60));
console.log('Gojica 用户模块完整 API 测试');
console.log('='.repeat(60));
console.log('');

const BASE_URL = 'http://localhost:3000';
const API_BASE = '/api/v1';

let authToken = null;
let testUserId = null;
const testResults = [];

function addTestResult(name, passed, message = '') {
  testResults.push({ name, passed, message });
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}`);
  if (message) {
    console.log(`   ${message}`);
  }
}

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `${API_BASE}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: JSON.parse(body)
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('📋 开始执行 API 测试...');
  console.log('');

  // === 认证模块测试 ===
  console.log('--- 1. 认证模块 ---');
  
  try {
    const loginData = { code: 'test', identity: 'fan' };
    console.log('测试登录接口...');
    const loginRes = await makeRequest('POST', '/auth/login', loginData);
    
    if (loginRes.status === 200 && loginRes.data.code === 1000) {
      authToken = loginRes.data.data.accessToken;
      testUserId = loginRes.data.data.user?.id;
      addTestResult('登录接口 POST /auth/login', true, `获取 Token 成功，用户ID: ${testUserId}`);
    } else {
      addTestResult('登录接口 POST /auth/login', false, `状态码: ${loginRes.status}, 响应: ${JSON.stringify(loginRes.data)}`);
    }
  } catch (error) {
    addTestResult('登录接口 POST /auth/login', false, `请求失败: ${error.message}`);
  }

  // === 用户信息模块测试 ===
  console.log('');
  console.log('--- 2. 用户信息模块 ---');
  
  if (authToken) {
    try {
      console.log('测试获取用户信息...');
      const profileRes = await makeRequest('GET', '/users/profile');
      
      if (profileRes.status === 200 && profileRes.data.code === 1000) {
        const user = profileRes.data.data;
        addTestResult('获取用户信息 GET /users/profile', true, 
          `用户: ${user.nickname}, 身份: ${user.identity}, 多身份: ${user.identities ? user.identities.length : '无'}`);
      } else {
        addTestResult('获取用户信息 GET /users/profile', false, `状态码: ${profileRes.status}`);
      }
    } catch (error) {
      addTestResult('获取用户信息 GET /users/profile', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取用户身份...');
      const identitiesRes = await makeRequest('GET', '/users/identities');
      
      if (identitiesRes.status === 200 && identitiesRes.data.code === 1000) {
        const identities = identitiesRes.data.data;
        addTestResult('获取用户身份 GET /users/identities', true, `身份列表: ${JSON.stringify(identities)}`);
      } else {
        addTestResult('获取用户身份 GET /users/identities', false, `状态码: ${identitiesRes.status}`);
      }
    } catch (error) {
      addTestResult('获取用户身份 GET /users/identities', false, `请求失败: ${error.message}`);
    }

    // === 用户数据模块测试 ===
    console.log('');
    console.log('--- 3. 用户数据模块 ---');
    
    try {
      console.log('测试获取用户统计...');
      const statsRes = await makeRequest('GET', '/users/stats');
      
      if (statsRes.status === 200 && statsRes.data.code === 1000) {
        const stats = statsRes.data.data;
        addTestResult('获取用户统计 GET /users/stats', true, 
          `关注: ${stats.followCount}, 粉丝: ${stats.fansCount}, 动态: ${stats.dynamicsCount}, 活动: ${stats.activityCount}`);
      } else {
        addTestResult('获取用户统计 GET /users/stats', false, `状态码: ${statsRes.status}`);
      }
    } catch (error) {
      addTestResult('获取用户统计 GET /users/stats', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取我的活动...');
      const activitiesRes = await makeRequest('GET', '/users/activities');
      
      if (activitiesRes.status === 200 && activitiesRes.data.code === 1000) {
        const activities = activitiesRes.data.data;
        addTestResult('获取我的活动 GET /users/activities', true, 
          `共 ${activities.list ? activities.list.length : 0} 个活动`);
      } else {
        addTestResult('获取我的活动 GET /users/activities', false, `状态码: ${activitiesRes.status}`);
      }
    } catch (error) {
      addTestResult('获取我的活动 GET /users/activities', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取我的预约...');
      const bookingsRes = await makeRequest('GET', '/users/bookings');
      
      if (bookingsRes.status === 200 && bookingsRes.data.code === 1000) {
        const bookings = bookingsRes.data.data;
        addTestResult('获取我的预约 GET /users/bookings', true, 
          `共 ${bookings.list ? bookings.list.length : 0} 个预约`);
      } else {
        addTestResult('获取我的预约 GET /users/bookings', false, `状态码: ${bookingsRes.status}`);
      }
    } catch (error) {
      addTestResult('获取我的预约 GET /users/bookings', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取我的订单...');
      const ordersRes = await makeRequest('GET', '/users/orders');
      
      if (ordersRes.status === 200 && ordersRes.data.code === 1000) {
        const orders = ordersRes.data.data;
        addTestResult('获取我的订单 GET /users/orders', true, 
          `共 ${orders.list ? orders.list.length : 0} 个订单`);
      } else {
        addTestResult('获取我的订单 GET /users/orders', false, `状态码: ${ordersRes.status}`);
      }
    } catch (error) {
      addTestResult('获取我的订单 GET /users/orders', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取我的收藏...');
      const favoritesRes = await makeRequest('GET', '/users/favorites');
      
      if (favoritesRes.status === 200 && favoritesRes.data.code === 1000) {
        const favorites = favoritesRes.data.data;
        addTestResult('获取我的收藏 GET /users/favorites', true, 
          `共 ${favorites.list ? favorites.list.length : 0} 个收藏`);
      } else {
        addTestResult('获取我的收藏 GET /users/favorites', false, `状态码: ${favoritesRes.status}`);
      }
    } catch (error) {
      addTestResult('获取我的收藏 GET /users/favorites', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取我的关注...');
      const followsRes = await makeRequest('GET', '/users/follows');
      
      if (followsRes.status === 200 && followsRes.data.code === 1000) {
        const follows = followsRes.data.data;
        addTestResult('获取我的关注 GET /users/follows', true, 
          `共 ${follows.list ? follows.list.length : 0} 个关注`);
      } else {
        addTestResult('获取我的关注 GET /users/follows', false, `状态码: ${followsRes.status}`);
      }
    } catch (error) {
      addTestResult('获取我的关注 GET /users/follows', false, `请求失败: ${error.message}`);
    }

  } else {
    console.log('⚠️  未获取到 Token，跳过需要认证的测试');
  }

  // === 测试结果汇总 ===
  console.log('');
  console.log('='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));
  
  const passed = testResults.filter(r => r.passed).length;
  const total = testResults.length;
  const failed = total - passed;
  
  console.log(`\n总测试数: ${total}`);
  console.log(`✅  通过: ${passed}`);
  console.log(`❌  失败: ${failed}`);
  console.log(`📈  通过率: ${((passed / total) * 100).toFixed(1)}%`);
  
  console.log('\n详细结果:');
  testResults.forEach((result, index) => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.name}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  if (failed === 0) {
    console.log('🎉 所有测试通过！');
  } else {
    console.log(`⚠️  有 ${failed} 个测试失败`);
  }
  console.log('='.repeat(60));
}

runTests().catch(console.error);
