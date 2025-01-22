const host = localStorage.getItem('host');
const port = localStorage.getItem('port');
const backPagebutton = document.getElementById('back_page');
const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");
console.log(backPath);
//const pagePath = `../add_clients/add_clients.html?path=${encodeURIComponent(backPath)}`;
backPagebutton.addEventListener('click', async () => {
    console.log(backPath);
    window.location.href = `${backPath}`;
});
function disableAllFields() {
    // Disable all input fields, selects, and buttons except for the Save and Back buttons
    const inputs = document.querySelectorAll("input, select, button");
    inputs.forEach(input => {
        if (input.id !== "makeOrderButton" && input.id !== "back_page" && input.id !== "addPrinterButton") {
            input.disabled = true;
        }
    });
}
async function replaceSaveButton(clientId, clientName) {
    const buttonContainer = document.getElementById("buttonContainer");
    // Clear the container
    buttonContainer.innerHTML = "";
    // Create "Add Printer to Client" button
    const addPrinterButton = document.createElement("button");
    addPrinterButton.id = "addPrinterButton";
    addPrinterButton.textContent = "Ավելացնել պրինտեր հաճախորդին";
    addPrinterButton.addEventListener("click", function (event) {
        event.preventDefault();
        const pagePath1 = `../add_clients/add_clients.html?path=${encodeURIComponent(backPath)}`;
        window.location.href = `../add_client_printers/add_clients_printers_.html?client_id=${clientId}&client_name=${clientName}&path=${encodeURIComponent(pagePath1)}`;
    });

    // Create "Make Order" button
    const makeOrderButton = document.createElement("button");
    makeOrderButton.id = "makeOrderButton";
    makeOrderButton.textContent = "Ստեղծել Այց";
    makeOrderButton.addEventListener("click", async function (event) {
        event.preventDefault();
            const userConfirmed = confirm(`Ցանկանում եք ${clientName}-ին ավելացնել պատվերի մեջ?`);
            if (userConfirmed){
                const pagePath2 = `../ADD&SEARCH/ADD clients & clietns_printers/add_clients/add_clients.html?path=${encodeURIComponent(backPath)}`;
                window.location.href = `../../../createOrders/createOrdersForDays.html?client_id=${clientId}&client_name=${clientName}&path=${encodeURIComponent(pagePath2)}`;
            }
    });

    // Append buttons to the container
    buttonContainer.appendChild(addPrinterButton);
    buttonContainer.appendChild(makeOrderButton);
}

document.getElementById("saveButton").addEventListener("click", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const llc = document.getElementById("llc").value;
    const clientType = document.getElementById("client_type").value; // Get the selected client type

    // Get all phone numbers (excluding the first empty one)
    const phoneElements = document.querySelectorAll("input[name='phone[]']");
    const phones = Array.from(phoneElements).slice(1).map(input => input.value);

    // Get all addresses
    const addressElements = document.querySelectorAll("input[name='address[]']");
    const addresses = Array.from(addressElements).slice(1).map(input => input.value);

    // Validate form fields
    if (!name || !phones.some(phone => phone) || !addresses.some(address => address)||!llc) {
        alert("Խնդրում ենք լրացնել բոլոր դաշտերը.");
        return;
    }
    try {
        // Get form values

        // Step 1: Send Client Data
        const clientData = {
            name: name,
            llc: llc,
            client_type: clientType
        };

        const command = 'add_client';
        const url = `http://${host}:${port}/${command}`;

        const clientResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        if (!clientResponse.ok) throw new Error("Հաճախորդը ավելացնելը ձախողվեց.");
        const clientResponseData = await clientResponse.json();
        const newClientId = Number(clientResponseData.client_id);
        console.log("Հաճախորդը ավելացված է:", clientResponseData);

        // Step 2: Send Phone Numbers
        await sendPhoneNumbers(newClientId, phones);

        // Step 3: Send Addresses
        await sendAddresses(newClientId, addresses);
        await replaceSaveButton(newClientId, name);
        disableAllFields();
        alert("Հաճախորդը հաջողությամբ ավելացված է");
    } catch (error) {
        console.error("Սխալ:", error);
        alert("Սխալ է տեղի ունեցել հաճախորդի տեղեկատվությունը պահպանելու ընթացքում.");
    }
});

