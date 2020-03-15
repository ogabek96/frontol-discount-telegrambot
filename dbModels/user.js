const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  cardNumber: {
    type: String,
  },
  language: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
