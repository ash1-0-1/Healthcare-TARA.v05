// frontend/src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchCollectionsWithAssets = async () => {
    try {
        console.log("Attempting to fetch collections with assets...");
        const response = await axios.get(`${API_BASE_URL}/collections-with-assets`);
        console.log("Fetched collections with assets:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching collections with assets:", error);
        return [];
    }
};

export const fetchControlsForAsset = async (assetName) => {
    try {
        const encodedAssetName = encodeURIComponent(assetName);
        console.log(`Attempting to fetch controls for asset: ${assetName}`);

        const response = await axios.get(`${API_BASE_URL}/assets/${encodedAssetName}/controls`);
        
        console.log(`Response from backend for controls of ${assetName}:`, response.data);
        return response.data.controls;
    } catch (error) {
        console.error(`Error fetching controls for asset ${assetName}:`, error);
        return [];
    }
};

export const saveAsset = async (data) => {
    try {
        console.log("Attempting to save asset data:", data);
        await axios.post(`${API_BASE_URL}/save-asset`, data);
        console.log("Asset saved successfully!");
        alert("Asset saved successfully!");
    } catch (error) {
        console.error("Error saving asset:", error);
    }
};

export const fetchSavedAssets = async () => {
    try {
        console.log("Attempting to fetch saved assets...");
        const response = await axios.get(`${API_BASE_URL}/saved-assets`);
        console.log("Fetched saved assets:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching saved assets:", error);
        return [];
    }
};

