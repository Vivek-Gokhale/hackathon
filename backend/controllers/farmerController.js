const farmerModel = require('../models/farmerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/mailer');
const config = require('../utils/config');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client("320422409970-ldsi80jm4d9jmc33dq0lql91jim97r2o.apps.googlefarmercontent.com");


// const googleLogin = async (req, res, next) => {
//     try {
//         const { token } = req.body;
//         if (!token) {
//             return res.status(400).json({ message: 'Google token is required' });
//         }

//         const ticket = await googleClient.verifyIdToken({
//             idToken: token,
//             audience: config.googleClientId,
//         });

//         const payload = ticket.getPayload();
//         const email = payload.email;
//         const name = payload.name;

//         // Check if farmer exists based on email
//         let farmer = await farmerModel.getByEmail(email);

//         // If the farmer does not exist, create a new farmer
//         if (!farmer) {
//             farmer = await farmerModel.create({
//                 email,
//                 password: null, // No password needed for Google login
//             });

//             // Ensure farmer.fid exists before calling addfarmerModelname
//             if (farmer && farmer.id) {
//                 await farmerModel.addfarmerName(farmer.id, name);
//             } else {
//                 throw new Error("farmerModel ID is missing after creation.");
//             }
//         }

//         // Generate JWT token
//         const authToken = jwt.sign({ farmerId: farmer.fid, email: farmer.email }, config.jwtSecret, {
//             expiresIn: '1h',
//         });

//         res.json({
//             token: authToken,
//             farmerId: farmer.fid,
//             farmerEmail: farmer.email,
//             message: 'Google login successful',
//         });
//     } catch (error) {
//         logger.error('Error with Google login', error);
//         next(error);
//     }
// };




const registerFarmer = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body);
        const { email, phone, location, village_name, state, farmer_name, password } = req.body;

        // Validate all required fields
        if (!email || !phone || !location || !village_name || !state || !farmer_name || !password) {
            return res.status(400).json({ message: "All fields are required: email, phone, location, village_name, state, farmer_name, and password." });
        }

        // Check if farmer with email already exists
        const existingFarmer = await farmerModel.getByEmail(email);
        if (existingFarmer) {
            return res.status(400).json({ message: "A farmer with this email already exists." });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new farmer
        const newFarmer = await farmerModel.create({
            email,
            phone,
            location,
            village_name,
            state,
            farmer_name,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Farmer registered successfully", farmerId: newFarmer.fid });
    } catch (error) {
        logger.error("Error registering farmer", error);
        next(error);
    }
};

const loginFarmer = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Fetch farmer by email
        const farmer = await farmerModel.getByEmail(email);
        if (!farmer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, farmer.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { farmerId: farmer.fid, email: farmer.email },
            config.jwtSecret,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            farmerId: farmer.fid,
            farmerEmail: farmer.email,
            message: 'Login successful',
        });
    } catch (error) {
        logger.error('Error logging in farmer', error);
        next(error);
    }
};


const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const farmer = await farmerModel.getByEmail(email);

        console.log(farmer);

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer with this email not found' });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Convert expiry time to MySQL DATETIME format (if needed, though you're using MongoDB)
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);  // 5 minutes from now


        // Store OTP in the database
        await farmerModel.setOtp(farmer._id, otp, otpExpiry);  // ✅ Corrected line

        // Send OTP email
        const message = `Your password reset OTP is: ${otp}. It will expire in 5 minutes.`;
        await sendResetEmail(email, message);

        res.json({ message: 'Password reset OTP sent' });
    } catch (error) {
        logger.error('Error requesting password reset', error);
        next(error);
    }
};


const verifyOtp = async (req, res, next) => {
    try {

        const { email, otp } = req.body;

        const farmer = await farmerModel.getByEmail(email);
        console.log(farmer);
        if (!farmer || farmer.reset_token != otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const tokenExpiryTime = new Date(farmer.reset_token_expiry);
        if (tokenExpiryTime < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        logger.error('Error verifying OTP', error);
        next(error);
    }
};


const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        const farmer = await farmerModel.getByEmail(email);

        if (!farmer) {
            return res.status(400).json({ message: 'farmerModel not found' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await farmerModel.updatePassword(farmer._id, hashedPassword);
        await farmerModel.clearResetToken(farmer._id);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        logger.error('Error resetting password', error);
        next(error);
    }
};



module.exports = {
    registerFarmer,
    loginFarmer,
    requestPasswordReset,
    resetPassword,
    // googleLogin,
    verifyOtp,
};