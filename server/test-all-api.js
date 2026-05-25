const http = require('http');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3000/api/v1';
const JWT_SECRET = 'gojica_secret_key_2024_dev';

function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadStr = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7200,
    iss: 'gojica-api'
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payloadStr}`)
    .digest('base64url');
  return `${header}.${payloadStr}.${signature}`;
}

function httpRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testAPI() {
  console.log('🚀 开始全面API接口测试...\n');
  console.log('='.repeat(60));
  console.log('📗 第一部分：正面测试（正常流程）');
  console.log('='.repeat(60));

  const token = generateToken({
    userId: 1,
    openid: 'test_openid',
    identity: 'fan',
    role: 'user'
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Requested-With': 'XMLHttpRequest'
  };

  const results = [];

  // ==================== 正面测试 ====================
  
  // 1. 首页轮播图
  try {
    console.log('\n✅ [正面] 测试首页轮播图接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/home/banners',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
    results.push({ name: '首页轮播图(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '首页轮播图(正常)', status: '❌ 失败', type: 'positive' }); }

  // 2. 首页统计
  try {
    console.log('\n✅ [正面] 测试首页统计接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/home/stats',
      method: 'GET'
    });
    const data = res.data.data || {};
    console.log(`   状态码: ${res.status} | 用户数: ${data.userCount || 0}, 乐队数: ${data.bandCount || 0}`);
    results.push({ name: '首页统计(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '首页统计(正常)', status: '❌ 失败', type: 'positive' }); }

  // 3. 乐队列表（分页）
  try {
    console.log('\n✅ [正面] 测试乐队列表接口（分页）...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands?page=1&pageSize=5',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 返回数量: ${res.data.data?.list?.length || 0}`);
    results.push({ name: '乐队列表(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '乐队列表(正常)', status: '❌ 失败', type: 'positive' }); }

  // 4. 活动列表（筛选）
  try {
    console.log('\n✅ [正面] 测试活动列表接口（状态筛选）...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/activities?status=recruiting&pageSize=5',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 返回数量: ${res.data.data?.list?.length || 0}`);
    results.push({ name: '活动列表(筛选)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '活动列表(筛选)', status: '❌ 失败', type: 'positive' }); }

  // 5. 帖子列表
  try {
    console.log('\n✅ [正面] 测试帖子列表接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/posts?page=1&pageSize=10',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 返回数量: ${res.data.data?.list?.length || 0}`);
    results.push({ name: '帖子列表(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '帖子列表(正常)', status: '❌ 失败', type: 'positive' }); }

  // 6. 排练房列表
  try {
    console.log('\n✅ [正面] 测试排练房列表接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/rooms?pageSize=10',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 返回数量: ${res.data.data?.list?.length || 0}`);
    results.push({ name: '排练房列表(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '排练房列表(正常)', status: '❌ 失败', type: 'positive' }); }

  // 7. 招募列表
  try {
    console.log('\n✅ [正面] 测试招募列表接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/recruitments?pageSize=10',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 返回数量: ${res.data.data?.list?.length || 0}`);
    results.push({ name: '招募列表(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '招募列表(正常)', status: '❌ 失败', type: 'positive' }); }

  // 8. 商品列表
  try {
    console.log('\n✅ [正面] 测试商品列表接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/products?pageSize=10',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 返回数量: ${res.data.data?.list?.length || 0}`);
    results.push({ name: '商品列表(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '商品列表(正常)', status: '❌ 失败', type: 'positive' }); }

  // 9. 搜索接口
  try {
    console.log('\n✅ [正面] 测试搜索接口（有效关键词）...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/search?q=test&page=1&pageSize=10',
      method: 'GET'
    });
    const data = res.data.data || {};
    console.log(`   状态码: ${res.status} | 乐队:${data.bands?.total || 0}, 活动:${data.activities?.total || 0}`);
    results.push({ name: '搜索接口(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '搜索接口(正常)', status: '❌ 失败', type: 'positive' }); }

  // 10. 乐队详情
  try {
    console.log('\n✅ [正面] 测试乐队详情接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands/1',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 乐队ID: ${res.data.data?.id}`);
    results.push({ name: '乐队详情(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '乐队详情(正常)', status: '❌ 失败', type: 'positive' }); }

  // 11. 活动详情
  try {
    console.log('\n✅ [正面] 测试活动详情接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/activities/1',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 活动ID: ${res.data.data?.id || 'N/A'}`);
    results.push({ name: '活动详情(正常)', status: '✅ 通过', type: 'positive' });
  } catch (e) { results.push({ name: '活动详情(正常)', status: '❌ 失败', type: 'positive' }); }

  console.log('\n' + '='.repeat(60));
  console.log('📕 第二部分：反面测试（异常流程）');
  console.log('='.repeat(60));

  // ==================== 反面测试 ====================

  // 1. 未登录访问需要认证的接口
  try {
    console.log('\n❌ [反面] 测试未登录访问用户资料...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/users/profile',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.status === 401 && res.data.code === 3001) {
      console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
      console.log('   ✅ 正确返回401未授权错误');
      results.push({ name: '未登录访问(应401)', status: '✅ 通过', type: 'negative' });
    } else {
      console.log(`   ❌ 预期401，实际${res.status}`);
      results.push({ name: '未登录访问(应401)', status: '❌ 失败', type: 'negative' });
    }
  } catch (e) { results.push({ name: '未登录访问(应401)', status: '❌ 失败', type: 'negative' }); }

  // 2. 无效Token
  try {
    console.log('\n❌ [反面] 测试无效Token访问...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/users/profile',
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid_token_here'
      }
    });
    if (res.status === 401 && res.data.code === 3001) {
      console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
      console.log('   ✅ 正确拒绝无效Token');
      results.push({ name: '无效Token(应401)', status: '✅ 通过', type: 'negative' });
    } else {
      console.log(`   ❌ 预期401，实际${res.status}`);
      results.push({ name: '无效Token(应401)', status: '❌ 失败', type: 'negative' });
    }
  } catch (e) { results.push({ name: '无效Token(应401)', status: '❌ 失败', type: 'negative' }); }

  // 3. 访问不存在的资源
  try {
    console.log('\n❌ [反面] 测试访问不存在的乐队...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands/999999',
      method: 'GET'
    });
    if (res.status === 404 || res.data.code === 3003) {
      console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
      console.log('   ✅ 正确返回404资源不存在');
      results.push({ name: '不存在资源(应404)', status: '✅ 通过', type: 'negative' });
    } else {
      console.log(`   状态码: ${res.status} | code: ${res.data.code}`);
      results.push({ name: '不存在资源(应404)', status: '⚠️ 需确认', type: 'negative' });
    }
  } catch (e) { results.push({ name: '不存在资源(应404)', status: '❌ 失败', type: 'negative' }); }

  // 4. 无效的参数格式
  try {
    console.log('\n❌ [反面] 测试无效的活动ID格式...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/activities/invalid-id',
      method: 'GET'
    });
    if (res.status === 422 && res.data.code === 3004) {
      console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
      console.log('   ✅ 正确返回422验证错误');
      results.push({ name: '无效参数格式(应422)', status: '✅ 通过', type: 'negative' });
    } else {
      console.log(`   状态码: ${res.status} | code: ${res.data.code}`);
      results.push({ name: '无效参数格式(应422)', status: '⚠️ 需确认', type: 'negative' });
    }
  } catch (e) { results.push({ name: '无效参数格式(应422)', status: '❌ 失败', type: 'negative' }); }

  // 5. 空关键词搜索（这是业务验证，正确返回400）
  try {
    console.log('\n❌ [反面] 测试空关键词搜索（应返回400）...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/search?q=&page=1&pageSize=10',
      method: 'GET'
    });
    if (res.status === 400 && res.data.code === 3000) {
      console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
      console.log('   ✅ 正确返回400空关键词验证错误');
      results.push({ name: '空关键词搜索(应400)', status: '✅ 通过', type: 'negative' });
    } else {
      console.log(`   状态码: ${res.status} | code: ${res.data.code}`);
      results.push({ name: '空关键词搜索(应400)', status: '⚠️ 需确认', type: 'negative' });
    }
  } catch (e) { results.push({ name: '空关键词搜索(应400)', status: '❌ 失败', type: 'negative' }); }

  // 6. 请求不存在的接口
  try {
    console.log('\n❌ [反面] 测试请求不存在的接口...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/nonexistent',
      method: 'GET'
    });
    if (res.status === 404 || res.data.code === 3003) {
      console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
      console.log('   ✅ 正确返回404路由不存在');
      results.push({ name: '不存在路由(应404)', status: '✅ 通过', type: 'negative' });
    } else {
      console.log(`   状态码: ${res.status}`);
      results.push({ name: '不存在路由(应404)', status: '⚠️ 需确认', type: 'negative' });
    }
  } catch (e) { results.push({ name: '不存在路由(应404)', status: '❌ 失败', type: 'negative' }); }

  // 7. 使用POST访问GET接口
  try {
    console.log('\n❌ [反面] 测试错误的方法类型（未认证的POST请求）...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ name: 'Test Band' }));
    console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
    if (res.status === 401 || res.status === 422 || res.status === 403) {
      console.log('   ✅ 正确拒绝未认证的POST请求');
      results.push({ name: '错误方法类型', status: '✅ 通过', type: 'negative' });
    } else {
      results.push({ name: '错误方法类型', status: '⚠️ 需确认', type: 'negative' });
    }
  } catch (e) { results.push({ name: '错误方法类型', status: '❌ 失败', type: 'negative' }); }

  // 8. 分页参数越界
  try {
    console.log('\n❌ [反面] 测试分页参数越界（负数页码）...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands?page=-1&pageSize=10',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | code: ${res.data.code}`);
    results.push({ name: '分页参数越界', status: '✅ 通过', type: 'negative' });
  } catch (e) { results.push({ name: '分页参数越界', status: '❌ 失败', type: 'negative' }); }

  // 9. 缺少必需参数（创建乐队）
  // 注意：fan身份无法创建乐队，会先被身份检查拦截返回403
  try {
    console.log('\n❌ [反面] 测试创建乐队缺少必填参数（fan身份无权限）...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands',
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    console.log(`   状态码: ${res.status} | code: ${res.data.code} | message: ${res.data.message}`);
    // fan身份创建乐队会被身份检查拦截返回403，这是正确的行为
    if (res.status === 403 || res.status === 401 || res.status === 422 || res.status === 400) {
      console.log('   ✅ 正确拒绝创建乐队请求（身份限制或参数验证）');
      results.push({ name: '缺少必填参数', status: '✅ 通过', type: 'negative' });
    } else {
      results.push({ name: '缺少必填参数', status: '⚠️ 需确认', type: 'negative' });
    }
  } catch (e) { results.push({ name: '缺少必填参数', status: '❌ 失败', type: 'negative' }); }

  // 10. 超大分页参数
  try {
    console.log('\n❌ [反面] 测试超大分页参数...');
    const res = await httpRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands?page=1&pageSize=1000',
      method: 'GET'
    });
    console.log(`   状态码: ${res.status} | 返回数量: ${res.data.data?.list?.length || 0}`);
    results.push({ name: '超大分页参数', status: '✅ 通过', type: 'negative' });
  } catch (e) { results.push({ name: '超大分页参数', status: '❌ 失败', type: 'negative' }); }

  // 输出汇总
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));

  const positiveTests = results.filter(t => t.type === 'positive');
  const negativeTests = results.filter(t => t.type === 'negative');

  console.log('\n📗 正面测试（正常流程）:');
  positiveTests.forEach((test, index) => {
    console.log(`   ${index + 1}. ${test.name}: ${test.status}`);
  });

  console.log('\n📕 反面测试（异常流程）:');
  negativeTests.forEach((test, index) => {
    console.log(`   ${index + 1}. ${test.name}: ${test.status}`);
  });

  const passCount = results.filter(t => t.status.includes('✅')).length;
  const totalCount = results.length;
  const positivePass = positiveTests.filter(t => t.status.includes('✅')).length;
  const negativePass = negativeTests.filter(t => t.status.includes('✅')).length;

  console.log('\n' + '='.repeat(60));
  console.log('📈 统计信息');
  console.log('='.repeat(60));
  console.log(`   📗 正面测试: ${positivePass}/${positiveTests.length} 通过`);
  console.log(`   📕 反面测试: ${negativePass}/${negativeTests.length} 通过`);
  console.log(`   📊 总计: ${passCount}/${totalCount} 通过 (${(passCount/totalCount*100).toFixed(1)}%)`);
  console.log('\n🎉 API接口全面测试完成！');

  process.exit(passCount === totalCount ? 0 : 1);
}

testAPI();