const express = require('express');
const router = express.Router();
const farmerRoutes = require('./farmerRoutes');

router.use('/farmer', farmerRoutes);
module.exports = router;
