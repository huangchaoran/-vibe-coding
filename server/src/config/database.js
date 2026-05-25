module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  database: process.env.DB_NAME || 'gojica_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: process.env.DB_DIALECT || 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 20000,
    idle: 10000,
    evict: 10000,
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
  dialectOptions: {
    connectTimeout: 10000,
    charset: 'utf8mb4',
  },
};
