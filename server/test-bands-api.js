const http = require('http');

const testAPI = async () => {
  console.log('测试乐队API...');
  console.log('='.repeat(50));
  
  // 1. 先登录
  console.log('\n1. 登录...');
  const loginResult = await new Promise((resolve, reject) => {
    const postData = JSON.stringify({ code: 'test', identity: 'fan' });
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('登录响应:', JSON.stringify(result, null, 2));
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
  
  if (loginResult.code !== 1000) {
    console.error('❌ 登录失败');
    return;
  }
  
  const token = loginResult.data.accessToken;
  console.log('✅ 登录成功，token:', token.substring(0, 50) + '...');
  
  // 2. 获取乐队列表
  console.log('\n2. 获取乐队列表...');
  const bandsResult = await new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/bands?page=1&pageSize=10',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('乐队列表响应:', JSON.stringify(result, null, 2));
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
  
  if (bandsResult.code !== 1000) {
    console.error('❌ 获取乐队列表失败');
    return;
  }
  
  console.log('\n✅ 所有API测试通过！');
  console.log(`找到 ${bandsResult.data.list.length} 个乐队`);
  
  // 显示每个乐队的 is_followed 状态
  bandsResult.data.list.forEach(band => {
    console.log(`  - ${band.name} (${band.id}) - 关注: ${band.is_followed}`);
  });
};

testAPI().catch(err => {
  console.error('❌ 测试失败:', err);
});
