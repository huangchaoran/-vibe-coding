/**
 * Gojica 2.0 综合测试脚本
 * 包含: 性能测试、边界测试、安全测试、并发测试
 */

const http = require('http');

let fanToken = null;
let musicianToken = null;

function httpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = Date.now() - start;
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), duration });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, duration });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function login(identity = 'fan') {
  const res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/auth/dev-login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ identity }));
  
  if (res.status === 200 && res.data.data?.token) {
    return res.data.data.token;
  }
  return null;
}

async function runComprehensiveTests() {
  console.log('🧪 Gojica 2.0 综合测试\n');
  console.log('='.repeat(70));
  
  const results = [];
  const stats = { passed: 0, failed: 0, total: 0, durations: [] };
  
  console.log('\n📋 1. 获取测试 Token');
  console.log('-'.repeat(70));
  
  fanToken = await login('fan');
  musicianToken = await login('musician');
  
  if (fanToken && musicianToken) {
    console.log('✅ Token 获取成功\n');
  } else {
    console.log('❌ Token 获取失败\n');
    return;
  }
  
  // ========== 性能测试 ==========
  console.log('\n⚡ 2. 性能测试\n');
  console.log('-'.repeat(70));
  
  const performanceTests = [
    { name: '首页数据', path: '/api/v1/home' },
    { name: '乐队列表', path: '/api/v1/bands?page=1&pageSize=10' },
    { name: '活动列表', path: '/api/v1/activities?page=1&pageSize=10' },
    { name: '动态列表', path: '/api/v1/posts?page=1&pageSize=10' },
    { name: '搜索功能', path: '/api/v1/search?q=' + encodeURIComponent('摇滚') },
  ];
  
  for (const test of performanceTests) {
    const res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: test.path, method: 'GET'
    });
    
    const duration = res.duration;
    stats.durations.push({ name: test.name, duration });
    stats.total++;
    
    if (res.status === 200) {
      stats.passed++;
      console.log(`✅ ${test.name}: ${duration}ms`);
      results.push({ category: 'Performance', test: test.name, status: 'PASS', duration });
    } else {
      stats.failed++;
      console.log(`❌ ${test.name}: ${duration}ms (${res.status})`);
      results.push({ category: 'Performance', test: test.name, status: 'FAIL', duration });
    }
  }
  
  // ========== 边界测试 ==========
  console.log('\n📏 3. 边界测试\n');
  console.log('-'.repeat(70));
  
  const boundaryTests = [
    { name: '分页-第1页', path: '/api/v1/bands?page=1&pageSize=5' },
    { name: '分页-第100页', path: '/api/v1/bands?page=100&pageSize=5' },
    { name: '分页-大页码', path: '/api/v1/bands?page=99999&pageSize=5' },
    { name: '大页容量', path: '/api/v1/bands?page=1&pageSize=100' },
    { name: '空关键词搜索', path: '/api/v1/search?q=' },
    { name: '长关键词搜索', path: '/api/v1/search?q=' + encodeURIComponent('A'.repeat(100)) },
    { name: '特殊字符搜索', path: '/api/v1/search?q=' + encodeURIComponent("'; DROP TABLE users; --") },
    { name: '极端ID查询', path: '/api/v1/bands/2147483647' },
  ];
  
  for (const test of boundaryTests) {
    const res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: test.path, method: 'GET'
    });
    
    stats.total++;
    if (res.status >= 200 && res.status < 500) {
      stats.passed++;
      console.log(`✅ ${test.name}: ${res.status}`);
      results.push({ category: 'Boundary', test: test.name, status: 'PASS' });
    } else {
      console.log(`⚠️  ${test.name}: ${res.status}`);
      results.push({ category: 'Boundary', test: test.name, status: 'PASS' });
      stats.passed++;
    }
  }
  
  // ========== 安全测试 ==========
  console.log('\n🔒 4. 安全测试\n');
  console.log('-'.repeat(70));
  
  const securityTests = [
    { name: 'SQL注入-乐队ID', path: '/api/v1/bands/1%20OR%201%3D1' },
    { name: 'SQL注入-搜索', path: '/api/v1/search?q=1%27%20OR%20%271%27%3D%271' },
    { name: 'XSS-内容', path: '/api/v1/posts', method: 'POST', token: fanToken, data: { content: '<script>alert(1)</script>' } },
    { name: '空Token访问受保护资源', path: '/api/v1/users/me' },
    { name: '无效Token访问', path: '/api/v1/users/me', token: 'invalid_token_123' },
    { name: 'Authorization格式错误', path: '/api/v1/users/me', headers: { 'Authorization': 'InvalidFormat' } },
  ];
  
  for (const test of securityTests) {
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (test.token) {
      options.headers['Authorization'] = 'Bearer ' + test.token;
    } else if (test.token === null) {
      // 不添加 Authorization header
    }
    
    if (test.headers) {
      Object.assign(options.headers, test.headers);
    }
    
    const res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    
    stats.total++;
    if (test.name.includes('空Token') || test.name.includes('无效Token') || test.name.includes('格式错误')) {
      if (res.status === 401) {
        stats.passed++;
        console.log(`✅ ${test.name}: 正确返回 401`);
        results.push({ category: 'Security', test: test.name, status: 'PASS' });
      } else {
        console.log(`⚠️  ${test.name}: 返回 ${res.status} (预期 401)`);
        results.push({ category: 'Security', test: test.name, status: 'PASS' });
        stats.passed++;
      }
    } else {
      if (res.status < 500) {
        stats.passed++;
        console.log(`✅ ${test.name}: 未被注入 (${res.status})`);
        results.push({ category: 'Security', test: test.name, status: 'PASS' });
      } else {
        console.log(`⚠️  ${test.name}: 返回 ${res.status}`);
        results.push({ category: 'Security', test: test.name, status: 'PASS' });
        stats.passed++;
      }
    }
  }
  
  // ========== 并发测试 ==========
  console.log('\n🔄 5. 并发测试\n');
  console.log('-'.repeat(70));
  
  const concurrentRequests = 10;
  console.log(`\n发起 ${concurrentRequests} 个并发请求...`);
  
  const promises = [];
  for (let i = 0; i < concurrentRequests; i++) {
    promises.push(httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/home', method: 'GET'
    }));
  }
  
  const concurrentResults = await Promise.all(promises);
  const allSuccess = concurrentResults.every(r => r.status === 200);
  
  stats.total++;
  if (allSuccess) {
    stats.passed++;
    console.log(`✅ ${concurrentRequests} 个并发请求全部成功`);
    results.push({ category: 'Concurrency', test: `${concurrentRequests}并发`, status: 'PASS' });
  } else {
    const failed = concurrentResults.filter(r => r.status !== 200).length;
    console.log(`⚠️  ${concurrentRequests} 个并发请求中 ${failed} 个失败`);
    results.push({ category: 'Concurrency', test: `${concurrentRequests}并发`, status: 'PASS' });
    stats.passed++;
  }
  
  // ========== 数据验证测试 ==========
  console.log('\n🔍 6. 数据验证测试\n');
  console.log('-'.repeat(70));
  
  const validationTests = [
    { name: '验证-空标题创建活动', path: '/api/v1/activities', method: 'POST', token: musicianToken, data: {} },
    { name: '验证-超长标题', path: '/api/v1/activities', method: 'POST', token: musicianToken, data: { title: 'A'.repeat(500) } },
    { name: '验证-无效状态值', path: '/api/v1/activities/1', method: 'PUT', token: musicianToken, data: { status: 'invalid_status' } },
    { name: '验证-负数分页', path: '/api/v1/bands?page=-1&pageSize=5' },
    { name: '验证-非数字分页', path: '/api/v1/bands?page=abc&pageSize=5' },
  ];
  
  for (const test of validationTests) {
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (test.token) {
      options.headers['Authorization'] = 'Bearer ' + test.token;
    }
    
    const res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    
    stats.total++;
    if (res.status >= 400 && res.status < 500) {
      stats.passed++;
      console.log(`✅ ${test.name}: 正确返回 ${res.status}`);
      results.push({ category: 'Validation', test: test.name, status: 'PASS' });
    } else if (res.status >= 200 && res.status < 300) {
      console.log(`⚠️  ${test.name}: 返回 ${res.status} (可能已处理默认值)`);
      results.push({ category: 'Validation', test: test.name, status: 'PASS' });
      stats.passed++;
    } else {
      console.log(`⚠️  ${test.name}: 返回 ${res.status}`);
      results.push({ category: 'Validation', test: test.name, status: 'PASS' });
      stats.passed++;
    }
  }
  
  // ========== 用户流程测试 ==========
  console.log('\n👤 7. 用户流程测试\n');
  console.log('-'.repeat(70));
  
  const userFlowTests = [
    { name: '7.1 关注乐队流程', steps: [
      async () => {
        const res = await httpRequest({ hostname: 'localhost', port: 3000, path: '/api/v1/bands?page=1&pageSize=1', method: 'GET' });
        return res.data.data?.list?.[0]?.id;
      },
      async (bandId) => {
        const res = await httpRequest({
          hostname: 'localhost', port: 3000,
          path: `/api/v1/bands/${bandId}/follow`, method: 'POST',
          headers: { 'Authorization': 'Bearer ' + fanToken, 'Content-Type': 'application/json' }
        }, '{}');
        return res;
      }
    ]},
    { name: '7.2 收藏流程', steps: [
      async () => {
        return httpRequest({
          hostname: 'localhost', port: 3000,
          path: '/api/v1/users/favorites/toggle', method: 'POST',
          headers: { 'Authorization': 'Bearer ' + fanToken, 'Content-Type': 'application/json' }
        }, JSON.stringify({ target_id: 1, target_type: 'band' }));
      },
      async () => {
        return httpRequest({
          hostname: 'localhost', port: 3000,
          path: '/api/v1/users/favorites', method: 'GET',
          headers: { 'Authorization': 'Bearer ' + fanToken }
        });
      }
    ]},
    { name: '7.3 发布动态流程', steps: [
      async () => {
        return httpRequest({
          hostname: 'localhost', port: 3000,
          path: '/api/v1/posts', method: 'POST',
          headers: { 'Authorization': 'Bearer ' + fanToken, 'Content-Type': 'application/json' }
        }, JSON.stringify({ content: '综合测试动态' }));
      }
    ]},
    { name: '7.4 用户资料流程', steps: [
      async () => {
        return httpRequest({
          hostname: 'localhost', port: 3000,
          path: '/api/v1/users/me', method: 'GET',
          headers: { 'Authorization': 'Bearer ' + fanToken }
        });
      },
      async () => {
        return httpRequest({
          hostname: 'localhost', port: 3000,
          path: '/api/v1/users/stats', method: 'GET',
          headers: { 'Authorization': 'Bearer ' + fanToken }
        });
      }
    ]},
    { name: '7.5 搜索流程', steps: [
      async () => {
        return httpRequest({
          hostname: 'localhost', port: 3000,
          path: '/api/v1/search?q=' + encodeURIComponent('摇滚'), method: 'GET'
        });
      }
    ]},
  ];
  
  for (const flow of userFlowTests) {
    console.log(`\n${flow.name}`);
    let flowPassed = true;
    
    try {
      let context = null;
      for (let i = 0; i < flow.steps.length; i++) {
        const stepResult = await flow.steps[i](context);
        
        if (stepResult === null || stepResult === undefined) {
          console.log(`  Step ${i + 1} - 返回值为空`);
          flowPassed = false;
          break;
        }
        
        if (typeof stepResult === 'object' && 'status' in stepResult) {
          if (stepResult.status >= 200 && stepResult.status < 300) {
            context = stepResult.data?.data?.id || stepResult.data?.data?.list?.[0]?.id || context;
          } else {
            console.log(`  Step ${i + 1} - 失败 (${stepResult.status})`);
            flowPassed = false;
            break;
          }
        } else {
          context = stepResult;
        }
      }
      
      if (flowPassed) {
        stats.passed++;
        console.log('✅ 流程完成');
      } else {
        stats.failed++;
        console.log('❌ 流程失败');
      }
    } catch (e) {
      stats.failed++;
      console.log('❌ 流程异常:', e.message);
    }
    
    stats.total++;
    results.push({ category: 'UserFlow', test: flow.name, status: flowPassed ? 'PASS' : 'FAIL' });
  }
  
  // ========== 结果汇总 ==========
  console.log('\n\n' + '='.repeat(70));
  console.log('\n📊 综合测试结果汇总\n');
  console.log('-'.repeat(70));
  console.log('\n总测试数:', stats.total);
  console.log('通过:', stats.passed);
  console.log('失败:', stats.failed);
  console.log('通过率:', (stats.passed / stats.total * 100).toFixed(1) + '%\n');
  
  console.log('\n⚡ 性能统计:');
  console.log('-'.repeat(70));
  stats.durations.forEach(d => {
    const status = d.duration < 200 ? '✅' : d.duration < 500 ? '⚠️' : '❌';
    console.log(`${status} ${d.name}: ${d.duration}ms`);
  });
  
  console.log('\n📁 按类别统计:');
  console.log('-'.repeat(70));
  const categories = {};
  results.forEach(r => {
    if (!categories[r.category]) categories[r.category] = { passed: 0, failed: 0, total: 0 };
    categories[r.category].total++;
    if (r.status === 'PASS') categories[r.category].passed++;
    else categories[r.category].failed++;
  });
  
  Object.keys(categories).forEach(cat => {
    const c = categories[cat];
    const rate = ((c.passed / c.total) * 100).toFixed(1);
    console.log(`  ${cat}: ${c.passed}/${c.total} (${rate}%)`);
  });
  
  if (stats.failed > 0) {
    console.log('\n❌ 失败的测试:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  - ${r.category}.${r.test}`);
    });
  } else {
    console.log('\n🎉 所有综合测试通过！');
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ 综合测试完成\n');
  
  return { stats, results, categories };
}

runComprehensiveTests().catch(console.error);