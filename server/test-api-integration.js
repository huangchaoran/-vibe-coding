require('dotenv').config({ path: '.env.test' });
const http = require('http');

const BASE_URL = 'http://localhost:3000/api/v1';

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

async function testAPI() {
  console.log('🧪 Gojica 2.0 前后端联调测试\n');
  console.log('='.repeat(50));

  const results = [];

  // Test 1: 开发模式登录
  console.log('\n📝 Test 1: 开发模式登录 (POST /auth/dev-login)');
  try {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/auth/dev-login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ identity: 'fan' }));

    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));

    if (res.status === 200 && res.data.code === 1000) {
      console.log('✅ 登录成功');
      results.push({ name: '登录', status: 'PASS', token: res.data.data?.token });
    } else {
      console.log('❌ 登录失败');
      results.push({ name: '登录', status: 'FAIL' });
    }
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
    results.push({ name: '登录', status: 'ERROR', error: e.message });
  }

  // Test 2: 首页数据
  console.log('\n📝 Test 2: 首页数据 (GET /home)');
  try {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/home',
      method: 'GET'
    });

    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));

    if (res.status === 200) {
      console.log('✅ 首页数据获取成功');
      results.push({ name: '首页', status: 'PASS' });
    } else {
      console.log('❌ 首页数据获取失败');
      results.push({ name: '首页', status: 'FAIL' });
    }
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
    results.push({ name: '首页', status: 'ERROR', error: e.message });
  }

  // Test 3: 乐队列表
  console.log('\n📝 Test 3: 乐队列表 (GET /bands)');
  try {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands?page=1&pageSize=5',
      method: 'GET'
    });

    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));

    if (res.status === 200) {
      console.log('✅ 乐队列表获取成功');
      results.push({ name: '乐队列表', status: 'PASS', count: res.data.data?.list?.length });
    } else {
      console.log('❌ 乐队列表获取失败');
      results.push({ name: '乐队列表', status: 'FAIL' });
    }
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
    results.push({ name: '乐队列表', status: 'ERROR', error: e.message });
  }

  // Test 4: 活动列表
  console.log('\n📝 Test 4: 活动列表 (GET /activities)');
  try {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/activities?page=1&pageSize=5',
      method: 'GET'
    });

    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));

    if (res.status === 200) {
      console.log('✅ 活动列表获取成功');
      results.push({ name: '活动列表', status: 'PASS', count: res.data.data?.list?.length });
    } else {
      console.log('❌ 活动列表获取失败');
      results.push({ name: '活动列表', status: 'FAIL' });
    }
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
    results.push({ name: '活动列表', status: 'ERROR', error: e.message });
  }

  // Test 5: 动态列表
  console.log('\n📝 Test 5: 动态列表 (GET /posts)');
  try {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/posts?page=1&pageSize=5',
      method: 'GET'
    });

    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));

    if (res.status === 200) {
      console.log('✅ 动态列表获取成功');
      results.push({ name: '动态列表', status: 'PASS', count: res.data.data?.list?.length });
    } else {
      console.log('❌ 动态列表获取失败');
      results.push({ name: '动态列表', status: 'FAIL' });
    }
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
    results.push({ name: '动态列表', status: 'ERROR', error: e.message });
  }

  // Test 6: 搜索功能
  console.log('\n📝 Test 6: 搜索功能 (GET /search)');
  try {
    // URL 编码中文关键词
    const keyword = encodeURIComponent('摇滚');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/search?q=${keyword}&type=band`,
      method: 'GET'
    });

    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));

    if (res.status === 200) {
      console.log('✅ 搜索功能正常');
      results.push({ name: '搜索', status: 'PASS' });
    } else {
      console.log('❌ 搜索功能失败');
      results.push({ name: '搜索', status: 'FAIL' });
    }
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
    results.push({ name: '搜索', status: 'ERROR', error: e.message });
  }

  // Test 7: Token 验证
  console.log('\n📝 Test 7: Token 验证 (GET /users/me without token)');
  try {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/users/me',
      method: 'GET'
    });

    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));

    if (res.status === 401) {
      console.log('✅ Token 验证正常 (应返回 401)');
      results.push({ name: 'Token验证', status: 'PASS' });
    } else {
      console.log('⚠️  Token 验证异常');
      results.push({ name: 'Token验证', status: 'FAIL' });
    }
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
    results.push({ name: 'Token验证', status: 'ERROR', error: e.message });
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试结果汇总\n');

  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;

  results.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${r.name}: ${r.status}`);
    if (r.count !== undefined) console.log(`   数据条数: ${r.count}`);
    if (r.token) console.log(`   Token: ${r.token.substring(0, 50)}...`);
    if (r.error) console.log(`   错误: ${r.error}`);
  });

  console.log('\n' + '-'.repeat(50));
  console.log(`总计: ${passCount} 通过, ${failCount} 失败, ${errorCount} 错误`);
  console.log(`通过率: ${((passCount / results.length) * 100).toFixed(1)}%`);

  console.log('\n✅ 前后端联调测试完成\n');
}

testAPI().catch(console.error);
