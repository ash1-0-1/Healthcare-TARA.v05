// frontend/src/components/popups/ExistingControlsPopup.js
import React, { useState, useEffect } from 'react';

const ExistingControlsPopup = ({ assetName, existingControls, selectedControls, onClose, onSave }) => {
    const [controls, setControls] = useState(selectedControls || []);

    useEffect(() => {
        setControls(selectedControls || []);
    }, [selectedControls]);

    const toggleControl = (control) => {
        setControls((prev) =>
            prev.includes(control) ? prev.filter((c) => c !== control) : [...prev, control]
        );
    };

    const handleSave = () => {
        onSave(assetName, controls);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Select Existing Controls for {assetName}</h3>
                {existingControls.map((control, index) => (
                    <div key={index} className="control-option">
                        <input
                            type="checkbox"
                            checked={controls.includes(control)}
                            onChange={() => toggleControl(control)}
                        />
                        <label>{control}</label>
                    </div>
                ))}
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default ExistingControlsPopup;

