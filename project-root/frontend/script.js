$(document).ready(function () {
    // Fetch collections when the document is ready
    fetchCollections();

    // Event handler for the Save Asset button
    $('#saveAssetButton').on('click', saveAsset);

    // Event handler for changes in the asset dropdown
    $('#assetDropdown').on('change', function () {
        const selectedValue = $(this).val();
        if (selectedValue && selectedValue !== "Select Asset") {
            const [classification] = selectedValue.split(':');
            fetchControls(classification);
        }
    });
});

// Fetch collections and populate the asset dropdown
function fetchCollections() {
    $.ajax({
        url: 'http://127.0.0.1:5000/api/collections',
        method: 'GET',
        success: function (data) {
            populateAssetDropdown(data);
        },
        error: function () {
            alert('Error fetching collections');
        }
    });
}

// Populate the asset dropdown with collections and assets in nested format
function populateAssetDropdown(collections) {
    const dropdown = $('#assetDropdown');
    dropdown.empty(); // Clear previous options
    dropdown.append('<option>Select Asset</option>'); // Default option

    collections.forEach(function (collection) {
        // Create an option group for each collection
        const group = $('<optgroup>').attr('label', collection.name);
        
        // Add each asset as an option within the group
        collection.assets.forEach(function (asset) {
            const option = $('<option>').val(`${collection.name}:${asset}`).text(asset);
            group.append(option);
        });
        dropdown.append(group); // Append the group to the dropdown
    });
}

// Fetch effective controls based on the selected classification
function fetchControls(classification) {
    $.ajax({
        url: `http://127.0.0.1:5000/api/controls/${classification}`,
        method: 'GET',
        success: function (data) {
            populateControls(data);
        },
        error: function () {
            alert('Error fetching controls');
        }
    });
}

// Populate the controls as checkboxes
function populateControls(controls) {
    const container = $('#existingControlsContainer');
    container.empty(); // Clear previous controls

    controls.forEach(function (control) {
        const checkbox = $('<input>').attr('type', 'checkbox').val(control);
        const label = $('<label>').text(control).prepend(checkbox);
        container.append(label);
    });
}

// Save asset data and display in the saved assets panel
function saveAsset() {
    const assetData = {
        actionOwner: $('#actionOwner').val(),
        plannedCompletionDate: $('#plannedCompletionDate').val(),
        actionStatus: $('#actionStatus').val(),
        riskStatus: $('#riskStatus').val(),
        riskIdentificationDate: $('#riskIdentificationDate').val(),
        riskAddressedDate: $('#riskAddressedDate').val(),
        reviewedBy: $('#reviewedBy').val(),
        remarks: $('#remarks').val(),
        nextReviewDate: $('#nextReviewDate').val(),
        selectedControls: $('#existingControlsContainer input:checked').map(function () { return $(this).val(); }).get()
    };

    // Display saved asset in the right-side panel
    const listItem = $('<li>').text(assetData.actionOwner);
    $('#savedAssetsList').append(listItem);

    // Reset form fields
    $('input, textarea').val('');
    $('#existingControlsContainer input:checkbox').prop('checked', false);
}

