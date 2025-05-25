const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  expert_name: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  specialization: {
    type: [String], // e.g., ['Soil', 'Crops', 'Pesticides']
    required: true
  },
  experience_years: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  assigned_queries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Query'
  }],
  password: {
    type: String,
    required: true
  },
  avg_rating: {
    type: Number,
    default: 0
  },
  // Optional: For password reset
  reset_token: { type: String, default: null },
  reset_token_expiry: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);
