const farmLandModel = require("../models/farmLandModel");
const farmerModel = require("../models/farmerModel");

const setFarmLand = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    const {
      email,
      farm_size,
      soil_type,
      crop_cycle,
      yield_last_year,
      pesticides_used,
      disease_history,
    } = req.body;

    // Validate required fields
    if (!email || !farm_size || !soil_type || !pesticides_used) {
      return res.status(400).json({
        message:
          "Fields required: email, farm_size, soil_type, pesticides_used",
      });
    }

    // Get farmer by email
    const existingFarmer = await farmerModel.getByEmail(email);

    if (!existingFarmer) {
      return res.status(404).json({ message: "Farmer not found with given email" });
    }

    // Check if farmland record exists for the farmer
    const existingFarmLand = await farmLandModel.getByFarmerId(existingFarmer._id);

    if (!existingFarmLand) {
      // No farmland exists — create one
      await farmLandModel.createNewFarmData(existingFarmer._id, req.body);
      return res.status(201).json({ message: "New farmland created for existing farmer" });
    } else {
      // Farmland exists — update it
      await farmLandModel.updateFarmData(existingFarmer._id, req.body);
      return res.json({ message: "Farmland data updated for existing farmer" });
    }

  } catch (error) {
    console.error("Error in setFarmLand:", error);
    next(error);
  }
};

module.exports = { setFarmLand };
