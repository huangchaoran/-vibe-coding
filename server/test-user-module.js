const http = require('http');

const request = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    const finalPath = path.startsWith('/') ? path : '/' + path;
    const defaultOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1' + finalPath,
      method: 'GET',
      headers: {}
    };

    if (options.body) {
      options.method = options.method || 'POST';
      defaultOptions.headers['Content-Type'] = 'application/json';
      defaultOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(options.body));
    }

    if (options.token) {
      defaultOptions.headers['Authorization'] = `Bearer ${options.token}`;
    }

    const finalOptions = { ...defaultOptions, ...options };
    delete finalOptions.body;
    delete finalOptions.token;

    const req = http.request(finalOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ result, statusCode: res.statusCode });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
};

let token = null;

const log = (msg, type = 'info') => {
  const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} ${msg}`);
};

const main = async () => {
  console.log('\n' + '='.repeat(80));
  console.log('📋 Gojica 用户模块 API 测试');
  console.log('='.repeat(80) + '\n');

  try {
    // 1. 登录
    log('测试 1: 用户登录');
    const loginResult = await request('/auth/login', {
      method: 'POST',
      body: { code: 'test', identity: 'fan' }
    });

    if (loginResult.result.code === 1000) {
      log('登录成功', 'success');
      token = loginResult.result.data.accessToken;
    } else {
      log('登录失败', 'error');
      return;
    }
    console.log('');

    // 2. 获取用户统计
    log('测试 2: 获取用户统计');
    const stats = await request('/users/stats', { token });
    if (stats.result.code === 1000) {
      log(`关注: ${stats.result.data.followCount}, 活动: ${stats.result.data.activityCount}`, 'success');
    } else {
      log('获取用户统计失败', 'error');
    }
    console.log('');

    // 3. 获取我的关注
    log('测试 3: 获取我的关注');
    const follows = await request('/users/follows', { token });
    if (follows.result.code === 1000) {
      const list = follows.result.data.list || [];
      log(`找到 ${list.length} 个关注`, 'success');
    } else {
      log('获取关注列表失败', 'error');
    }
    console.log('');

    // 4. 获取我的活动
    log('测试 4: 获取我的活动');
    const activities = await request('/users/activities', { token });
    if (activities.result.code === 1000) {
      const list = activities.result.data.list || [];
      log(`找到 ${list.length} 个活动`, 'success');
    } else {
      log('获取活动列表失败', 'error');
    }
    console.log('');

    // 5. 获取我的收藏（新增）
    log('测试 5: 获取我的收藏');
    const favorites = await request('/users/favorites', { token });
    if (favorites.result.code === 1000) {
      const list = favorites.result.data.list || [];
      log(`找到 ${list.length} 个收藏`, 'success');
    } else {
      log('获取收藏列表失败', 'error');
    }
    console.log('');

    // 6. 测试收藏功能
    log('测试 6: 测试收藏/取消收藏');
    const toggleResult = await request('/users/favorites/toggle', {
      token,
      method: 'POST',
      body: { target_type: 'band', target_id: 1 }
    });
    if (toggleResult.result.code === 1000) {
      log(`收藏操作成功: ${toggleResult.result.data.favorited ? '已收藏' : '已取消'}`, 'success');
    } else {
      log('收藏操作失败', 'error');
    }
    console.log('');

    // 7. 再次获取收藏列表
    log('测试 7: 再次获取我的收藏（验证）');
    const favorites2 = await request('/users/favorites', { token });
    if (favorites2.result.code === 1000) {
      const list = favorites2.result.data.list || [];
      log(`现在有 ${list.length} 个收藏`, 'success');
    }
    console.log('');

    // 8. 获取我的预约（新增）
    log('测试 8: 获取我的预约');
    const bookings = await request('/users/bookings', { token });
    if (bookings.result.code === 1000) {
      const list = bookings.result.data.list || [];
      log(`找到 ${list.length} 个预约`, 'success');
    } else {
      log('获取预约列表失败', 'error');
    }
    console.log('');

    // 9. 获取我的订单（新增）
    log('测试 9: 获取我的订单');
    const orders = await request('/users/orders', { token });
    if (orders.result.code === 1000) {
      const list = orders.result.data.list || [];
      log(`找到 ${list.length} 个订单`, 'success');
    } else {
      log('获取订单列表失败', 'error');
    }
    console.log('');

    // 10. 获取用户资料
    log('测试 10: 获取用户资料');
    const profile = await request('/users/profile', { token });
    if (profile.result.code === 1000) {
      log(`用户: ${profile.result.data.nickname}`, 'success');
    } else {
      log('获取用户资料失败', 'error');
    }
    console.log('');

    console.log('='.repeat(80));
    log('🎉 用户模块 API 测试完成！', 'success');
    console.log('='.repeat(80));

  } catch (e) {
    console.error('\n❌ 测试出错:', e);
  }
};

main();
