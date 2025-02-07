const express = require('express');
const User = require('../models/User');
const router = express.Router();
const axios = require('axios');

// Функция для проверки существования пользователя в auth-service
const verifyUserInAuthService = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/verify-user`,
      { params: { userId } }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying user:', error.message);
    throw error;
  }
};

// Функция для получения рецептов из recipe-service
const getRecipesByIds = async (recipeIds) => {
  try {
    const response = await axios.get(
      `${process.env.RECIPE_SERVICE_URL || 'http://localhost:5002'}/api/recipes/bulk`,
      { params: { ids: recipeIds.join(',') } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    throw error;
  }
};

// Получить профиль пользователя
router.get('/profile', async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить профиль пользователя
router.put('/profile', async (req, res) => {
  const { userId, bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { bio }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получить сохраненные рецепты пользователя
router.get('/saved-recipes', async (req, res) => {
    const { userId } = req.query;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Получаем данные о рецептах из recipe-service
      const recipes = await getRecipesByIds(user.savedRecipes);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Сохранить рецепт
router.post('/save-recipe', async (req, res) => {
  const { userId, recipeId } = req.body;
  console.log('Received request to save recipe:', { userId, recipeId });
  
  try {
    // Проверяем существование пользователя в auth-service
    console.log('Verifying user in auth service...');
    await verifyUserInAuthService(userId);
    console.log('User verified successfully');
    
    // Ищем или создаем запись пользователя в user-service
    let user = await User.findById(userId);
    console.log('Existing user in user-service:', user);
    
    if (!user) {
      console.log('Creating new user record in user-service');
      user = new User({
        _id: userId,
        savedRecipes: []
      });
    }
    
    if (!user.savedRecipes.includes(recipeId)) {
      console.log('Adding recipe to saved recipes');
      user.savedRecipes.push(recipeId);
      await user.save();
      console.log('Recipe saved successfully');
    } else {
      console.log('Recipe already saved for this user');
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in save-recipe:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;