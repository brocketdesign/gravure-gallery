const express = require('express');
const router = express.Router();
const Image = require('../models/Image');

// Get latest images with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  try {
    const images = await Image.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get images by tag or search term
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  try {
    const images = await Image.find({
      $or: [
        { 'title.en': { $regex: q, $options: 'i' } },
        { 'title.ja': { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get related images by tag
router.get('/related/:id', async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  try {
    const image = await Image.findById(id);
    const images = await Image.find({
      tags: { $in: image.tags },
      _id: { $ne: id },
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single image
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
