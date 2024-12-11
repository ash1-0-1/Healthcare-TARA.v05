// frontend/src/components/DropdownMenu.js
import React, { useState, useEffect } from 'react';
import { fetchCollectionsWithAssets, fetchControlsForAsset } from '../services/apiService';

const DropdownMenu = ({ selectedAssets, onSelectAsset, onControlsFetched }) => {
    const [collections, setCollections] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [controls, setControls] = useState([]); // Store controls for the selected asset

    const toggleDropdown = () => setIsOpen(prev => !prev);

    useEffect(() => {
        const loadCollections = async () => {
            const data = await fetchCollectionsWithAssets();
            setCollections(data);
        };
        loadCollections();
    }, []);

    const handleAssetClick = async (assetName) => {
        onSelectAsset(assetName);
        
        // Fetch existing controls for the selected asset
        console.log(`Attempting to fetch controls for ${assetName}`);
        const fetchedControls = await fetchControlsForAsset(assetName);
        setControls(fetchedControls); // Store controls in local state
        console.log(`Fetched controls for ${assetName}:`, fetchedControls);

        onControlsFetched(fetchedControls); // Pass controls up to parent component
    };

    return (
        <div className="dropdown-menu">
            <button onClick={toggleDropdown}>Select Assets</button>
            {isOpen && (
                <div className="dropdown-list">
                    {collections.length > 0 ? (
                        collections.map((collection) => (
                            <div key={collection.name} className="collection-group">
                                <div className="collection-title">{collection.name}</div>
                                {collection.assets.map((asset) => (
                                    <div key={asset} className="dropdown-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedAssets.includes(asset)}
                                            onChange={() => handleAssetClick(asset)}
                                        />
                                        <label>{asset}</label>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No assets available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

