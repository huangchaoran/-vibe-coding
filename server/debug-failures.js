/**
 * 调试失败的 API 端点
 */

const http = require('http');

function httpRequest(options, postData) {
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

async function debugFailingAPIs() {
  console.log('🔍 调试失败的 API 端点\n');
  console.log('='.repeat(60));
  
  // 获取 Token
  console.log('\n1. 获取 Token');
  const loginRes = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/auth/dev-login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ identity: 'fan' }));
  
  const token = loginRes.data.data?.token;
  console.log('Token:', token ? '获取成功' : '获取失败');
  
  // 测试失败的 API
  console.log('\n2. 测试失败的 API\n');
  console.log('-'.repeat(60));
  
  // 2.1 切换收藏
  console.log('\n2.1 Users-切换收藏');
  const toggleFav = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/users/favorites/toggle', method: 'POST',
    headers: { 'Authorization': token ? 'Bearer ' + token : '', 'Content-Type': 'application/json' }
  }, JSON.stringify({ targetId: 1, targetType: 'band' }));
  console.log('状态码:', toggleFav.status);
  console.log('响应:', JSON.stringify(toggleFav.data, null, 2).substring(0, 200));
  
  // 2.2 活动报名
  console.log('\n\n2.2 Activities-报名');
  const signup = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/activities/1/signup', method: 'POST',
    headers: { 'Authorization': token ? 'Bearer ' + token : '', 'Content-Type': 'application/json' }
  }, JSON.stringify({ message: '测试报名' }));
  console.log('状态码:', signup.status);
  console.log('响应:', JSON.stringify(signup.data, null, 2).substring(0, 200));
  
  // 2.3 取消报名
  console.log('\n2.3 Activities-取消报名');
  const cancelSignup = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/activities/1/cancel', method: 'DELETE',
    headers: { 'Authorization': token ? 'Bearer ' + token : '' }
  });
  console.log('状态码:', cancelSignup.status);
  console.log('响应:', JSON.stringify(cancelSignup.data, null, 2).substring(0, 200));
  
  // 2.4 创建招募
  const musicianLogin = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/auth/dev-login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ identity: 'musician' }));
  const musicianToken = musicianLogin.data.data?.token;
  console.log('\n\n2.4 Recruitments-创建');
  const createRecruit = await httpRequest({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/recruitments', method: 'POST',
    headers: { 'Authorization': musicianToken ? 'Bearer ' + musicianToken : '', 'Content-Type': 'application/json' }
  }, JSON.stringify({ title: '测试招募', instrument: 'guitar' }));
  console.log('状态码:', createRecruit.status);
  console.log('响应:', JSON.stringify(createRecruit.data, null, 2).substring(0, 300));
  
  console.log('\n' + '='.repeat(60));
}

debugFailingAPIs().catch(console.error);
