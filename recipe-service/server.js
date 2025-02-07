const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express.js
const app = express();

// Подключение к базе данных
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/api/recipes', require('./routes/recipes'));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Recipe Service running on port ${PORT}`));

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2E2ODZlMzA0MzcxNmRiYWQxZmQxM2IiLCJpYXQiOjE3Mzg5NjczOTMsImV4cCI6MTczODk3MDk5M30.4ZBHs7MnUEUtg1mtjqKueWWQppx0211GYUoed3RX6lA
