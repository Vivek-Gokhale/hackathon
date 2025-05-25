const express = require('express');
const router = express.Router();
const farmerRoutes = require('./farmerRoutes');
const farmLandRoutes = require("./farmLandRoutes");
const queryRoutes = require("./queryRoutes");
const expertRoutes = require("./expertRoutes");

router.use('/farmer', farmerRoutes);
router.use('/farm-land', farmLandRoutes);
router.use('/farm-query', queryRoutes);
router.use('/expert', expertRoutes);
module.exports = router;
