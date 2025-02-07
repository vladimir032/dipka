
const express = require('express');
const User = require('../models/User');
const Recipe = require('/diploma/kulinar_main/recipe-service/routes/recipes.js');
const router = express.Router();
const axios = require('axios');

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
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.savedRecipes.includes(recipeId)) {
      user.savedRecipes.push(recipeId);
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;