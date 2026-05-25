/**
 * Gojica 登录测试脚本
 * 快速测试登录功能
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// 测试开发模式登录
function devLogin(identity = 'fan') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      phone: '13800138000',
      identity: identity
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/auth/dev-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// 测试普通登录
function login(phone, code, identity = 'fan') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      phone: phone,
      code: code,
      identity: identity
    });

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

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// 测试获取用户信息
function getUserProfile(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/users/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

// 主函数
async function main() {
  console.log('🔐 Gojica 登录测试\n');

  try {
    // 1. 测试开发模式登录
    console.log('1️⃣ 测试开发模式登录...');
    const loginResult = await devLogin('fan');
    
    if (loginResult.code === 1000 || loginResult.code === 200) {
      console.log('✅ 登录成功！');
      console.log('   用户信息:', loginResult.data.user.nickname || '测试用户');
      console.log('   Token:', loginResult.data.accessToken.substring(0, 20) + '...');
      
      // 2. 测试获取用户信息
      console.log('\n2️⃣ 测试获取用户信息...');
      const profileResult = await getUserProfile(loginResult.data.accessToken);
      
      if (profileResult.code === 1000 || profileResult.code === 200) {
        console.log('✅ 获取用户信息成功！');
        console.log('   用户ID:', profileResult.data.id);
        console.log('   昵称:', profileResult.data.nickname);
        console.log('   身份:', profileResult.data.identity);
      } else {
        console.log('❌ 获取用户信息失败:', profileResult.message);
      }
      
    } else {
      console.log('❌ 登录失败:', loginResult.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 测试完成！');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n💡 请确保后端服务器已启动:');
    console.log('   cd server');
    console.log('   npm start');
  }
}

// 运行测试
main();
