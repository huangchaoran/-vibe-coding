const http = require('http');

const apiRequest = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
};

async function seedData() {
  console.log('🌱 添加测试数据到数据库...\n');

  try {
    // 1. 开发模式登录获取token
    console.log('📝 步骤1: 开发模式登录...');
    const loginResult = await apiRequest('/api/v1/auth/dev-login', 'POST', { identity: 'musician' });
    console.log('   登录状态:', loginResult.status);
    
    if (loginResult.status !== 200) {
      console.log('   ❌ 登录失败');
      console.log('   响应:', loginResult.data);
      return;
    }
    
    const token = loginResult.data.data?.accessToken;
    console.log('   ✅ 登录成功');
    console.log('   Token:', token ? '已获取' : '未获取');
    
    if (!token) {
      console.log('   ❌ 无法获取Token');
      return;
    }

    // 2. 添加乐队
    console.log('\n📝 步骤2: 添加测试乐队...');
    const bands = [
      { name: '暗夜摇滚团', style: 'Rock', intro: '一支来自北京的独立摇滚乐队' },
      { name: '节拍工厂', style: 'Jazz', intro: '专注爵士乐的激情乐队' },
      { name: '紫色幻想', style: 'Pop', intro: '流行音乐爱好者' },
      { name: '绿洲乐团', style: 'Folk', intro: '民谣音乐组合' }
    ];
    
    const bandIds = [];
    for (const band of bands) {
      try {
        const createBand = await apiRequest('/api/v1/bands', 'POST', band, token);
        if (createBand.status === 201) {
          bandIds.push(createBand.data.data?.id);
          console.log('   ✅ 创建乐队:', band.name);
        } else {
          console.log('   ⚠️ 创建乐队失败:', band.name, '-', createBand.data.message || createBand.status);
        }
      } catch (e) {
        console.log('   ❌ 创建乐队异常:', e.message);
      }
    }

    // 3. 添加活动
    console.log('\n📝 步骤3: 添加测试活动...');
    const activities = [
      { 
        title: '五月Live House 音乐节', 
        type: 'performance',
        description: '一场精彩的Live House音乐节',
        start_time: '2026-05-10 10:00:00',
        end_time: '2026-05-10 18:00:00',
        location: '北京三里屯',
        max_participants: 100,
        price: 0
      },
      { 
        title: '爵士乐大赏', 
        type: 'competition',
        description: '年度爵士乐比赛',
        start_time: '2026-05-08 14:00:00',
        end_time: '2026-05-08 18:00:00',
        location: '上海新天地',
        max_participants: 80,
        price: 50
      }
    ];
    
    for (const activity of activities) {
      try {
        const createActivity = await apiRequest('/api/v1/activities', 'POST', activity, token);
        if (createActivity.status === 201) {
          console.log('   ✅ 创建活动:', activity.title);
        } else {
          console.log('   ⚠️ 创建活动失败:', activity.title, '-', createActivity.data.message || createActivity.status);
        }
      } catch (e) {
        console.log('   ❌ 创建活动异常:', e.message);
      }
    }

    console.log('\n✅ 测试数据添加完成！');
    console.log('\n📊 请刷新小程序查看数据');

  } catch (e) {
    console.log('\n❌ 错误:', e.message);
    console.log(e.stack);
  }
}

seedData();
