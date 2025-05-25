const mongoose = require('mongoose');

const farmLandSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },

  farm_size: { type: String, required: true },           // e.g., "2 acres"
  soil_type: { type: String, required: true },           // e.g., "Loamy", "Sandy"
  
  crop_cycle: {
    previous_crops: [{ type: String }],
    current_crops: [{ type: String }],
    date_of_sowing: { type: Date },
    expected_harvest: { type: Date },
  },

  yield_last_year: { type: String },                     // e.g., "500 kg"
  pesticides_used: [{ type: String }],
  disease_history: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('FarmLand', farmLandSchema);

