const http = require('http');

console.log('='.repeat(60));
console.log('Gojica 乐队模块 API 测试');
console.log('='.repeat(60));
console.log('');

const BASE_URL = 'http://localhost:3000';
const API_BASE = '/api/v1';

let authToken = null;
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
  console.log('📋 开始执行乐队模块 API 测试...');
  console.log('');

  console.log('--- 1. 登录获取 Token ---');
  try {
    const loginData = { code: 'test', identity: 'fan' };
    const loginRes = await makeRequest('POST', '/auth/login', loginData);
    
    if (loginRes.status === 200 && loginRes.data.code === 1000) {
      authToken = loginRes.data.data.accessToken;
      addTestResult('登录接口 POST /auth/login', true, `获取 Token 成功`);
    } else {
      addTestResult('登录接口 POST /auth/login', false, `状态码: ${loginRes.status}`);
    }
  } catch (error) {
    addTestResult('登录接口 POST /auth/login', false, `请求失败: ${error.message}`);
  }

  console.log('');
  console.log('--- 2. 乐队模块 API 测试 ---');
  
  if (authToken) {
    try {
      console.log('测试获取乐队列表...');
      const listRes = await makeRequest('GET', '/bands?page=1&pageSize=10');
      
      if (listRes.status === 200 && listRes.data.code === 1000) {
        const list = listRes.data.data;
        addTestResult('获取乐队列表 GET /bands', true, `共 ${list.list ? list.list.length : 0} 个乐队`);
      } else {
        addTestResult('获取乐队列表 GET /bands', false, `状态码: ${listRes.status}`);
      }
    } catch (error) {
      addTestResult('获取乐队列表 GET /bands', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取乐队详情...');
      const detailRes = await makeRequest('GET', '/bands/1');
      
      if (detailRes.status === 200 && detailRes.data.code === 1000) {
        const band = detailRes.data.data;
        addTestResult('获取乐队详情 GET /bands/:id', true, `乐队: ${band.name}, 成员数: ${band.member_count}`);
      } else {
        addTestResult('获取乐队详情 GET /bands/:id', false, `状态码: ${detailRes.status}`);
      }
    } catch (error) {
      addTestResult('获取乐队详情 GET /bands/:id', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取乐队成员...');
      const membersRes = await makeRequest('GET', '/bands/1/members');
      
      if (membersRes.status === 200 && membersRes.data.code === 1000) {
        const members = membersRes.data.data;
        addTestResult('获取乐队成员 GET /bands/:id/members', true, `共 ${members.length} 名成员`);
      } else {
        addTestResult('获取乐队成员 GET /bands/:id/members', false, `状态码: ${membersRes.status}`);
      }
    } catch (error) {
      addTestResult('获取乐队成员 GET /bands/:id/members', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试获取乐队活动...');
      const activitiesRes = await makeRequest('GET', '/bands/1/activities');
      
      if (activitiesRes.status === 200 && activitiesRes.data.code === 1000) {
        const activities = activitiesRes.data.data;
        addTestResult('获取乐队活动 GET /bands/:id/activities', true, `共 ${activities.list ? activities.list.length : 0} 个活动`);
      } else {
        addTestResult('获取乐队活动 GET /bands/:id/activities', false, `状态码: ${activitiesRes.status}`);
      }
    } catch (error) {
      addTestResult('获取乐队活动 GET /bands/:id/activities', false, `请求失败: ${error.message}`);
    }

    try {
      console.log('测试关注乐队...');
      const followRes = await makeRequest('POST', '/bands/1/follow', {});
      
      if (followRes.status === 200 && followRes.data.code === 1000) {
        const result = followRes.data.data;
        addTestResult('关注乐队 POST /bands/:id/follow', true, `${result.followed ? '关注成功' : '取消关注成功'}`);
      } else {
        addTestResult('关注乐队 POST /bands/:id/follow', false, `状态码: ${followRes.status}`);
      }
    } catch (error) {
      addTestResult('关注乐队 POST /bands/:id/follow', false, `请求失败: ${error.message}`);
    }

  } else {
    console.log('⚠️  未获取到 Token，跳过需要认证的测试');
  }

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
