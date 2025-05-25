const Expert = require('../schemas/expertSchema'); // this is the fixed schema you provided

// Get expert by email
const getByEmail = async (email) => {
  return await Expert.findOne({ email });
};

// Create new expert
const create = async (data) => {
  const newExpert = new Expert(data);
  return await newExpert.save();
};

// Set OTP
const setOtp = async (expertId, otp, expiry) => {
  return await Expert.findByIdAndUpdate(
    expertId,
    {
      reset_token: otp,
      reset_token_expiry: expiry
    },
    { new: true }
  );
};

// Update password
const updatePassword = async (expertId, hashedPassword) => {
  return await Expert.findByIdAndUpdate(
    expertId,
    { password: hashedPassword },
    { new: true }
  );
};

// Clear reset token
const clearResetToken = async (expertId) => {
  return await Expert.findByIdAndUpdate(
    expertId,
    {
      reset_token: null,
      reset_token_expiry: null
    },
    { new: true }
  );
};

module.exports = {
  getByEmail,
  create,
  setOtp,
  updatePassword,
  clearResetToken,
};
