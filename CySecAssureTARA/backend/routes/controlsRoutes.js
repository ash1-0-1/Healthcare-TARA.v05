// backend/routes/controlsRoutes.js
const express = require('express');
const router = express.Router();
const { getControlsForAsset } = require('../controllers/controlsController');

// Route to get existing controls for a specific asset
router.get('/assets/:assetName/controls', getControlsForAsset);

module.exports = router;

