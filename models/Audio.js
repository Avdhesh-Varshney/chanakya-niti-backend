// backend/models/Audio.js
const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  language: { type: String },
  genre: { type: String },
});

module.exports = mongoose.model('Audio', audioSchema);