// Function to send phone numbers
async function sendPhoneNumbers(clientId, phones) {
    const phoneData = phones.map(phone => ({ client_id: clientId, phone_number: phone }));
    console.log(phoneData);

    const response = await fetch(`http://${localStorage.getItem('host')}:${localStorage.getItem('port')}/add_client_phone_numbers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone_numbers: phoneData })
    });

    if (!response.ok) throw new Error("Հեռախոսահամարների ավելացումը ձախողվեց.");
    const data = await response.json();
    console.log("Հեռախոսահամարները ավելացված են:", data);
}

// Function to send addresses
async function sendAddresses(clientId, addresses) {
    const addressData = addresses.map(address => ({ client_id: clientId, client_address: address }));
    console.log(addressData);

    const response = await fetch(`http://${localStorage.getItem('host')}:${localStorage.getItem('port')}/add_client_addresses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_addresses: addressData })
    });

    if (!response.ok) throw new Error("Հասցեների ավելացումը ձախողվեց.");
    const data = await response.json();
    console.log("Հասցեները ավելացված են:", data);
}


// Initialize an array to hold the phone numbers

document.getElementById("addPhoneButton").addEventListener("click", function() {
    const phoneContainer = document.getElementById("phoneContainer");

    // Get all the phone number input fields
    const phoneInputs = phoneContainer.querySelectorAll("input[name='phone[]']");
    const lastPhoneInput = phoneInputs[0];

    // Get the value of the last phone number input field
    const lastPhoneNumber = lastPhoneInput.value.trim();

    // If the last phone number field is empty, show an alert and prevent adding a new field
    if (lastPhoneNumber === "") {
        alert("Հեռախոսահամարային դաշտը չպետք է լինի դատարկ");
        return;
    }

    // Clear the last phone number input field
    lastPhoneInput.value = "";

    // Create a container for the new phone number field and delete button
    const newPhoneContainer = document.createElement("div");
    newPhoneContainer.className = "phone-entry";

    // Create a new phone number input field and set its value to the last entered phone number
    const newPhoneInput = document.createElement("input");
    newPhoneInput.type = "text";
    newPhoneInput.name = "phone[]";
    newPhoneInput.required = true;
    newPhoneInput.value = lastPhoneNumber;

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Ջնջել";
    deleteButton.className = "delete-button";

    // Add an event listener to the delete button to remove the corresponding phone input
    deleteButton.addEventListener("click", function() {
        phoneContainer.removeChild(newPhoneContainer);
    });

    // Append the input field and delete button to the container
    newPhoneContainer.appendChild(newPhoneInput);
    newPhoneContainer.appendChild(deleteButton);

    // Append the new phone container to the main container
    phoneContainer.appendChild(newPhoneContainer);
});




// Initialize an array to hold the addresses

document.getElementById("addAddressButton").addEventListener("click", function() {
    const addressContainer = document.getElementById("addressContainer");

    // Get all the address input fields
    const addressInputs = addressContainer.querySelectorAll("input[name='address[]']");
    const lastAddressInput = addressInputs[0];

    // Get the value of the last address input field
    const lastAddress = lastAddressInput.value.trim();

    // If the last address field is empty, show an alert and prevent adding a new field
    if (lastAddress === "") {
        alert("Հասցեի դաշտը չպետք է լինի դատարկ");
        return;
    }

    // Clear the last address input field
    lastAddressInput.value = "";

    // Create a container for the new address field and delete button
    const newAddressContainer = document.createElement("div");
    newAddressContainer.className = "address-entry";

    // Create a new address input field and set its value to the last entered address
    const newAddressInput = document.createElement("input");
    newAddressInput.type = "text";
    newAddressInput.name = "address[]";
    newAddressInput.required = true;
    newAddressInput.value = lastAddress;

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Ջնջել";
    deleteButton.className = "delete-button";

    // Add an event listener to the delete button to remove the corresponding address input
    deleteButton.addEventListener("click", function() {
        addressContainer.removeChild(newAddressContainer);
    });

    // Append the input field and delete button to the container
    newAddressContainer.appendChild(newAddressInput);
    newAddressContainer.appendChild(deleteButton);

    // Append the new address container to the main container
    addressContainer.appendChild(newAddressContainer);
});
