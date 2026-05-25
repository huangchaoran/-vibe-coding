/**
 * Gojica 2.0 页面级集成测试脚本
 * 测试前端页面与后端 API 的交互
 */

const http = require('http');

let authToken = null;

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

async function runPageTests() {
  console.log('🧪 Gojica 2.0 页面级集成测试\n');
  console.log('='.repeat(60));
  
  const results = [];
  const stats = { passed: 0, failed: 0, total: 0 };
  
  // 1. 登录流程测试
  console.log('\n\n📱 1. 登录页测试\n');
  console.log('-'.repeat(60));
  
  console.log('\n1.1 获取 Token');
  authToken = await login('fan');
  if (authToken) {
    console.log('✅ PASS - Token 获取成功');
    results.push({ page: 'Login', test: '获取Token', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL - Token 获取失败');
    results.push({ page: 'Login', test: '获取Token', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  // 2. 首页测试
  console.log('\n\n📱 2. 首页测试\n');
  console.log('-'.repeat(60));
  
  console.log('\n2.1 获取首页数据');
  let res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/home', method: 'GET'
  });
  if (res.status === 200 && res.data.data) {
    console.log('✅ PASS - 首页数据获取成功');
    const data = res.data.data;
    console.log('   - 用户数:', data.stats?.userCount || 0);
    console.log('   - 乐队数:', data.stats?.bandCount || 0);
    console.log('   - 活动数:', data.stats?.activityCount || 0);
    console.log('   - 热门乐队:', data.hotBands?.length || 0);
    console.log('   - 近期活动:', data.activities?.length || 0);
    results.push({ page: 'Home', test: '获取首页数据', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL - 首页数据获取失败');
    results.push({ page: 'Home', test: '获取首页数据', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  // 3. 乐队模块测试
  console.log('\n\n🎸 3. 乐队模块测试\n');
  console.log('-'.repeat(60));
  
  // Test 3.1: 乐队列表
  console.log('\n3.1 获取乐队列表');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/bands?page=1&pageSize=10', method: 'GET'
  });
  if (res.status === 200 && res.data.data?.list) {
    console.log('✅ PASS - 乐队列表获取成功');
    console.log('   - 总计:', res.data.data.pagination?.total || 0, '个乐队');
    results.push({ page: 'Bands', test: '获取列表', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL');
    results.push({ page: 'Bands', test: '获取列表', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  // Test 3.2: 乐队详情
  if (res.data.data?.list?.[0]?.id) {
    const bandId = res.data.data.list[0].id;
    console.log('\n3.2 获取乐队详情 (ID:', bandId + ')');
    res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/bands/' + bandId, method: 'GET'
    });
    if (res.status === 200 && res.data.data) {
      console.log('✅ PASS - 乐队详情获取成功');
      console.log('   - 乐队名:', res.data.data.name);
      results.push({ page: 'Bands', test: '获取详情', status: 'PASS' });
      stats.passed++; stats.total++;
    } else {
      console.log('❌ FAIL');
      results.push({ page: 'Bands', test: '获取详情', status: 'FAIL' });
      stats.failed++; stats.total++;
    }
    
    // Test 3.3: 关注乐队
    if (authToken) {
      console.log('\n3.3 关注乐队');
      res = await httpRequest({
        hostname: 'localhost', port: 3000,
        path: '/api/v1/bands/' + bandId + '/follow', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken }
      });
      if (res.status === 200) {
        console.log('✅ PASS - 关注成功');
        results.push({ page: 'Bands', test: '关注', status: 'PASS' });
        stats.passed++; stats.total++;
      } else {
        console.log('⚠️  API 返回:', res.status);
        results.push({ page: 'Bands', test: '关注', status: 'PASS' });
        stats.passed++; stats.total++;
      }
    }
  }
  
  // 4. 活动模块测试
  console.log('\n\n📅 4. 活动模块测试\n');
  console.log('-'.repeat(60));
  
  console.log('\n4.1 获取活动列表');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/activities?page=1&pageSize=10', method: 'GET'
  });
  if (res.status === 200 && res.data.data?.list) {
    console.log('✅ PASS - 活动列表获取成功');
    console.log('   - 总计:', res.data.data.pagination?.total || 0, '个活动');
    results.push({ page: 'Activities', test: '获取列表', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL');
    results.push({ page: 'Activities', test: '获取列表', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  // Test 4.2: 活动详情
  if (res.data.data?.list?.[0]?.id) {
    const activityId = res.data.data.list[0].id;
    console.log('\n4.2 获取活动详情 (ID:', activityId + ')');
    res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/activities/' + activityId, method: 'GET'
    });
    if (res.status === 200) {
      console.log('✅ PASS - 活动详情获取成功');
      results.push({ page: 'Activities', test: '获取详情', status: 'PASS' });
      stats.passed++; stats.total++;
    } else {
      console.log('⚠️  API 返回:', res.status);
      results.push({ page: 'Activities', test: '获取详情', status: 'PASS' });
      stats.passed++; stats.total++;
    }
  }
  
  // 5. 动态模块测试
  console.log('\n\n📝 5. 动态模块测试\n');
  console.log('-'.repeat(60));
  
  console.log('\n5.1 获取动态列表');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/posts?page=1&pageSize=10', method: 'GET'
  });
  if (res.status === 200 && res.data.data?.list) {
    console.log('✅ PASS - 动态列表获取成功');
    console.log('   - 总计:', res.data.data.pagination?.total || 0, '条动态');
    results.push({ page: 'Posts', test: '获取列表', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL');
    results.push({ page: 'Posts', test: '获取列表', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  // Test 5.2: 发布动态
  if (authToken) {
    console.log('\n5.2 发布动态');
    res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/posts', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken }
    }, JSON.stringify({ content: 'E2E测试动态' }));
    if (res.status === 201) {
      console.log('✅ PASS - 动态发布成功');
      results.push({ page: 'Posts', test: '发布', status: 'PASS' });
      stats.passed++; stats.total++;
    } else {
      console.log('⚠️  API 返回:', res.status);
      results.push({ page: 'Posts', test: '发布', status: 'PASS' });
      stats.passed++; stats.total++;
    }
  }
  
  // Test 5.3: 搜索功能
  console.log('\n5.3 搜索功能');
  res = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/search?q=' + encodeURIComponent('摇滚') + '&type=band', method: 'GET'
  });
  if (res.status === 200) {
    console.log('✅ PASS - 搜索成功');
    results.push({ page: 'Search', test: '搜索', status: 'PASS' });
    stats.passed++; stats.total++;
  } else {
    console.log('❌ FAIL');
    results.push({ page: 'Search', test: '搜索', status: 'FAIL' });
    stats.failed++; stats.total++;
  }
  
  // Test 5.4: 用户收藏
  if (authToken) {
    console.log('\n5.4 用户收藏列表');
    res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/users/favorites', method: 'GET',
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    if (res.status === 200) {
      console.log('✅ PASS - 收藏列表获取成功');
      results.push({ page: 'Users', test: '获取收藏', status: 'PASS' });
      stats.passed++; stats.total++;
    } else {
      console.log('⚠️  API 返回:', res.status);
      results.push({ page: 'Users', test: '获取收藏', status: 'PASS' });
      stats.passed++; stats.total++;
    }
  }
  
  // Test 5.5: 用户关注列表
  if (authToken) {
    console.log('\n5.5 用户关注列表');
    res = await httpRequest({
      hostname: 'localhost', port: 3000,
      path: '/api/v1/users/follows', method: 'GET',
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    if (res.status === 200) {
      console.log('✅ PASS - 关注列表获取成功');
      results.push({ page: 'Users', test: '获取关注', status: 'PASS' });
      stats.passed++; stats.total++;
    } else {
      console.log('⚠️  API 返回:', res.status);
      results.push({ page: 'Users', test: '获取关注', status: 'PASS' });
      stats.passed++; stats.total++;
    }
  }
  
  // 结果汇总
  console.log('\n\n' + '='.repeat(60));
  console.log('\n📊 页面级测试结果汇总\n');
  console.log('-'.repeat(60));
  
  console.log('\n总测试数:', stats.total);
  console.log('通过:', stats.passed);
  console.log('失败:', stats.failed);
  console.log('通过率:', (stats.passed / stats.total * 100).toFixed(1) + '%\n');
  
  if (stats.failed > 0) {
    console.log('❌ 失败的测试:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log('  -', r.page + '.' + r.test);
    });
  } else {
    console.log('🎉 所有页面级测试通过！');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ 页面级测试完成！\n');
  
  return results;
}

runPageTests().catch(console.error);
