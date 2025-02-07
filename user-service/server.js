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
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));