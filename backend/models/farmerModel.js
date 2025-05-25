const Farmer = require('../schemas/farmerSchema'); // Import the schema

// Create a new farmer
const create = async (farmerData) => {
  const {
    email,
    phone,
    location,
    village_name,
    state,
    farmer_name,
    password
  } = farmerData;

  const newFarmer = new Farmer({
    email,
    phone,
    location,
    village_name,
    state,
    farmer_name,
    password
  });

  await newFarmer.save();
  return {
    fid: newFarmer._id,
    email: newFarmer.email
  };
};

// Get farmer by email
const getByEmail = async (email) => {
  return await Farmer.findOne({ email });
};

// Set OTP and expiry for password reset
const setOtp = async (farmerId, otp, otpExpiry) => {
  return await Farmer.findByIdAndUpdate(
    farmerId,
    { reset_token: otp, reset_token_expiry: otpExpiry },
    { new: true }
  );
};

// Update farmer's password
const updatePassword = async (farmerId, newPassword) => {
  return await Farmer.findByIdAndUpdate(
    farmerId,
    { password: newPassword },
    { new: true }
  );
};

// Clear OTP token after password reset
const clearResetToken = async (farmerId) => {
  return await Farmer.findByIdAndUpdate(
    farmerId,
    { reset_token: null, reset_token_expiry: null },
    { new: true }
  );
};

module.exports = {
  create,
  getByEmail,
  setOtp,
  updatePassword,
  clearResetToken
};
