// backend/models/assetModel.js
const mongoose = require('mongoose');

// Define a reusable schema for assets
const assetSchema = new mongoose.Schema({
    'Asset ID': String,
    'Risk ID': String,
    'Asset Name': String,
    'Impact on Confidentiality': Number,
    'Impact on Integrity': Number,
    'Impact on Availability': Number,
    'Asset Value': Number,
    'Threats': String,
    'Vulnerabilities': String,
    'Risks': String,
    'Existing Controls': String,
    'Control Effectiveness': String,
    'Probability': Number,
    'Impact': Number,
    'Risk Value': Number,
    'Priority for Risk Treatment': String,
    'Risk Treatment Category': String,
    'Actions or Additional Controls': String,
    'Revised Probability': Number,
    'Revised Impact': Number,
    'Revised Risk Value': Number
});

// Function to return a model tied to a specific collection name
function getAssetModel(collectionName) {
    return mongoose.model(collectionName, assetSchema, collectionName);
}

module.exports = getAssetModel;

