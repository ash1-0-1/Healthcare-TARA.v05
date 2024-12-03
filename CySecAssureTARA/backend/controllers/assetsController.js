// backend/controllers/assetsController.js
const Asset = require('../models/assetModel'); // Assuming you have a dynamic model setup

// Fetches existing controls for a specific asset by name
const getExistingControls = async (req, res) => {
    const { assetName } = req.params; // Asset name from URL parameters

    try {
        // Find the asset by name and retrieve the 'Existing Controls' field
        const asset = await Asset.findOne({ 'Asset Name': assetName });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Send back the existing controls as a response
        res.json({ controls: asset['Existing Controls'] });
    } catch (error) {
        console.error('Error fetching existing controls:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getExistingControls };

