// backend/routes/assetsRoutes.js
const express = require('express');
const { getExistingControls } = require('../controllers/assetsController'); // Import controller function
const router = express.Router();

// Route to fetch existing controls for a specific asset by name
router.get('/:assetName/controls', getExistingControls);

module.exports = router;

