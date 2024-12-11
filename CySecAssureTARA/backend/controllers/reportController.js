// backend/controllers/reportController.js
const path = require('path');
const ExcelJS = require('exceljs');
const collections = require('../config/collectionConfig'); // Collection list
const getAssetModel = require('../models/assetModel'); // Dynamic model generator

// Helper function to escape special characters in regex
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
}

const generateReport = async (req, res) => {
    try {
        const { assetList } = req.body; // Array of assets with all necessary fields

        // Path to the Excel template
        const templatePath = path.join(__dirname, '../templates/CySecAssure_Template.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);
        const worksheet = workbook.getWorksheet('Risk Assessment');
        if (!worksheet) {
            console.error("Worksheet 'Risk Assessment' not found in template");
            return res.status(500).json({ message: "Worksheet not found in template" });
        }

        let currentRow = 7;
        let serialNo = 1; // Start serial number from 1

        for (const assetData of assetList) {
            const { assetName, actionOwner, riskIdentificationDate, existingControls, additionalControls } = assetData;

            // Escape special characters and create a regex for case-insensitive matching
            const escapedAssetName = escapeRegex(assetName);
            const regex = new RegExp(`^${escapedAssetName}$`, 'i');

            let dbData = null;

            // Loop through collections to find the asset data
            for (const collectionName of collections) {
                const AssetModel = getAssetModel(collectionName);
                dbData = await AssetModel.findOne({ 'Asset Name': regex });
                if (dbData) {
                    console.log(`Found data in collection '${collectionName}' for asset: ${assetName}`);
                    break;
                }
            }

            if (!dbData) {
                console.warn(`No data found in any collection for asset: ${assetName}`);
            }

            // Populate Excel worksheet, omitting or shifting data as specified
            worksheet.getCell(`A${currentRow}`).value = serialNo++; // Serial Number
            worksheet.getCell(`B${currentRow}`).value = dbData?.['Asset ID'] || 'Data Not Found';
            worksheet.getCell(`C${currentRow}`).value = assetName || 'Asset Not Found';
            worksheet.getCell(`D${currentRow}`).value = dbData?.['Impact on Confidentiality'] || 'Data Not Found';
            worksheet.getCell(`E${currentRow}`).value = dbData?.['Impact on Integrity'] || 'Data Not Found';
            worksheet.getCell(`F${currentRow}`).value = dbData?.['Impact on Availability'] || 'Data Not Found';

            // Skip G column
            worksheet.getCell(`H${currentRow}`).value = dbData?.['Threats'] || 'Data Not Found';
            worksheet.getCell(`I${currentRow}`).value = dbData?.['Vulnerabilities'] || 'Data Not Found';
            worksheet.getCell(`J${currentRow}`).value = dbData?.['Risks'] || 'Data Not Found';

            // Selected controls
            worksheet.getCell(`K${currentRow}`).value = existingControls && existingControls.length > 0 
                ? existingControls.join('\n') 
                : 'No Controls Selected';

            // Calculate Control Effectiveness and populate L column
            const controlCount = existingControls ? existingControls.length : 0;
            let controlEffectiveness;
            if (controlCount >= 3) {
                controlEffectiveness = "Effective";
            } else if (controlCount === 2) {
                controlEffectiveness = "Moderate";
            } else if (controlCount === 1) {
                controlEffectiveness = "Ineffective";
            } else {
                controlEffectiveness = "Data Not Found";
            }
            worksheet.getCell(`L${currentRow}`).value = controlEffectiveness;

            // Fetch and populate Impact in N column
            worksheet.getCell(`N${currentRow}`).value = dbData?.['Impact'] || 'Data Not Found';

            // Skip M, O, P, and Q columns
            worksheet.getCell(`R${currentRow}`).value = dbData?.['Risk Treatment Category'] || 'Data Not Found';
            worksheet.getCell(`S${currentRow}`).value = additionalControls && additionalControls.length > 0 
                ? additionalControls.join('\n') 
                : 'No Additional Controls';

            worksheet.getCell(`T${currentRow}`).value = dbData?.['Revised Probability'] || 'Data Not Found';
            worksheet.getCell(`U${currentRow}`).value = dbData?.['Revised Impact'] || 'Data Not Found';

            // Skip V and W columns
            worksheet.getCell(`X${currentRow}`).value = actionOwner || 'Data Not Found';
            worksheet.getCell(`Y${currentRow}`).value = riskIdentificationDate || 'Data Not Found';

            // Leave AB, AC, AD, AE columns empty
            currentRow++;
        }

        // Save the populated workbook to a new file in the reports directory
        const reportPath = path.join(__dirname, '../reports/Risk Assessment Report.xlsx');
        await workbook.xlsx.writeFile(reportPath);

        console.log("Report generated successfully at:", reportPath);

        // Serve the file for download
        res.download(reportPath, 'Risk Assessment Report.xlsx', (err) => {
            if (err) {
                console.error('Error sending file for download:', err);
                res.status(500).send('Error downloading the file.');
            }
        });

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Failed to generate report.' });
    }
};

module.exports = { generateReport };
