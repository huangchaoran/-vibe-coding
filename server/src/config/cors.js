module.exports = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:3000',
      'http://localhost:9528',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:3000',
    ];

    if (process.env.NODE_ENV === 'development' || !origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
};
