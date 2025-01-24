const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: Number, required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  accountIds: { type: [Number], default: [] }, // Stocker des IDs de comptes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);