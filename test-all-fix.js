const http = require('http');

// 测试登录
request('/api/v1/auth/login', 'POST', { identity: 'musician' })
  .then((loginData) => {
    console.log('1. 登录成功:', loginData);
    
    const token = loginData.data.accessToken;
    
    // 测试关注功能
    console.log('\n2. 测试关注功能...');
    return request('/api/v1/bands/100/follow', 'POST', {}, token)
      .then((followResult) => {
        console.log('   关注结果:', followResult);
        return { token, isFollowing: followResult.data.followed };
      });
  })
  .then(({ token, isFollowing }) => {
    // 测试活动报名功能
    console.log('\n3. 测试活动报名功能...');
    return request('/api/v1/activities/100/signup', 'POST', {}, token)
      .then((signupResult) => {
        console.log('   报名结果:', signupResult);
        return { token, isFollowing };
      });
  })
  .then(({ token, isFollowing }) => {
    // 测试取消关注功能
    console.log('\n4. 测试取消关注功能...');
    return request('/api/v1/bands/100/follow', 'POST', {}, token)
      .then((unfollowResult) => {
        console.log('   取消关注结果:', unfollowResult);
        return { token };
      });
  })
  .then(({ token }) => {
    // 测试帖子点赞功能
    console.log('\n5. 测试帖子点赞功能...');
    return request('/api/v1/posts/1/like', 'POST', {}, token)
      .then((likeResult) => {
        console.log('   点赞结果:', likeResult);
      });
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
