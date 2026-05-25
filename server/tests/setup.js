process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'gojica_db';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = '66366888';
process.env.DB_HOST = 'localhost';
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '24h';

global.jestTimeout = 30000;

console.log('测试环境已设置:', { NODE_ENV: process.env.NODE_ENV });