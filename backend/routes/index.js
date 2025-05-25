const express = require('express');
const router = express.Router();
const farmerRoutes = require('./farmerRoutes');
const farmLandRoutes = require("./farmLandRoutes");

router.use('/farmer', farmerRoutes);
router.use('/farm-land', farmLandRoutes);
module.exports = router;
