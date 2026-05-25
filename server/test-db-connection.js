require('dotenv').config({ path: '.env.test' });

const { Sequelize } = require('sequelize');

console.log('环境变量:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '***' : undefined
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 1,
      min: 0,
      acquire: 5000,
      idle: 1000,
    },
    dialectOptions: {
      connectTimeout: 5000,
    },
  }
);

async function testConnection() {
  try {
    console.log('开始连接数据库...');
    const startTime = Date.now();
    await sequelize.authenticate();
    const endTime = Date.now();
    console.log(`✅ 数据库连接成功！耗时: ${endTime - startTime}ms`);
    
    console.log('查询数据库列表...');
    const [results, metadata] = await sequelize.query('SHOW DATABASES');
    console.log('可用数据库:', results.map(db => Object.values(db)[0]));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

testConnection();
