const http = require('http');

const BASE_URL = 'http://localhost:3000/api/v1';

function request(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
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
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('Gojica 后端 API 全功能测试');
  console.log('='.repeat(60));

  let token = null;
  let testUserId = null;
  let testBandId = null;
  let testActivityId = null;

  try {
    console.log('\n【1】健康检查');
    console.log('-'.repeat(40));
    const health = await request('/../health');
    console.log(`状态码: ${health.status}`);
    console.log(`响应: ${JSON.stringify(health.data)}`);
    if (health.data.code === 1000) {
      console.log('✓ 健康检查通过');
    }

    console.log('\n【2】首页 API 测试');
    console.log('-'.repeat(40));

    const stats = await request('/home/stats');
    console.log(`GET /api/v1/home/stats - 状态码: ${stats.status}`);
    console.log(`响应: ${JSON.stringify(stats.data)}`);
    if (stats.data.code === 1000) {
      console.log('✓ 首页统计 API 正常');
    }

    const homeBands = await request('/home/bands');
    console.log(`GET /api/v1/home/bands - 状态码: ${homeBands.status}`);
    console.log(`响应: ${JSON.stringify(homeBands.data)}`);
    if (homeBands.data.code === 1000) {
      console.log('✓ 首页乐队 API 正常');
      if (Array.isArray(homeBands.data.data)) {
        console.log(`  数据量: ${homeBands.data.data.length} 条`);
      }
    }

    const homeActivities = await request('/home/activities');
    console.log(`GET /api/v1/home/activities - 状态码: ${homeActivities.status}`);
    console.log(`响应: ${JSON.stringify(homeActivities.data)}`);
    if (homeActivities.data.code === 1000) {
      console.log('✓ 首页活动 API 正常');
    }

    console.log('\n【3】认证 API 测试');
    console.log('-'.repeat(40));

    const devLogin = await request('/auth/dev-login', 'POST', { phone: '13800138000', code: '123456', identity: 'fan' });
    console.log(`POST /api/v1/auth/dev-login - 状态码: ${devLogin.status}`);
    console.log(`响应: ${JSON.stringify(devLogin.data)}`);
    if (devLogin.data.code === 2000 || devLogin.data.code === 1000) {
      token = devLogin.data.data.accessToken;
      testUserId = devLogin.data.data.user.id;
      console.log('✓ 开发模式登录成功');
      console.log(`  Token: ${token ? token.substring(0, 20) + '...' : 'N/A'}`);
      console.log(`  User ID: ${testUserId}`);
    } else {
      console.log('! 登录失败，尝试使用已有 token 测试');
    }

    console.log('\n【4】乐队模块 API 测试');
    console.log('-'.repeat(40));

    const bands = await request('/bands');
    console.log(`GET /api/v1/bands - 状态码: ${bands.status}`);
    console.log(`响应: ${JSON.stringify(bands.data)}`);
    if (bands.data.code === 1000 && bands.data.data.list) {
      console.log('✓ 乐队列表 API 正常');
      console.log(`  数据量: ${bands.data.data.list.length} 条`);
      if (bands.data.data.list.length > 0) {
        testBandId = bands.data.data.list[0].id;
        console.log(`  第一个乐队 ID: ${testBandId}`);
      }
    }

    if (testBandId) {
      const bandDetail = await request(`/bands/${testBandId}`);
      console.log(`GET /api/v1/bands/${testBandId} - 状态码: ${bandDetail.status}`);
      console.log(`响应: ${JSON.stringify(bandDetail.data)}`);
      if (bandDetail.data.code === 1000) {
        console.log('✓ 乐队详情 API 正常');
      }

      if (token) {
        const follow = await request(`/bands/${testBandId}/follow`, 'POST', {}, token);
        console.log(`POST /api/v1/bands/${testBandId}/follow - 状态码: ${follow.status}`);
        console.log(`响应: ${JSON.stringify(follow.data)}`);
        if (follow.data.code === 1000 || follow.data.code === 1001) {
          console.log('✓ 关注乐队 API 正常');
        }

        const unfollow = await request(`/bands/${testBandId}/follow`, 'POST', {}, token);
        console.log(`POST /api/v1/bands/${testBandId}/follow (取消) - 状态码: ${unfollow.status}`);
        console.log(`响应: ${JSON.stringify(unfollow.data)}`);
        if (unfollow.data.code === 1000 || unfollow.data.code === 1001) {
          console.log('✓ 取消关注 API 正常');
        }
      }
    }

    const bandMembers = await request(`/bands/${testBandId || 1}/members`);
    console.log(`GET /api/v1/bands/${testBandId || 1}/members - 状态码: ${bandMembers.status}`);
    console.log(`响应: ${JSON.stringify(bandMembers.data)}`);
    if (bandMembers.data.code === 1000) {
      console.log('✓ 乐队成员 API 正常');
    }

    console.log('\n【5】活动模块 API 测试');
    console.log('-'.repeat(40));

    const activities = await request('/activities');
    console.log(`GET /api/v1/activities - 状态码: ${activities.status}`);
    console.log(`响应: ${JSON.stringify(activities.data)}`);
    if (activities.data.code === 1000 && activities.data.data.list) {
      console.log('✓ 活动列表 API 正常');
      console.log(`  数据量: ${activities.data.data.list.length} 条`);
      if (activities.data.data.list.length > 0) {
        testActivityId = activities.data.data.list[0].id;
        console.log(`  第一个活动 ID: ${testActivityId}`);
      }
    }

    if (testActivityId) {
      const activityDetail = await request(`/activities/${testActivityId}`);
      console.log(`GET /api/v1/activities/${testActivityId} - 状态码: ${activityDetail.status}`);
      console.log(`响应: ${JSON.stringify(activityDetail.data)}`);
      if (activityDetail.data.code === 1000) {
        console.log('✓ 活动详情 API 正常');
      }

      if (token) {
        const signup = await request(`/activities/${testActivityId}/signup`, 'POST', {}, token);
        console.log(`POST /api/v1/activities/${testActivityId}/signup - 状态码: ${signup.status}`);
        console.log(`响应: ${JSON.stringify(signup.data)}`);
        if (signup.data.code === 1000 || signup.data.code === 1001) {
          console.log('✓ 活动报名 API 正常');
        }
      }
    }

    console.log('\n【6】用户模块 API 测试');
    console.log('-'.repeat(40));

    if (token) {
      const userInfo = await request('/users/me', 'GET', null, token);
      console.log(`GET /api/v1/users/me - 状态码: ${userInfo.status}`);
      console.log(`响应: ${JSON.stringify(userInfo.data)}`);
      if (userInfo.data.code === 1000) {
        console.log('✓ 用户信息 API 正常');
      }

      const userStats = await request('/users/me/stats', 'GET', null, token);
      console.log(`GET /api/v1/users/me/stats - 状态码: ${userStats.status}`);
      console.log(`响应: ${JSON.stringify(userStats.data)}`);
      if (userStats.data.code === 1000) {
        console.log('✓ 用户统计 API 正常');
      }
    }

    console.log('\n【7】帖子模块 API 测试');
    console.log('-'.repeat(40));

    const posts = await request('/posts');
    console.log(`GET /api/v1/posts - 状态码: ${posts.status}`);
    console.log(`响应: ${JSON.stringify(posts.data)}`);
    if (posts.data.code === 1000) {
      console.log('✓ 帖子列表 API 正常');
    }

    console.log('\n【8】市场模块 API 测试');
    console.log('-'.repeat(40));

    const products = await request('/products');
    console.log(`GET /api/v1/products - 状态码: ${products.status}`);
    console.log(`响应: ${JSON.stringify(products.data)}`);
    if (products.data.code === 1000) {
      console.log('✓ 商品列表 API 正常');
    }

    console.log('\n【9】排练室模块 API 测试');
    console.log('-'.repeat(40));

    const rooms = await request('/rooms');
    console.log(`GET /api/v1/rooms - 状态码: ${rooms.status}`);
    console.log(`响应: ${JSON.stringify(rooms.data)}`);
    if (rooms.data.code === 1000) {
      console.log('✓ 排练室列表 API 正常');
    }

    console.log('\n【10】招募模块 API 测试');
    console.log('-'.repeat(40));

    const recruitments = await request('/recruitments');
    console.log(`GET /api/v1/recruitments - 状态码: ${recruitments.status}`);
    console.log(`响应: ${JSON.stringify(recruitments.data)}`);
    if (recruitments.data.code === 1000) {
      console.log('✓ 招募列表 API 正常');
    }

    console.log('\n【11】搜索模块 API 测试');
    console.log('-'.repeat(40));

    const search = await request('/search?q=测试&type=all');
    console.log(`GET /api/v1/search?q=测试 - 状态码: ${search.status}`);
    console.log(`响应: ${JSON.stringify(search.data)}`);
    if (search.data.code === 1000) {
      console.log('✓ 搜索 API 正常');
    }

  } catch (error) {
    console.error('\n❌ 测试执行出错:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('测试完成');
  console.log('='.repeat(60));
}

runTests();
