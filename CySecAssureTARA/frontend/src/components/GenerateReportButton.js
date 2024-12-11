// frontend/src/components/GenerateReportButton.js
import React from 'react';

const GenerateReportButton = ({ assetList }) => {
    const handleGenerateReport = async () => {
        try {
            const response = await fetch('/api/reports/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetList }) // Include assets with controls data
            });

            if (response.ok) {
                const result = await response.json();
                window.open(result.reportUrl, '_blank');
            } else {
                const result = await response.json();
                console.error('Failed to generate report:', result.message);
            }
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    return (
        <button onClick={handleGenerateReport} className="generate-report-button">
            Generate Report
        </button>
    );
};

export default GenerateReportButton;

