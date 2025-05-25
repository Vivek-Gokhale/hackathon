const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  queryInNativeLanguage: {
    type: String,
    required: true,
    trim: true
  },
  queryInEnglish: {
    type: String,
    required: true,
    trim: true
  },
  image_path: {
    type: String, // Store file path or URL
    default: null
  },
  voice_path: {
    type: String, // Store file path or URL
    default: null
  },
  submit_date: {
    type: Date,
    default: Date.now
  },
  solved_date: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'resolved'],
    default: 'pending'
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert', // assuming you have an Expert model
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  query_answer: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
