/**
 * 前端活动报名功能模拟测试
 * 模拟前端页面调用 activityApi.signup 的完整流程
 */

const http = require('http');

// 模拟前端的 request 函数
const BASE_URL = 'http://localhost:3000/api/v1';

function request(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// 模拟前端 api 函数
const apiPost = (url, data) => {
  const token = null; // 模拟未登录情况
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token ? 'Bearer ' + token : ''
  };
  
  return request({
    hostname: 'localhost',
    port: 3000,
    path: BASE_URL + url,
    method: 'POST',
    headers,
    body: JSON.stringify(data || {})
  });
};

// 模拟前端 activityApi.signup
const signupActivity = async (activityId) => {
  try {
    const res = await apiPost('/activities/' + activityId + '/signup', {});
    return res;
  } catch (e) {
    throw e;
  }
};

async function testFrontendSignup() {
  console.log('🔍 前端活动报名功能测试\n');
  console.log('='.repeat(70));
  
  // 1. 模拟未登录状态
  console.log('\n1️⃣ 测试未登录状态（模拟前端）');
  console.log('-'.repeat(70));
  
  const res1 = await signupActivity(14);
  console.log('   状态码:', res1.status);
  console.log('   响应:', JSON.stringify(res1.data));
  
  if (res1.status === 401) {
    console.log('   ✅ PASS - 正确返回 401 未授权');
  } else if (res1.status === 500) {
    console.log('   ❌ FAIL - 返回 500 错误');
    console.log('   错误信息:', res1.data?.message);
  } else {
    console.log('   ⚠️  状态:', res1.status);
  }
  
  // 2. 模拟已登录状态
  console.log('\n2️⃣ 测试已登录状态');
  console.log('-'.repeat(70));
  
  // 先获取 token
  const loginRes = await request({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/auth/dev-login', method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: 'fan' })
  });
  
  const token = loginRes.data?.data?.token;
  console.log('   Token:', token ? '获取成功' : '获取失败');
  
  // 模拟带 token 的请求
  if (token) {
    const signupRes = await request({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/activities/14/signup', method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    console.log('   状态码:', signupRes.status);
    console.log('   响应:', JSON.stringify(signupRes.data).substring(0, 200));
    
    if (signupRes.status === 201 || signupRes.status === 200) {
      console.log('   ✅ PASS - 活动报名成功');
    } else {
      console.log('   ❌ FAIL - 活动报名失败');
    }
  }
  
  // 3. 测试不同活动状态
  console.log('\n3️⃣ 测试不同活动状态');
  console.log('-'.repeat(70));
  
  const activitiesRes = await request({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/activities?page=1&pageSize=10', method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (activitiesRes.status === 200) {
    const activities = activitiesRes.data.data?.list || [];
    console.log('   活动列表:');
    
    for (const activity of activities) {
      console.log(`   - ID: ${activity.id}, 名称: ${activity.title}, 状态: ${activity.status}`);
      
      // 尝试报名
      const signupRes = await request({
        hostname: 'localhost', port: 3000,
        path: '/api/v1/activities/' + activity.id + '/signup', method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      console.log(`     报名结果: ${signupRes.status} - ${JSON.stringify(signupRes.data).substring(0, 80)}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ 前端模拟测试完成\n');
}

// 执行测试
testFrontendSignup()
  .then(() => console.log('测试完成'))
  .catch(err => {
    console.error('测试失败:', err);
    process.exit(1);
  });