// backend/controllers/controlsController.js
const mongoose = require('mongoose');

const getControlsForAsset = async (req, res) => {
    const assetName = decodeURIComponent(req.params.assetName);

    try {
        console.log(`Fetching controls for asset: ${assetName}`);

        // Retrieve all collections in the database
        const allCollections = await mongoose.connection.db.listCollections().toArray();
        const assetCollections = allCollections.map(col => col.name);

        console.log(`Searching across collections: ${assetCollections}`);

        let asset = null;

        // Search for the asset in each collection
        for (const collectionName of assetCollections) {
            const collection = mongoose.connection.db.collection(collectionName);
            asset = await collection.findOne({ "Asset Name": assetName });

            if (asset) {
                console.log(`Asset found in collection ${collectionName}:`, asset);
                break; // Exit the loop once asset is found
            }
        }

        // Check if asset has "Existing Controls" and return it
        if (asset && asset["Existing Controls"]) {
            const controls = asset["Existing Controls"].split('\n').map(control => control.trim());
            console.log(`Controls for asset ${assetName}:`, controls);
            res.json({ controls });
        } else if (asset) {
            res.status(404).json({ message: "No controls found for this asset" });
        } else {
            res.status(404).json({ message: "Asset not found" });
        }
    } catch (error) {
        console.error("Error fetching controls for asset:", error);
        res.status(500).json({ message: "Failed to fetch controls" });
    }
};

module.exports = { getControlsForAsset };

