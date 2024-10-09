const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    en: String,
    ja: String,
  },
  tags: [String],
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Image', imageSchema);
