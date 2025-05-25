const FarmLand = require('../schemas/farmLandSchema');

// Check if farmland exists for a farmer
const getByFarmerId = async (farmerId) => {
  return await FarmLand.findOne({ farmer: farmerId });
};

const createNewFarmData = async (farmerId, data) => {
  const {
    farm_size,
    soil_type,
    crop_cycle,
    yield_last_year,
    pesticides_used,
    disease_history
  } = data;

  const newFarmLand = new FarmLand({
    farmer: farmerId,
    farm_size,
    soil_type,
    crop_cycle,
    yield_last_year,
    pesticides_used,
    disease_history
  });

  await newFarmLand.save();
  return newFarmLand;
};


const updateFarmData = async (farmerId, data) => {
  const {
    farm_size,
    soil_type,
    crop_cycle,
    yield_last_year,
    pesticides_used,
    disease_history
  } = data;

  const updatedFarmLand = await FarmLand.findOneAndUpdate(
    { farmer: farmerId },
    {
      farm_size,
      soil_type,
      crop_cycle,
      yield_last_year,
      pesticides_used,
      disease_history
    },
    { new: true } // return the updated document
  );

  return updatedFarmLand;
};


module.exports = {
  createNewFarmData,
  updateFarmData,
  getByFarmerId
};
