
const express = require('express');
const router = express.Router();
const farmLandController = require('../controllers/farmLandController');

router.post('/set-farmland', farmLandController.setFarmLand);

module.exports = router;