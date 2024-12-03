// Fetch collections and populate the asset dropdown
$(document).ready(function () {
    fetchCollections();

    $('#saveAssetButton').on('click', saveAsset);
});

function fetchCollections() {
    $.ajax({
        url: 'http://localhost:5000/api/collections/',
        method: 'GET',
        success: function (data) {
            populateAssetDropdown(data);
        },
        error: function () {
            alert('Error fetching collections');
        }
    });
}

function populateAssetDropdown(collections) {
    collections.forEach(function (collection) {
        const group = $('<optgroup>').attr('label', collection.name);
        collection.assets.forEach(function (asset) {
            const option = $('<option>').val(asset).text(asset);
            group.append(option);
        });
        $('#assetDropdown').append(group);
    });
}

// When an asset is selected, fetch the controls
$('#assetDropdown').on('change', function () {
    const assetName = $(this).val();
    if (assetName !== "Select Asset") {
        fetchControls(assetName);
    }
});

function fetchControls(classification) {
    $.ajax({
        url: `http://localhost:5000/api/controls/${classification}`,
        method: 'GET',
        success: function (data) {
            populateControls(data);
        },
        error: function () {
            alert('Error fetching controls');
        }
    });
}

function populateControls(controls) {
    $('#existingControlsContainer').empty();
    controls.forEach(function (control) {
        const checkbox = $('<input>').attr('type', 'checkbox').val(control);
        const label = $('<label>').text(control).prepend(checkbox);
        $('#existingControlsContainer').append(label);
    });
}

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

