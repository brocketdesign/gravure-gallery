const express = require('express');
const router = express.Router();
const Image = require('../models/Image');

// Get latest images with pagination, one random image per unique postUrl
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const images = await Image.aggregate([
      // Add a random number to each document
      { $addFields: { rand: { $rand: {} } } },
      
      // Sort by postUrl and the random number
      { $sort: { postUrl: 1, rand: 1 } },
      
      // Group by postUrl and select the first image in each group (random due to sort)
      { 
        $group: { 
          _id: "$postUrl", 
          image: { $first: "$$ROOT" } 
        } 
      },
      
      // Replace the root with the selected image
      { $replaceRoot: { newRoot: "$image" } },
      
      // Sort the resulting images by createdAt in descending order
      { $sort: { createdAt: -1 } },
      
      // Apply pagination
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

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
        { 'title': { $regex: q, $options: 'i' } },
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

// Get images by postUrl using a query parameter
router.get('/post', async (req, res) => {
  const { postUrl } = req.query;
  try {
    const images = await Image.find({ postUrl });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get related images, excluding images from the same post
router.get('/related/:id', async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const images = await Image.find({
      tags: { $in: image.tags },
      _id: { $ne: id },
      postUrl: { $ne: image.postUrl }, // Exclude images from the same post
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
