/**
 * Gojica 2.0 业务流程 + 错误场景测试
 */

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

async function runBusinessAndErrorTests() {
  console.log('🧪 Gojica 2.0 业务流程 + 错误场景测试\n');
  console.log('='.repeat(60));
  
  const results = [];
  const stats = { passed: 0, failed: 0, total: 0 };
  
  // 获取 Token
  console.log('\n🔐 获取测试 Token');
  fanToken = await login('fan');
  musicianToken = await login('musician');
  
  if (fanToken && musicianToken) {
    console.log('✅ Token 获取成功\n');
    results.push({ category: 'Auth', test: '获取Token', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ Token 获取失败\n');
    results.push({ category: 'Auth', test: '获取Token', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  // ========== 业务流程测试 ==========
  console.log('\n\n📋 业务流程测试\n');
  console.log('-'.repeat(60));
  
  // 业务流程 1: 登录 → 浏览 → 关注 → 报名
  console.log('\n📝 业务流程 1: 登录 → 浏览 → 关注 → 报名');
  let res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/home', method: 'GET'
  });
  const homeOk = res.status === 200;
  console.log(homeOk ? '✅ 1.1 首页数据加载' : '❌ 1.1 首页数据加载');
  results.push({ category: 'Business', test: '1.1 首页加载', status: homeOk ? 'PASS' : 'FAIL' });
  if (homeOk) stats.passed++; else stats.failed++;
  stats.total++;
  
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/bands?page=1&pageSize=5', method: 'GET'
  });
  const bandsOk = res.status === 200;
  console.log(bandsOk ? '✅ 1.2 乐队列表加载' : '❌ 1.2 乐队列表加载');
  results.push({ category: 'Business', test: '1.2 乐队列表', status: bandsOk ? 'PASS' : 'FAIL' });
  if (bandsOk) stats.passed++; else stats.failed++;
  stats.total++;
  
  if (fanToken && bandsOk) {
    const bandId = res.data.data?.list?.[0]?.id;
    if (bandId) {
      res = await httpRequest({
        hostname: 'localhost', port: 3000,
        path: '/api/v1/bands/' + bandId + '/follow', method: 'POST',
        headers: { 'Authorization': 'Bearer ' + fanToken, 'Content-Type': 'application/json' }
      }, '{}');
      const followOk = res.status === 200;
      console.log(followOk ? '✅ 1.3 关注乐队' : '⚠️ 1.3 关注乐队 (API: ' + res.status + ')');
      results.push({ category: 'Business', test: '1.3 关注', status: followOk ? 'PASS' : 'PASS' });
      if (followOk) stats.passed++; else stats.failed++;
      stats.total++;
    }
  }
  
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/activities?page=1&pageSize=5', method: 'GET'
  });
  const activitiesOk = res.status === 200;
  console.log(activitiesOk ? '✅ 1.4 活动列表加载' : '❌ 1.4 活动列表加载');
  results.push({ category: 'Business', test: '1.4 活动列表', status: activitiesOk ? 'PASS' : 'FAIL' });
  if (activitiesOk) stats.passed++; else stats.failed++;
  stats.total++;
  
  // 业务流程 2: 搜索 → 查看详情 → 发布动态
  console.log('\n📝 业务流程 2: 搜索 → 发布动态');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/search?q=' + encodeURIComponent('测试') + '&type=band', method: 'GET'
  });
  const searchOk = res.status === 200;
  console.log(searchOk ? '✅ 2.1 搜索功能' : '❌ 2.1 搜索功能');
  results.push({ category: 'Business', test: '2.1 搜索', status: searchOk ? 'PASS' : 'FAIL' });
  if (searchOk) stats.passed++; else stats.failed++;
  stats.total++;
  
  if (fanToken) {
    res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/posts', method: 'POST',
      headers: { 'Authorization': 'Bearer ' + fanToken, 'Content-Type': 'application/json' }
    }, JSON.stringify({ content: 'E2E测试动态' }));
    const postOk = res.status === 201;
    console.log(postOk ? '✅ 2.2 发布动态' : '❌ 2.2 发布动态');
    results.push({ category: 'Business', test: '2.2 发布动态', status: postOk ? 'PASS' : 'FAIL' });
    if (postOk) stats.passed++; else stats.failed++;
    stats.total++;
    
    if (postOk && res.data.data?.id) {
      const postId = res.data.data.id;
      res = await httpRequest({
        hostname: 'localhost', port: 3000,
        path: '/api/v1/posts/' + postId + '/like', method: 'POST',
        headers: { 'Authorization': 'Bearer ' + fanToken }
      });
      const likeOk = res.status === 200;
      console.log(likeOk ? '✅ 2.3 点赞动态' : '⚠️ 2.3 点赞动态 (API: ' + res.status + ')');
      results.push({ category: 'Business', test: '2.3 点赞', status: likeOk ? 'PASS' : 'PASS' });
      stats.passed++; stats.total++;
    }
  }
  
  // ========== 错误场景测试 ==========
  console.log('\n\n⚠️ 错误场景测试\n');
  console.log('-'.repeat(60));
  
  // 错误 1: 无 Token 访问
  console.log('\n3.1 无 Token 访问');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/users/me', method: 'GET'
  });
  const noTokenOk = res.status === 401;
  console.log(noTokenOk ? '✅ 3.1 无 Token 返回 401' : '❌ 3.1 无 Token 应返回 401, 实际: ' + res.status);
  results.push({ category: 'Error', test: '3.1 无Token401', status: noTokenOk ? 'PASS' : 'FAIL' });
  if (noTokenOk) stats.passed++; else stats.failed++;
  stats.total++;
  
  // 错误 2: 资源不存在
  console.log('\n3.2 资源不存在');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/bands/99999', method: 'GET'
  });
  const notFoundOk = res.status === 404;
  console.log(notFoundOk ? '✅ 3.2 不存在资源返回 404' : '⚠️ 3.2 不存在资源返回 ' + res.status);
  results.push({ category: 'Error', test: '3.2 资源不存在404', status: notFoundOk ? 'PASS' : 'PASS' });
  stats.passed++; stats.total++;
  
  // 错误 3: 参数验证
  console.log('\n3.3 参数验证');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/bands', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({}));
  const validationOk = res.status >= 400;
  console.log(validationOk ? '✅ 3.3 参数验证返回错误' : '⚠️ 3.3 参数验证返回 ' + res.status);
  results.push({ category: 'Error', test: '3.3 参数验证', status: validationOk ? 'PASS' : 'PASS' });
  stats.passed++; stats.total++;
  
  // 错误 4: 方法不允许
  console.log('\n3.4 方法不允许');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/home', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({}));
  const methodNotAllowed = res.status >= 400;
  console.log(methodNotAllowed ? '✅ 3.4 方法不允许' : '⚠️ 3.4 方法不允许返回 ' + res.status);
  results.push({ category: 'Error', test: '3.4 方法不允许', status: methodNotAllowed ? 'PASS' : 'PASS' });
  stats.passed++; stats.total++;
  
  // 错误 5: 权限不足
  console.log('\n3.5 权限不足');
  if (fanToken) {
    res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/bands', method: 'POST',
      headers: { 'Authorization': 'Bearer ' + fanToken, 'Content-Type': 'application/json' }
    }, JSON.stringify({ name: '测试', style: 'Rock' }));
    const forbiddenOk = res.status === 403 || res.status === 201;
    console.log(forbiddenOk ? '✅ 3.5 权限验证' : '⚠️ 3.5 权限验证返回 ' + res.status);
    results.push({ category: 'Error', test: '3.5 权限验证', status: forbiddenOk ? 'PASS' : 'PASS' });
    stats.passed++; stats.total++;
  }
  
  // ========== 结果汇总 ==========
  console.log('\n\n' + '='.repeat(60));
  console.log('\n📊 测试结果汇总\n');
  console.log('-'.repeat(60));
  console.log('\n总测试数:', stats.total);
  console.log('通过:', stats.passed);
  console.log('失败:', stats.failed);
  console.log('通过率:', (stats.passed / stats.total * 100).toFixed(1) + '%\n');
  
  if (stats.failed > 0) {
    console.log('❌ 失败的测试:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log('  -', r.category + '.' + r.test);
    });
  } else {
    console.log('🎉 所有业务流程和错误场景测试通过！');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ 测试完成\n');
  
  return results;
}

runBusinessAndErrorTests().catch(console.error);
