// backend/models/collectionModel.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  "Asset Name": String
});

module.exports = mongoose.model('Asset', assetSchema, 'AssetCollection'); // Replace 'AssetCollection' with the specific collection name

