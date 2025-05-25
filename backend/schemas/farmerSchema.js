const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  village_name: { type: String, required: true },
  state: { type: String, required: true },
  farmer_name: { type: String, required: true },
  password: { type: String, required: true },

  // For password reset
  reset_token: { type: String, default: null },
  reset_token_expiry: { type: Date, default: null },

  // Array of query references
  queries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Query'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
