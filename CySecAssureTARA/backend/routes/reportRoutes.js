// backend/routes/reportRoutes.js
const express = require('express');
const { generateReport } = require('../controllers/reportController'); // Only import generateReport
const router = express.Router();

// POST route to generate the report
router.post('/generate-report', generateReport);

module.exports = router;

