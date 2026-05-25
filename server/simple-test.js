const http = require('http');

const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/health',
  'http://localhost:3000/api/v1/home/stats'
];

let index = 0;

function test(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(`\n${url}`);
        console.log('Status:', res.statusCode);
        console.log('Response:', data.substring(0, 500));
        resolve();
      });
    });
    req.on('error', (e) => {
      console.log(`\n${url}`);
      console.log('Error:', e.message);
      resolve();
    });
    req.setTimeout(3000, () => {
      console.log(`\n${url} - TIMEOUT`);
      req.destroy();
      resolve();
    });
  });
}

async function run() {
  for (const url of urls) {
    await test(url);
  }
  console.log('\nDone');
}

run();
