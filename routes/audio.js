// backend/routes/audio.js
const express = require('express');
const Audio = require('../models/Audio');
const authenticateToken = require('../middlewares/auth');
const router = express.Router();

// Get all audios (accessible to authenticated users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const audios = await Audio.find();
    res.status(200).json(audios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audios' });
  }
});

module.exports = router;
