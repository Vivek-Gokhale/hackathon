
const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');

router.post('/register', farmerController.registerFarmer);
router.post('/login', farmerController.loginFarmer);
router.post('/reset-request', farmerController.requestPasswordReset);
router.post('/verify-otp', farmerController.verifyOtp);
router.post('/reset-password', farmerController.resetPassword);
// router.post('/google-login', farmerController.googleLogin);

module.exports = router;