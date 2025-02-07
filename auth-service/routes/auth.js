const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Вход
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Проверка JWT
router.get('/validate', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    res.json({ userId: decoded.userId });
  });
});

// Добавьте этот endpoint в auth-service
router.get('/verify-user', async (req, res) => {
  const { userId } = req.query;
  console.log('Verifying user:', userId);
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User verified successfully:', userId);
    res.json({ userId: user._id });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;