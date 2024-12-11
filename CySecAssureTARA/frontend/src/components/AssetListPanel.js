// frontend/src/components/AssetListPanel.js
import React, { useState } from 'react';
import ExistingControlsPopup from './popups/ExistingControlsPopup';

const AssetListPanel = ({ savedAssets, onUpdateAssetControls }) => {
    const [selectedAsset, setSelectedAsset] = useState(null);

    const openPopup = (asset) => setSelectedAsset(asset);
    const closePopup = () => setSelectedAsset(null);

    const handleSaveControls = (assetName, controls) => {
        onUpdateAssetControls(assetName, controls);
        closePopup();
    };

    return (
        <div className="asset-list-panel">
            <h3>Saved Assets</h3>
            <ul>
                {savedAssets.map((asset, index) => (
                    <li key={index} onClick={() => openPopup(asset)}>
                        {index + 1}. {asset.assetName}
                        <div>Action Owner: {asset.actionOwner}</div>
                        <div>Risk Identification Date: {asset.riskIdentificationDate}</div>
                        <div>Existing Controls: {asset.existingControls.join(', ')}</div>
                    </li>
                ))}
            </ul>
            {selectedAsset && (
                <ExistingControlsPopup
                    assetName={selectedAsset.assetName}
                    existingControls={selectedAsset.availableControls}
                    selectedControls={selectedAsset.existingControls}
                    onClose={closePopup}
                    onSave={handleSaveControls}
                />
            )}
        </div>
    );
};

export default AssetListPanel;

