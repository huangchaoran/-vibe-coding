const http = require('http');

const testApi = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: JSON.parse(data) });
      });
    }).on('error', reject);
  });
};

(async () => {
  console.log('=== Testing Gojica API ===\n');
  
  try {
    console.log('1. Testing /home/stats...');
    const stats = await testApi('http://localhost:3000/api/v1/home/stats');
    console.log('Status:', stats.status);
    console.log('Response:', JSON.stringify(stats.data, null, 2));
    console.log('');
    
    console.log('2. Testing /bands...');
    const bands = await testApi('http://localhost:3000/api/v1/bands');
    console.log('Status:', bands.status);
    console.log('Response:', JSON.stringify(bands.data, null, 2).slice(0, 500) + '...');
    console.log('');
    
    console.log('3. Testing /activities...');
    const activities = await testApi('http://localhost:3000/api/v1/activities');
    console.log('Status:', activities.status);
    console.log('Response:', JSON.stringify(activities.data, null, 2).slice(0, 500) + '...');
    console.log('');
    
    console.log('4. Testing /search?q=摇滚...');
    const search = await testApi('http://localhost:3000/api/v1/search?q=摇滚');
    console.log('Status:', search.status);
    console.log('Response:', JSON.stringify(search.data, null, 2).slice(0, 500) + '...');
    
    console.log('\n=== All API Tests Passed! ===');
  } catch (error) {
    console.error('Error:', error.message);
  }
})();