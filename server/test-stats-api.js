const http = require('http');

// 先登录获取token
function login() {
	return new Promise((resolve, reject) => {
		const postData = JSON.stringify({
			code: 'test',
			identity: 'fan'
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
					if (result.code === 1000) {
						console.log('Login successful:', result.data);
						resolve(result.data.accessToken);
					} else {
						reject(new Error(result.message));
					}
				} catch (e) {
					reject(e);
				}
			});
		});
		
		req.on('error', reject);
		req.write(postData);
		req.end();
	});
}

// 获取统计数据
function getStats(token) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'localhost',
			port: 3000,
			path: '/api/v1/users/stats',
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`
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
					console.log('Stats response:', result);
					resolve(result);
				} catch (e) {
					reject(e);
				}
			});
		});
		
		req.on('error', reject);
		req.end();
	});
}

// 测试流程
async function test() {
	try {
		console.log('Testing stats API...');
		console.log('='.repeat(50));
		
		const token = await login();
		console.log('Token:', token.substring(0, 50) + '...');
		
		console.log('\nGetting stats...');
		const stats = await getStats(token);
		
		console.log('\n✅ Test successful!');
		console.log('Stats data:', stats.data);
		
	} catch (error) {
		console.error('❌ Test failed:', error.message);
	}
}

test();
