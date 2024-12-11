// frontend/src/App.js

import React, { useState } from 'react';
import DropdownMenu from './components/DropdownMenu';
import AssetForm from './components/AssetForm';
import AssetListPanel from './components/AssetListPanel';
import './styles/App.css';

const App = () => {
    const [savedAssets, setSavedAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [fetchedControls, setFetchedControls] = useState([]);
    const [controlsPerAsset, setControlsPerAsset] = useState({});

    // Handle asset selection
    const handleSelectAsset = (assetName) => {
        setSelectedAssets((prev) => {
            if (!prev.includes(assetName)) {
                return [...prev, assetName];
            }
            return prev;
        });
    };

    // Fetch and update available controls for the selected asset
    const handleControlsFetched = (controls) => {
        setFetchedControls(controls);
        setControlsPerAsset((prev) => {
            const lastSelectedAsset = selectedAssets[selectedAssets.length - 1];
            if (lastSelectedAsset && !(lastSelectedAsset in prev)) {
                return { ...prev, [lastSelectedAsset]: { existingControls: [], additionalControls: controls } };
            }
            return prev;
        });
    };

    // Toggle control selection for each asset independently
    const handleControlSelection = (assetName, control) => {
        setControlsPerAsset((prev) => {
            const { existingControls = [], additionalControls = fetchedControls } = prev[assetName] || {};

            // Update existingControls and additionalControls arrays
            let updatedExistingControls, updatedAdditionalControls;
            if (existingControls.includes(control)) {
                updatedExistingControls = existingControls.filter((c) => c !== control);
                updatedAdditionalControls = [...additionalControls, control];
            } else {
                updatedExistingControls = [...existingControls, control];
                updatedAdditionalControls = additionalControls.filter((c) => c !== control);
            }

            return {
                ...prev,
                [assetName]: {
                    existingControls: updatedExistingControls,
                    additionalControls: updatedAdditionalControls,
                },
            };
        });
    };

    // Save asset data
    const handleSaveAsset = (assetData) => {
        if (selectedAssets.length > 0) {
            const assetsToSave = selectedAssets.map((asset) => {
                const { existingControls = [], additionalControls = [] } = controlsPerAsset[asset] || {};

                return {
                    assetName: asset,
                    actionOwner: assetData.actionOwner,
                    riskIdentificationDate: assetData.riskIdentificationDate,
                    mitigationTimeline: "10-15 Days from Risk Identification Date",
                    existingControls,
                    additionalControls,
                };
            });

            // Update saved assets and clear selected states
            setSavedAssets((prevAssets) => [...prevAssets, ...assetsToSave]);
            setSelectedAssets([]);
            setControlsPerAsset({});
            console.log("Assets saved:", assetsToSave);
        } else {
            console.warn("Please select at least one asset.");
        }
    };

    // Handle Generate Report functionality
    const handleGenerateReport = async () => {
        try {
            console.log("Generate Report button clicked");

            // POST request to generate the report
            const response = await fetch('http://localhost:5000/api/reports/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetList: savedAssets }),
            });

            if (response.ok) {
                const blob = await response.blob(); // Create a Blob for the downloaded file

                // Create a download URL and trigger a download
                const downloadUrl = window.URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                downloadLink.download = 'Risk_Assessment_Report.xlsx'; // Set the downloaded file name
                downloadLink.click();

                // Revoke the Blob URL to free memory
                window.URL.revokeObjectURL(downloadUrl);

                console.log("Report downloaded successfully!");
            } else {
                console.error("Failed to generate report:", await response.text());
            }
        } catch (error) {
            console.error("Error generating or downloading report:", error);
        }
    };

    return (
        <div
            className="background"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + '/CySecAssureBG.jpeg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <div className="overlay">
                <div className="left-panel">
                    <DropdownMenu
                        selectedAssets={selectedAssets}
                        onSelectAsset={handleSelectAsset}
                        onControlsFetched={handleControlsFetched}
                    />
                    <AssetForm onSave={handleSaveAsset} />
                </div>
                <div className="right-panel">
                    <h3>Available Controls</h3>
                    {fetchedControls.length > 0 ? (
                        fetchedControls.map((control) => (
                            <div key={control} className="control-option">
                                <input
                                    type="checkbox"
                                    checked={(controlsPerAsset[selectedAssets[selectedAssets.length - 1]]?.existingControls || []).includes(control)}
                                    onChange={() => handleControlSelection(selectedAssets[selectedAssets.length - 1], control)}
                                />
                                <label>{control}</label>
                            </div>
                        ))
                    ) : (
                        <p>Select an asset to see controls</p>
                    )}
                    <AssetListPanel
                        savedAssets={savedAssets}
                        onUpdateAssetControls={(assetName, controls) => {
                            setControlsPerAsset((prev) => ({
                                ...prev,
                                [assetName]: { ...prev[assetName], existingControls: controls },
                            }));
                        }}
                    />
                    <div className="generate-report-container">
                        <button onClick={handleGenerateReport} className="generate-report-button">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
