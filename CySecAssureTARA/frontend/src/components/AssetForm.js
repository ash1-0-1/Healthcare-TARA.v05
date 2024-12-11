// frontend/src/components/AssetForm.js
import React, { useState } from 'react';

const AssetForm = ({ onSave }) => {
    const [actionOwner, setActionOwner] = useState('');
    const [riskIdentificationDate, setRiskIdentificationDate] = useState('');

    const handleSave = () => {
        if (actionOwner && riskIdentificationDate) {
            onSave({ actionOwner, riskIdentificationDate });
        } else {
            console.warn("Action Owner and Risk Identification Date are required.");
        }
    };

    return (
        <div className="asset-form">
            <div>
                <label>Risk Owner:</label>
                <input
                    type="text"
                    value={actionOwner}
                    onChange={(e) => setActionOwner(e.target.value)}
                />
            </div>
            <div>
                <label>Risk Identification Date:</label>
                <input
                    type="date"
                    value={riskIdentificationDate}
                    onChange={(e) => setRiskIdentificationDate(e.target.value)}
                />
            </div>
            <button onClick={handleSave}>Add Asset</button>
        </div>
    );
};

export default AssetForm;

