const Expert = require('../models/expertModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { sendResetEmail } = require('../utils/mailer');
const config = require('../utils/config');

// Register Expert
const registerExpert = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body);
        const { email, phone, location, expert_name, qualification, specialization, experience_years, password } = req.body;

        if (!email || !phone || !location || !expert_name || !qualification || !specialization || !experience_years || !password) {
            return res.status(400).json({ message: "All fields are required: email, phone, location, expert_name, qualification, specialization, experience_years, password" });
        }

        const existingExpert = await Expert.getByEmail( email );
        if (existingExpert) {
            return res.status(400).json({ message: "An expert with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newExpert = await Expert.create({
            email,
            phone,
            location,
            expert_name,
            qualification,
            specialization,
            experience_years,
            password: hashedPassword
        });

        res.status(201).json({ message: "Expert registered successfully", expertId: newExpert._id });
    } catch (error) {
        logger.error("Error registering expert", error);
        next(error);
    }
};

// Login Expert
const loginExpert = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const expert = await Expert.findOne({ email });
        if (!expert || !(await bcrypt.compare(password, expert.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { expertId: expert._id, email: expert.email },
            config.jwtSecret,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            expertId: expert._id,
            expertEmail: expert.email,
            message: 'Login successful',
        });
    } catch (error) {
        logger.error('Error logging in expert', error);
        next(error);
    }
};

// Request Password Reset (Send OTP)
const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const expert = await Expert.findOne({ email });

        if (!expert) {
            return res.status(404).json({ message: 'Expert with this email not found' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        expert.reset_token = otp;
        expert.reset_token_expiry = otpExpiry;
        await expert.save();

        const message = `Your password reset OTP is: ${otp}. It will expire in 5 minutes.`;
        await sendResetEmail(email, message);

        res.json({ message: 'Password reset OTP sent' });
    } catch (error) {
        logger.error('Error requesting password reset', error);
        next(error);
    }
};

// Verify OTP
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const expert = await Expert.findOne({ email });
        if (!expert || expert.reset_token !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date(expert.reset_token_expiry) < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        logger.error('Error verifying OTP', error);
        next(error);
    }
};

// Reset Password
const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        const expert = await Expert.findOne({ email });
        if (!expert) {
            return res.status(400).json({ message: 'Expert not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        expert.password = hashedPassword;
        expert.reset_token = null;
        expert.reset_token_expiry = null;
        await expert.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        logger.error('Error resetting password', error);
        next(error);
    }
};

module.exports = {
    registerExpert,
    loginExpert,
    requestPasswordReset,
    verifyOtp,
    resetPassword
};
