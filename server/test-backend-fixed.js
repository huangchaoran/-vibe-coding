const http = require('http');
const path = require('path');
const app = require(path.join(__dirname, 'src', 'app'));

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  runTests(server);
});

function fetch(port, path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests(server) {
  try {
    console.log('\n=== Gojica 后端 API 测试 ===\n');

    // 测试根路径
    const root = await fetch(PORT, '/');
    console.log('GET / =>', JSON.stringify(root.data).substring(0, 300));

    // 测试健康检查
    const health = await fetch(PORT, '/health');
    console.log('GET /health =>', JSON.stringify(health.data));

    // 测试 API v1
    const apiV1 = await fetch(PORT, '/api/v1');
    console.log('GET /api/v1 =>', JSON.stringify(apiV1.data).substring(0, 200));

    // 测试 home/stats
    const stats = await fetch(PORT, '/api/v1/home/stats');
    console.log('\nGET /api/v1/home/stats =>');
    console.log('Status:', stats.status);
    console.log('Response:', JSON.stringify(stats.data, null, 2));

    // 测试 home/bands
    const bands = await fetch(PORT, '/api/v1/home/bands');
    console.log('\nGET /api/v1/home/bands =>');
    console.log('Status:', bands.status);
    console.log('Response:', JSON.stringify(bands.data, null, 2));

    // 测试 home/activities
    const activities = await fetch(PORT, '/api/v1/home/activities');
    console.log('\nGET /api/v1/home/activities =>');
    console.log('Status:', activities.status);
    console.log('Response:', JSON.stringify(activities.data, null, 2));

    // 测试 bands list
    const bandsList = await fetch(PORT, '/api/v1/bands');
    console.log('\nGET /api/v1/bands =>');
    console.log('Status:', bandsList.status);
    console.log('Response:', JSON.stringify(bandsList.data, null, 2));

    // 测试 dev-login
    const loginRes = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: PORT,
        path: '/api/v1/auth/dev-login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
          catch { resolve({ status: res.statusCode, data: data }); }
        });
      });
      req.write(JSON.stringify({ phone: '13800138000', code: '123456', identity: 'fan' }));
      req.end();
    });
    console.log('\nPOST /api/v1/auth/dev-login =>');
    console.log('Status:', loginRes.status);
    console.log('Response:', JSON.stringify(loginRes.data, null, 2));

    console.log('\n=== 测试完成 ===');
  } catch (error) {
    console.error('测试出错:', error.message);
  } finally {
    server.close();
  }
}
