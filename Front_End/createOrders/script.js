const host = localStorage.getItem('host');
const port = localStorage.getItem('port');
const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");
const clientId = urlParams.get("client_id");
const clientName = urlParams.get("client_name");
console.log(backPath);
console.log(clientId);
console.log(clientName);
document.getElementById('pageTitle').textContent = clientName;

// DOM Elements
const orderButtonsContainer = document.querySelector('.buttons-container');
const orderDescriptionContainer = document.getElementById('order-description-container');
const clientChoiceModal = document.getElementById('clientChoiceModal');
const dateTimePickerModal = document.getElementById('dateTimePickerModal');
const datePicker = document.getElementById('datePicker');
const timePicker = document.getElementById('timePicker');
const phoneNumbersSelect = document.getElementById('phoneNumbers');
const addressesSelect = document.getElementById('addresses');
let selectedDate = '';
let selectedTime = '';

// Initialize the page based on clientId
async function initializePage() {
    if (!clientId) {
        // If clientId is not provided, show client options
        orderButtonsContainer.style.display = 'none';
        orderDescriptionContainer.style.display = 'none';
        clientChoiceModal.style.display = 'flex'; // Show modal for client options
    } else {
        // If clientId exists, show order-related options and fetch client details
        orderButtonsContainer.style.display = 'flex';
        orderDescriptionContainer.style.display = 'block';
        clientChoiceModal.style.display = 'none'; // Hide the modal
        await fetchClientContactInfo(clientId); // Fetch phone numbers and addresses
    }
}

// Redirect to the search clients page
function redirectToSearchPage() {
    const pagePath1 = `../../createOrders/createOrdersForDays.html?path=${encodeURIComponent(backPath)}`;
    window.location.href = `../ADD&SEARCH/SEARCH&UPDATE clietns & clietnts_printers/search_clients.html?path=${encodeURIComponent(pagePath1)}`;
}

// Redirect to the create client page
function redirectToCreateClientPage() {
    const pagePath2 = `../../../createOrders/createOrdersForDays.html?path=${encodeURIComponent(backPath)}`;
    window.location.href = `../ADD&SEARCH/ADD clients & clietns_printers/add_clients/add_clients.html?path=${encodeURIComponent(pagePath2)}`;
}

// Handle "Create Order" based on selected option
function createOrder(option) {
    const date = new Date();
    if (option === 'today' || option === 'tomorrow') {
        if (option === 'tomorrow') {
            date.setDate(date.getDate() + 1); // Tomorrow's date
        }
        selectedDate = date.toISOString().split('T')[0];
        openModal(selectedDate); // Force user to select time
    } else if (option === 'else') {
        openModal(); // Open modal for custom date and time
    }
}

// Open the modal for selecting date and time
function openModal(predefinedDate = '') {
    // Set predefined date if provided, otherwise use today's date
    datePicker.value = predefinedDate || new Date().toISOString().split('T')[0];
    datePicker.disabled = !!predefinedDate; // Disable date picker for predefined dates
    timePicker.value = "12:00"; // Default time
    dateTimePickerModal.style.display = 'flex'; // Show modal
}

// Confirm date and time selection
function confirmDateTime() {
    selectedDate = datePicker.value;
    selectedTime = timePicker.value;
    closeModal();
    alert(`Date and Time selected: ${selectedDate} ${selectedTime}`);
}

// Close the modal
function closeModal() {
    dateTimePickerModal.style.display = 'none';
}

