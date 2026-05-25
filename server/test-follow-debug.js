const http = require('http');

async function testFollow() {
  console.log('=== 调试关注乐队接口 ===\n');
  
  // 先登录获取token
  const loginResponse = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.write(JSON.stringify({ code: 'test', identity: 'fan' }));
    req.end();
  });
  
  console.log('登录响应:', JSON.stringify(loginResponse));
  const token = loginResponse.data?.accessToken;
  const userId = loginResponse.data?.user?.id;
  console.log('用户ID:', userId);
  
  if (!token) {
    console.log('未获取到Token');
    return;
  }
  
  // 测试关注接口
  console.log('\n--- 测试关注乐队 ---');
  const followResponse = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands/100/follow',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('HTTP状态码:', res.statusCode);
        console.log('响应头:', JSON.stringify(res.headers));
        console.log('响应体:', data);
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: data });
        }
      });
    });
    req.on('error', (err) => {
      console.log('请求错误:', err.message);
      resolve({ error: err.message });
    });
    req.write(JSON.stringify({}));
    req.end();
  });
  
  console.log('\n关注响应:', JSON.stringify(followResponse));
}

testFollow().catch(console.error);
