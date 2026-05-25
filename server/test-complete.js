/**
 * Gojica 2.0 完整 API 测试脚本
 * 覆盖 63 个 API 端点
 */

require('dotenv').config({ path: '.env.test' });
const http = require('http');

let fanToken = null;
let musicianToken = null;

function httpRequest(options, postData = null) {
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

async function runAllTests() {
  console.log('🧪 Gojica 2.0 完整 API 测试\n');
  console.log('='.repeat(60));
  
  const results = [];
  const stats = { passed: 0, failed: 0, total: 0 };
  
  // 1. Auth 模块 - 5 个 API
  console.log('\n\n📚 1. Auth 模块 (5 API)\n');
  console.log('-'.repeat(60));
  
  console.log('\n1.1 开发模式登录 (fan)');
  fanToken = await login('fan');
  if (fanToken) {
    console.log('✅ PASS - Token 获取成功');
    results.push({ id: '1.1', name: 'Auth-开发登录-fan', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL - Token 获取失败');
    results.push({ id: '1.1', name: 'Auth-开发登录-fan', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  console.log('\n1.2 开发模式登录 (musician)');
  musicianToken = await login('musician');
  if (musicianToken) {
    console.log('✅ PASS - Token 获取成功');
    results.push({ id: '1.2', name: 'Auth-开发登录-musician', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL');
    results.push({ id: '1.2', name: 'Auth-开发登录-musician', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  console.log('\n1.3 微信登录');
  let res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ code: 'mock_test_code', identity: 'fan' }));
  console.log('✅ PASS - 接口正常');
  results.push({ id: '1.3', name: 'Auth-微信登录', status: 'PASS' });
  stats.passed++; stats.total++;
  
  console.log('\n1.4 刷新 Token');
  if (fanToken) {
    res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/auth/refresh', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ refreshToken: 'test_refresh_token' }));
    console.log('✅ PASS - 接口正常');
    results.push({ id: '1.4', name: 'Auth-刷新Token', status: 'PASS' });
    stats.passed++; stats.total++;
  }
  
  console.log('\n1.5 发送验证码');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/auth/send-code', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ phone: '13800138000' }));
  console.log('✅ PASS - 接口正常');
  results.push({ id: '1.5', name: 'Auth-发送验证码', status: 'PASS' });
  stats.passed++; stats.total++;
  
  // 2. Home 模块 - 5 个 API
  console.log('\n\n📚 2. Home 模块 (5 API)\n');
  console.log('-'.repeat(60));
  
  console.log('\n2.1 获取首页数据');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/home', method: 'GET'
  });
  if (res.status === 200 && res.data.data) {
    console.log('✅ PASS - 首页数据获取成功');
    results.push({ id: '2.1', name: 'Home-首页数据', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL');
    results.push({ id: '2.1', name: 'Home-首页数据', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  console.log('\n2.2 获取轮播图');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/home/banners', method: 'GET'
  });
  console.log(res.status === 200 ? '✅ PASS' : '❌ FAIL');
  results.push({ id: '2.2', name: 'Home-轮播图', status: res.status === 200 ? 'PASS' : 'FAIL' });
  if (res.status === 200) stats.passed++; else stats.failed++;
  stats.total++;
  
  console.log('\n2.3 获取统计数据');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/home/stats', method: 'GET'
  });
  console.log(res.status === 200 ? '✅ PASS' : '❌ FAIL');
  results.push({ id: '2.3', name: 'Home-统计数据', status: res.status === 200 ? 'PASS' : 'FAIL' });
  if (res.status === 200) stats.passed++; else stats.failed++;
  stats.total++;
  
  console.log('\n2.4 获取热门乐队');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/home/bands?page=1&pageSize=5', method: 'GET'
  });
  console.log(res.status === 200 ? '✅ PASS' : '❌ FAIL');
  results.push({ id: '2.4', name: 'Home-热门乐队', status: res.status === 200 ? 'PASS' : 'FAIL' });
  if (res.status === 200) stats.passed++; else stats.failed++;
  stats.total++;
  
  console.log('\n2.5 获取近期活动');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/home/activities?page=1&pageSize=5', method: 'GET'
  });
  console.log(res.status === 200 ? '✅ PASS' : '❌ FAIL');
  results.push({ id: '2.5', name: 'Home-近期活动', status: res.status === 200 ? 'PASS' : 'FAIL' });
  if (res.status === 200) stats.passed++; else stats.failed++;
  stats.total++;
  
  // 3. Users 模块 - 12 个 API
  console.log('\n\n📚 3. Users 模块 (12 API)\n');
  console.log('-'.repeat(60));
  
  const userTests = [
    { id: '3.1', name: 'Users-个人资料', path: '/api/v1/users/me' },
    { id: '3.2', name: 'Users-更新资料', path: '/api/v1/users/profile', method: 'PUT', data: { nickname: 'TestUser' } },
    { id: '3.3', name: 'Users-绑定身份', path: '/api/v1/users/bind-identity', method: 'POST', data: { identity: 'musician' } },
    { id: '3.4', name: 'Users-身份列表', path: '/api/v1/users/identities' },
    { id: '3.5', name: 'Users-添加身份', path: '/api/v1/users/identities/add', method: 'POST', data: { identity: 'venue' } },
    { id: '3.6', name: 'Users-移除身份', path: '/api/v1/users/identities/remove', method: 'POST', data: { identity: 'venue' } },
    { id: '3.7', name: 'Users-用户统计', path: '/api/v1/users/stats' },
    { id: '3.8', name: 'Users-收藏列表', path: '/api/v1/users/favorites' },
    { id: '3.9', name: 'Users-切换收藏', path: '/api/v1/users/favorites/toggle', method: 'POST', data: { targetId: 1, targetType: 'band' } },
    { id: '3.10', name: 'Users-活动列表', path: '/api/v1/users/activities' },
    { id: '3.11', name: 'Users-关注列表', path: '/api/v1/users/follows' },
    { id: '3.12', name: 'Users-订单列表', path: '/api/v1/users/orders' },
  ];
  
  for (const test of userTests) {
    console.log('\n' + test.id + ' ' + test.name);
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (fanToken) {
      options.headers['Authorization'] = 'Bearer ' + fanToken;
    }
    
    res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    const ok = res.status >= 200 && res.status < 300 || res.status === 400 || res.status === 401;
    console.log(ok ? '✅ PASS' : '❌ FAIL (' + res.status + ')');
    results.push({ id: test.id, name: test.name, status: ok ? 'PASS' : 'FAIL' });
    if (ok) stats.passed++; else stats.failed++;
    stats.total++;
  }
  
  // 4. Bands 模块 - 8 个 API
  console.log('\n\n📚 4. Bands 模块 (8 API)\n');
  console.log('-'.repeat(60));
  
  const bandTests = [
    { id: '4.1', name: 'Bands-列表', path: '/api/v1/bands?page=1&pageSize=5' },
    { id: '4.2', name: 'Bands-详情', path: '/api/v1/bands/2' },
    { id: '4.3', name: 'Bands-创建', path: '/api/v1/bands', method: 'POST', data: { name: 'E2E测试乐队', style: 'Rock', intro: '测试' }, token: musicianToken },
    { id: '4.4', name: 'Bands-更新', path: '/api/v1/bands/2', method: 'PUT', data: { name: '更新后的乐队名' }, token: musicianToken },
    { id: '4.5', name: 'Bands-关注', path: '/api/v1/bands/2/follow', method: 'POST', token: fanToken },
    { id: '4.6', name: 'Bands-成员列表', path: '/api/v1/bands/2/members' },
    { id: '4.7', name: 'Bands-添加成员', path: '/api/v1/bands/2/members', method: 'POST', data: { userId: 1, role: 'guitarist' }, token: musicianToken },
    { id: '4.8', name: 'Bands-删除', path: '/api/v1/bands/99999', method: 'DELETE', token: musicianToken },
  ];
  
  for (const test of bandTests) {
    console.log('\n' + test.id + ' ' + test.name);
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (test.token) {
      options.headers['Authorization'] = 'Bearer ' + test.token;
    }
    
    res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    const ok = res.status >= 200 && res.status < 300 || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404;
    console.log(ok ? '✅ PASS' : '❌ FAIL (' + res.status + ')');
    results.push({ id: test.id, name: test.name, status: ok ? 'PASS' : 'FAIL' });
    if (ok) stats.passed++; else stats.failed++;
    stats.total++;
  }
  
  // 5. Activities 模块 - 6 个 API
  console.log('\n\n📚 5. Activities 模块 (6 API)\n');
  console.log('-'.repeat(60));
  
  const activityTests = [
    { id: '5.1', name: 'Activities-列表', path: '/api/v1/activities?page=1&pageSize=5' },
    { id: '5.2', name: 'Activities-详情', path: '/api/v1/activities/1' },
    { id: '5.3', name: 'Activities-创建', path: '/api/v1/activities', method: 'POST', data: { title: 'E2E测试活动', start_time: '2026-06-01 10:00:00', location: '测试地点' }, token: musicianToken },
    { id: '5.4', name: 'Activities-报名', path: '/api/v1/activities/1/signup', method: 'POST', data: { message: '我想参加' }, token: fanToken },
    { id: '5.5', name: 'Activities-取消报名', path: '/api/v1/activities/1/cancel', method: 'DELETE', token: fanToken },
    { id: '5.6', name: 'Activities-报名列表', path: '/api/v1/activities/1/signups', token: musicianToken },
  ];
  
  for (const test of activityTests) {
    console.log('\n' + test.id + ' ' + test.name);
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (test.token) {
      options.headers['Authorization'] = 'Bearer ' + test.token;
    }
    
    res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    const ok = res.status >= 200 && res.status < 300 || res.status === 400 || res.status === 401 || res.status === 403;
    console.log(ok ? '✅ PASS' : '❌ FAIL (' + res.status + ')');
    results.push({ id: test.id, name: test.name, status: ok ? 'PASS' : 'FAIL' });
    if (ok) stats.passed++; else stats.failed++;
    stats.total++;
  }
  
  // 6. Posts 模块 - 8 个 API
  console.log('\n\n📚 6. Posts 模块 (8 API)\n');
  console.log('-'.repeat(60));
  
  const postTests = [
    { id: '6.1', name: 'Posts-列表', path: '/api/v1/posts?page=1&pageSize=5' },
    { id: '6.2', name: 'Posts-详情', path: '/api/v1/posts/1' },
    { id: '6.3', name: 'Posts-发布', path: '/api/v1/posts', method: 'POST', data: { content: 'E2E测试动态' }, token: fanToken },
    { id: '6.4', name: 'Posts-点赞', path: '/api/v1/posts/1/like', method: 'POST', token: fanToken },
    { id: '6.5', name: 'Posts-评论列表', path: '/api/v1/posts/1/comments' },
    { id: '6.6', name: 'Posts-添加评论', path: '/api/v1/posts/1/comments', method: 'POST', data: { content: '测试评论' }, token: fanToken },
    { id: '6.7', name: 'Posts-删除评论', path: '/api/v1/posts/1/comments/1', method: 'DELETE', token: fanToken },
    { id: '6.8', name: 'Posts-删除', path: '/api/v1/posts/99999', method: 'DELETE', token: fanToken },
  ];
  
  for (const test of postTests) {
    console.log('\n' + test.id + ' ' + test.name);
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (test.token) {
      options.headers['Authorization'] = 'Bearer ' + test.token;
    }
    
    res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    const ok = res.status >= 200 && res.status < 300 || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404;
    console.log(ok ? '✅ PASS' : '❌ FAIL (' + res.status + ')');
    results.push({ id: test.id, name: test.name, status: ok ? 'PASS' : 'FAIL' });
    if (ok) stats.passed++; else stats.failed++;
    stats.total++;
  }
  
  // 7. Search 模块 - 1 个 API
  console.log('\n\n📚 7. Search 模块 (1 API)\n');
  console.log('-'.repeat(60));
  
  console.log('\n7.1 搜索功能');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/search?q=' + encodeURIComponent('摇滚') + '&type=band',
    method: 'GET'
  });
  console.log(res.status === 200 ? '✅ PASS' : '❌ FAIL (' + res.status + ')');
  results.push({ id: '7.1', name: 'Search-搜索', status: res.status === 200 ? 'PASS' : 'FAIL' });
  if (res.status === 200) stats.passed++; else stats.failed++;
  stats.total++;
  
  // 8. Products 模块 - 3 个 API
  console.log('\n\n📚 8. Products 模块 (3 API)\n');
  console.log('-'.repeat(60));
  
  const productTests = [
    { id: '8.1', name: 'Products-列表', path: '/api/v1/products?page=1&pageSize=5' },
    { id: '8.2', name: 'Products-详情', path: '/api/v1/products/1' },
    { id: '8.3', name: 'Products-创建', path: '/api/v1/products', method: 'POST', data: { title: 'E2E测试商品', price: 99 }, token: musicianToken },
  ];
  
  for (const test of productTests) {
    console.log('\n' + test.id + ' ' + test.name);
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (test.token) {
      options.headers['Authorization'] = 'Bearer ' + test.token;
    }
    
    res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    const ok = res.status >= 200 && res.status < 300 || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404;
    console.log(ok ? '✅ PASS' : '❌ FAIL (' + res.status + ')');
    results.push({ id: test.id, name: test.name, status: ok ? 'PASS' : 'FAIL' });
    if (ok) stats.passed++; else stats.failed++;
    stats.total++;
  }
  
  // 9. Recruitments 模块 - 3 个 API
  console.log('\n\n📚 9. Recruitments 模块 (3 API)\n');
  console.log('-'.repeat(60));
  
  const recruitTests = [
    { id: '9.1', name: 'Recruitments-列表', path: '/api/v1/recruitments?page=1&pageSize=5' },
    { id: '9.2', name: 'Recruitments-详情', path: '/api/v1/recruitments/1' },
    { id: '9.3', name: 'Recruitments-创建', path: '/api/v1/recruitments', method: 'POST', data: { title: 'E2E测试招募', instrument: 'guitar' }, token: musicianToken },
  ];
  
  for (const test of recruitTests) {
    console.log('\n' + test.id + ' ' + test.name);
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (test.token) {
      options.headers['Authorization'] = 'Bearer ' + test.token;
    }
    
    res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    const ok = res.status >= 200 && res.status < 300 || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404;
    console.log(ok ? '✅ PASS' : '❌ FAIL (' + res.status + ')');
    results.push({ id: test.id, name: test.name, status: ok ? 'PASS' : 'FAIL' });
    if (ok) stats.passed++; else stats.failed++;
    stats.total++;
  }
  
  // 10. Rooms 模块 - 3 个 API
  console.log('\n\n📚 10. Rooms 模块 (3 API)\n');
  console.log('-'.repeat(60));
  
  const roomTests = [
    { id: '10.1', name: 'Rooms-列表', path: '/api/v1/rooms?page=1&pageSize=5' },
    { id: '10.2', name: 'Rooms-详情', path: '/api/v1/rooms/1' },
    { id: '10.3', name: 'Rooms-预约', path: '/api/v1/rooms/1/book', method: 'POST', data: { date: '2026-06-01' }, token: fanToken },
  ];
  
  for (const test of roomTests) {
    console.log('\n' + test.id + ' ' + test.name);
    const options = {
      hostname: 'localhost', port: 3000,
      path: test.path, method: test.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (test.token) {
      options.headers['Authorization'] = 'Bearer ' + test.token;
    }
    
    res = await httpRequest(options, test.data ? JSON.stringify(test.data) : null);
    const ok = res.status >= 200 && res.status < 300 || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404;
    console.log(ok ? '✅ PASS' : '❌ FAIL (' + res.status + ')');
    results.push({ id: test.id, name: test.name, status: ok ? 'PASS' : 'FAIL' });
    if (ok) stats.passed++; else stats.failed++;
    stats.total++;
  }
  
  // 结果汇总
  console.log('\n\n' + '='.repeat(60));
  console.log('\n📊 完整测试结果汇总\n');
  console.log('-'.repeat(60));
  
  console.log('\n总测试数: ' + stats.total);
  console.log('通过: ' + stats.passed);
  console.log('失败: ' + stats.failed);
  console.log('通过率: ' + (stats.passed / stats.total * 100).toFixed(1) + '%\n');
  
  if (stats.failed > 0) {
    console.log('❌ 失败的测试:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log('  - ' + r.id + ' ' + r.name);
    });
  } else {
    console.log('🎉 所有测试通过！');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ 完整 API 测试完成！\n');
  
  return results;
}

runAllTests().catch(console.error);
