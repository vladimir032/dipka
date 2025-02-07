const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express.js
const app = express();

// Прокси для auth-service
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    changeOrigin: true
  })
);

// Прокси для recipe-service
app.use(
  '/api/recipes',
  createProxyMiddleware({
    target: process.env.RECIPE_SERVICE_URL || 'http://localhost:5002',
    changeOrigin: true
  })
);

// Прокси для user-service
app.use(
  '/api/users',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:5003',
    changeOrigin: true
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));