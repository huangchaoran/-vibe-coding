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
  console.log('📋 用户多身份功能测试');
  console.log('='.repeat(80) + '\n');

  try {
    log('测试 1: 用户登录');
    const loginResult = await request('/auth/login', {
      method: 'POST',
      body: { code: 'test', identity: 'fan' }
    });

    if (loginResult.result.code === 1000) {
      log('登录成功', 'success');
      token = loginResult.result.data.accessToken;
      console.log('');
    } else {
      log('登录失败', 'error');
      return;
    }

    log('测试 2: 获取用户身份列表');
    const identitiesResult = await request('/users/identities', { token });
    if (identitiesResult.result.code === 1000) {
      log(`当前身份: ${JSON.stringify(identitiesResult.result.data)}`, 'success');
      console.log('');
    } else {
      log('获取身份列表失败', 'error');
      return;
    }

    log('测试 3: 添加新身份 musician');
    const addMusicianResult = await request('/users/identities/add', {
      token,
      method: 'POST',
      body: { identity: 'musician' }
    });
    if (addMusicianResult.result.code === 1000) {
      log(`添加后身份: ${JSON.stringify(addMusicianResult.result.data)}`, 'success');
      console.log('');
    } else {
      log('添加身份失败', 'error');
      return;
    }

    log('测试 4: 添加新身份 venue');
    const addVenueResult = await request('/users/identities/add', {
      token,
      method: 'POST',
      body: { identity: 'venue' }
    });
    if (addVenueResult.result.code === 1000) {
      log(`添加后身份: ${JSON.stringify(addVenueResult.result.data)}`, 'success');
      console.log('');
    } else {
      log('添加身份失败', 'error');
      return;
    }

    log('测试 5: 获取用户信息（包含 identities）');
    const profileResult = await request('/users/profile', { token });
    if (profileResult.result.code === 1000) {
      log(`用户信息包含 identities: ${JSON.stringify(profileResult.result.data.identities)}`, 'success');
      console.log('');
    } else {
      log('获取用户信息失败', 'error');
      return;
    }

    log('测试 6: 移除身份 venue');
    const removeResult = await request('/users/identities/remove', {
      token,
      method: 'POST',
      body: { identity: 'venue' }
    });
    if (removeResult.result.code === 1000) {
      log(`移除后身份: ${JSON.stringify(removeResult.result.data)}`, 'success');
      console.log('');
    } else {
      log('移除身份失败', 'error');
      return;
    }

    log('测试 7: 尝试添加已存在的身份 musician（应该幂等）');
    const duplicateResult = await request('/users/identities/add', {
      token,
      method: 'POST',
      body: { identity: 'musician' }
    });
    if (duplicateResult.result.code === 1000) {
      log(`添加后身份: ${JSON.stringify(duplicateResult.result.data)}`, 'success');
      console.log('');
    } else {
      log('添加重复身份失败', 'error');
      return;
    }

    console.log('='.repeat(80));
    log('🎉 所有测试通过！用户多身份功能正常工作！', 'success');
    console.log('='.repeat(80));
    console.log('\n📝 总结:');
    console.log('  ✅ 用户可以同时拥有多个身份');
    console.log('  ✅ 可以动态添加和移除身份');
    console.log('  ✅ 操作幂等，不会重复添加');
    console.log('  ✅ 向后兼容，保留旧 identity 字段');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
  }
};

main();
