// backend/controllers/collectionsController.js
const mongoose = require('mongoose');

// Retrieve all collections with their respective assets
const getCollectionsWithAssets = async (req, res) => {
    try {
        // Retrieve all collection names
        const allCollections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = allCollections.map(col => col.name);

        const collectionsWithAssets = [];

        // Fetch assets from each collection and structure the response
        for (const name of collectionNames) {
            const collection = mongoose.connection.db.collection(name);

            // Fetch all assets in the collection
            const assets = await collection.find({}, { projection: { "Asset Name": 1 } }).toArray();
            
            // Extract asset names
            const assetNames = assets.map(asset => asset["Asset Name"]);

            // Structure collection data with its assets
            collectionsWithAssets.push({
                name: name,
                assets: assetNames
            });
        }

        console.log("Fetched collections with assets:", collectionsWithAssets); // Debugging output
        res.json(collectionsWithAssets);
    } catch (error) {
        console.error("Error fetching collections with assets:", error);
        res.status(500).json({ message: "Failed to fetch collections with assets" });
    }
};

module.exports = { getCollectionsWithAssets };

