// backend/routes/collectionsRoutes.js
const express = require('express');
const router = express.Router();
const { getCollectionsWithAssets } = require('../controllers/collectionsController');

// Route to get all collections with assets
router.get('/collections-with-assets', getCollectionsWithAssets);

module.exports = router;

