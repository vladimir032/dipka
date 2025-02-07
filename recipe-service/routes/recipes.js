const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Получить все рецепты
router.get('/', async (req, res) => {
  console.log("Get all recipes");
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать рецепт
router.post('/', async (req, res) => {
  const { title, description, ingredients, instructions, imageUrl, userId } = req.body;
  try {
    const recipe = await Recipe.create({ title, description, ingredients, instructions, imageUrl, userId });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получить один рецепт
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить рецепт
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Удалить рецепт
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить рецепты по массиву ID
router.get('/bulk', async (req, res) => {
    const { ids } = req.query;
    try {
      const recipeIds = ids.split(',').map(id => mongoose.Types.ObjectId(id));
      const recipes = await Recipe.find({ _id: { $in: recipeIds } });
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;