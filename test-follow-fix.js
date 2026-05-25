const http = require('http');

// 测试登录
request('/api/v1/auth/login', 'POST', { identity: 'musician' })
  .then((loginData) => {
    console.log('登录成功:', loginData);
    
    const token = loginData.data.accessToken;
    
    // 测试关注（不带请求体）
    console.log('\n测试关注功能...');
    return request('/api/v1/bands/100/follow', 'POST', undefined, token);
  })
  .then((followResult) => {
    console.log('关注结果:', followResult);
  })
  .catch((err) => {
    console.error('测试失败:', err);
  });

function request(path, method = 'GET', data, token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve({ code: 500, message: body });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({ code: 500, message: err.message });
    });
    
    if (method !== 'GET' && data !== undefined) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}
