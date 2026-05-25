const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const corsConfig = require('./config/cors');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const { apiLimiter } = require('./middlewares/rateLimit');

const app = express();

app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/static', express.static(path.join(__dirname, '../static')));

app.use(apiLimiter);

app.get('/', (req, res) => {
  res.json({
    code: 1000,
    message: 'Gojica API Server',
    data: {
      version: '1.0.0',
      status: 'running',
      apiBase: '/api/v1',
      endpoints: {
        health: '/health',
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        bands: '/api/v1/bands',
        activities: '/api/v1/activities',
        home: '/api/v1/home',
      },
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    code: 1000,
    message: 'OK',
    data: {
      status: 'running',
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api/v1', require('./routes'));

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
