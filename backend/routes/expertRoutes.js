
const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');

router.post('/register', expertController.registerExpert);
router.post('/login', expertController.loginExpert);
router.post('/reset-request', expertController.requestPasswordReset);
router.post('/verify-otp', expertController.verifyOtp);
router.post('/reset-password', expertController.resetPassword);
// router.post('/google-login', expertController.googleLogin);

module.exports = router;