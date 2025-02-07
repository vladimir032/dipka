const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId }, // ID должен совпадать с ID в auth-service
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
});

// Модель Recipe должна быть в отдельном файле в recipe-service
// Здесь оставляем только модель User
const User = mongoose.model('User', userSchema);
module.exports = User;