// Submit the order
async function submitOrder() {
    if (!selectedDate || !selectedTime) {
        alert("Please select a date and time first.");
        return;
    }

    const orderDescription = document.getElementById('order_description').value || "no description";
    const orderDateTime = `${selectedDate} ${selectedTime}:00`;
    const orderData = {
        order_datetime: orderDateTime,
        description: orderDescription,
        phone_number_id: phoneNumbersSelect.value ? Number(phoneNumbersSelect.value) : null,
        address_id: addressesSelect.value ? Number(addressesSelect.value) : null,
        client_id: Number(clientId)
    };
    alert(`Order submitted:\n${orderDateTime}\n${clientName}`);
    const commandAO = 'add_order';
    const urlAO = `http://${host}:${port}/${commandAO}`;

    try {
        // Fetch the data from the backend
        const response = await fetch(urlAO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        alert(`Order added successfully`);
        console.log("Order added:", data);
        window.location.href = backPath;
    } catch (error) {
        alert(`Error: Client not added to the order list`);
        console.error("Error adding order:", error);
    }
}

// Navigate back to the previous page
function backPage() {
    window.location.href = backPath;
}

// Initialize the page when the script runs
initializePage();
function addPhoneNumber() {
    document.getElementById('newPhoneNumberContainer').style.display = 'block';
}

// Submit new phone number
async function submitPhoneNumber() {
    const newPhoneNumber = document.getElementById('newPhoneNumber').value;
    if (!newPhoneNumber) {
        alert("Please enter a valid phone number.");
        return;
    }

    const data = { client_id: Number(clientId), phone_number: newPhoneNumber };
    const urlAddPhone = `http://${host}:${port}/add_client_phone_numbers`;

    try {
        const response = await fetch(urlAddPhone, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({phone_numbers: [data]})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const addedPhone = await response.json();
        alert(`Phone number added id is: ${addedPhone.phone_number_id}`);

        // Update dropdown
        const option = document.createElement('option');
        option.value = addedPhone.phone_number_id;
        option.textContent = newPhoneNumber;
        phoneNumbersSelect.appendChild(option);
        phoneNumbersSelect.value = option.value;
        document.getElementById('newPhoneNumberContainer').style.display = 'none'; // Hide input
    } catch (error) {
        alert(`Error adding phone number: ${error.message}`);
        console.error("Error adding phone number:", error);
    }
}

// Add new address
function addAddress() {
    document.getElementById('newAddressContainer').style.display = 'block';
}

// Submit new address
async function submitAddress() {
    const newAddress = document.getElementById('newAddress').value;
    if (!newAddress) {
        alert("Please enter a valid address.");
        return;
    }

    const data = { client_id: Number(clientId), client_address: newAddress };
    const urlAddAddress = `http://${host}:${port}/add_client_addresses`;

    try {
        const response = await fetch(urlAddAddress, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({client_addresses:[data]})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const addedAddress = await response.json();
        console.log(addedAddress)
        alert(`Address added id is: ${addedAddress.address_id}`);

        // Update dropdown
        const option = document.createElement('option');
        option.value = addedAddress.address_id;
        option.textContent = newAddress;
        addressesSelect.appendChild(option);
        addressesSelect.value = option.value;
        document.getElementById('newAddressContainer').style.display = 'none'; // Hide input
    } catch (error) {
        alert(`Error adding address: ${error.message}`);
        console.error("Error adding address:", error);
    }
}

async function fetchClientContactInfo(clientId) {
    try {
        // Fetch client phone numbers
        const command = 'get_client_phone_numbers';
    const url = `http://${host}:${port}/${command}`;
        // Fetch the data from the backend
        const phoneNumbersResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({client_id:Number(clientId)})
        })
        if (!phoneNumbersResponse.ok) {
            throw new Error(`HTTP error while fetching phone numbers! status: ${phoneNumbersResponse.status}`);
        }
        const phoneNumbersData = await phoneNumbersResponse.json();
        console.log(phoneNumbersData);
        // Populate phone numbers dropdown
        phoneNumbersData.forEach(phone => {
            const option = document.createElement('option');
            option.value = phone.id;
            option.textContent = phone.phone_number;
            phoneNumbersSelect.appendChild(option);
        });

        // Fetch client addresses
        const commandGA = 'get_client_addresses';
        const urlGA = `http://${host}:${port}/${commandGA}`;
            // Fetch the data from the backend
            const addressesResponse = await fetch(urlGA, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({client_id:Number(clientId)})
            })
            if (!addressesResponse.ok) {
                throw new Error(`HTTP error while fetching addresses! status: ${addressesResponse.status}`);
            }
            const addressesData = await addressesResponse.json();
        console.log(addressesData);

        // Populate addresses dropdown
        addressesData.forEach(address => {
            const option = document.createElement('option');
            option.value = address.id;
            option.textContent = address.address;
            addressesSelect.appendChild(option);
        });

        // Show the client contact container (if not already visible)
        clientContactContainer.style.display = 'block';
    } catch (error) {
        console.error("Error fetching client contact info:", error);
    }
}