async function fetchTranfer(url, _body = null) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(_body),
        });

        if (!response.ok) throw new Error(`Failed to fetch ${_body}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching   ${_body}:`, error);
        return [];
    }
}
const host = localStorage.getItem('host');
const port = localStorage.getItem('port');
const clients = JSON.parse(localStorage.getItem("searchResults"));
const urlParams = new URLSearchParams(window.location.search);
const clientId = urlParams.get("client_id");
const backPath = urlParams.get("path");
console.log(backPath);
const pagePath = `../delete_update_client/delete_update.html?client_id=${clientId}&path=${encodeURIComponent(backPath)}`;
const backPagebutton = document.getElementById('back_page');
backPagebutton.addEventListener('click', async () => {
    window.location.href = `${backPath}`;
});


document.addEventListener("DOMContentLoaded", function () {
    try {
        
        if (!clientId) {
            alert("No client ID provided in the URL!");
            return;
        }
        
        
        if (!clients || !Array.isArray(clients)) {
            alert("No clients found in localStorage!");
            return;
        }
        
        const client = clients.find((c) => c.id === Number(clientId));
        
        if (!client) {
            alert("Client not found!");
            return;
        }
        
        document.getElementById("name").value = client.name;
        document.getElementById("llc").value = client.llc;
        document.getElementById("client_type").value = client.client_type;
        
        // Populate the phone numbers table
        const phoneNumbersTable = document.getElementById("phoneNumbersTable");
        if (client.phone_numbers && client.phone_numbers.length > 0) {
            client.phone_numbers.forEach(phone => {
                //console.log(phone.number)
                if (phone.number) {
                    const row = document.createElement("tr");
                    const phoneId  = phone.id;
                    // Add data attributes to help identify the row when editing
                    row.setAttribute("phone_id", phoneId); // assuming phone has a unique id
                    
                    row.innerHTML = `
                    <td>${phone.number}</td>
                    <td>
                    <button type="button" onclick="editPhoneNumber(${phoneId}, '${phone.number.replace(/'/g, "\\'")}')">Փոփոխել</button>
                    <button type="button" onclick="deletePhoneNumber(${phoneId}, this.parentElement.parentElement)">Ջնջել</button>
                    </td>`;
                                    phoneNumbersTable.appendChild(row);
                                }
                    });
                }
            
        const addPhoneButton = document.createElement("button");
        addPhoneButton.type = "button";
        addPhoneButton.textContent = "Ավելացնել Հեռախոսահամար";
        addPhoneButton.onclick = async() => addPhoneNumber(client.id);
        phoneNumbersTable.appendChild(addPhoneButton);
        
        // Populate the addresses table
        const addressesTable = document.getElementById("addressesTable");
        if (client.addresses && client.addresses.length > 0) {
            client.addresses.forEach(address => {
                if (address.address) {
                    const row = document.createElement("tr");
                    const addressId = address.id;
                    row.setAttribute("address_id", addressId); // assuming phone has a unique id
                    
                    row.innerHTML = `
                    <td>${address.address}</td>
                    <td>
                    <button type="button" onclick="editAddress(${addressId}, '${address.address.replace(/'/g, "\\'")}')">Փոփոխել</button>
                    <button type="button" onclick="deleteAddress(${addressId}, this.parentElement.parentElement)">Ջնջել</button>
                    </td>`;
                    addressesTable.appendChild(row);
                }
                });
            }
        const addAddressButton = document.createElement("button");
        addAddressButton.type = "button";
        addAddressButton.textContent = "Ավելացնել Հասցե";
        addAddressButton.onclick = async() => addAddress(client.id);
        addressesTable.appendChild(addAddressButton);
        
        // Event listeners for other actions
        document.getElementById("editButton").addEventListener("click", enableEditing);
        document.getElementById("saveButton").addEventListener("click", () => saveChanges(clientId));
        document.getElementById("deleteButton").addEventListener("click", () => deleteClient(clientId,backPath));
        document.getElementById("printersButton").addEventListener("click", () => redirectToPrinters(client, backPath));
    } catch (error) {
        console.error("Error initializing the page:", error);
    }
});

// Enable editing
function enableEditing() {
    document.getElementById("name").disabled = false;
    document.getElementById("llc").disabled = false;
    document.getElementById("client_type").disabled = false;
    document.getElementById("editButton").style.display = "none";
    document.getElementById("saveButton").style.display = "inline-block";
}

// Save changes
async function saveChanges(clientId) {
    const newName = document.getElementById("name").value;
    const newLLC = document.getElementById("llc").value;
    const newClientType = document.getElementById("client_type").value;
    if(!newName || newName.trim() == "" ){
        alert("name cant be empty");
        return;
    }
    const commandAC = 'update_client'; // Adjust API endpoint if necessary
    const urlAC = `http://${host}:${port}/${commandAC}`;
    let jsonObject = { client_id: Number(clientId),updated_name: newName,updated_llc: newLLC, updated_type: newClientType};
    const response = await fetchTranfer(urlAC, jsonObject);
    console.log(response);
    document.getElementById("name").disabled = true;
    document.getElementById("llc").disabled = true;
    document.getElementById("client_type").disabled = true;
    document.getElementById("editButton").style.display = "inline-block";
    document.getElementById("saveButton").style.display = "none";
}

// Delete client
async function deleteClient(clientId,backpage) {
    if(confirm("DO YOU WANT TO DELETE CLIENT?")){
    console.log(backpage);
    const commandDC = 'delete_client'; // Adjust API endpoint if necessary
    const urlDC = `http://${host}:${port}/${commandDC}`;
    let jsonObject = { client_id: Number(clientId)};
    const response = await fetchTranfer(urlDC, jsonObject);
    console.log(response);
    alert(`client deleted !${response["status"]}fully`);
        window.location.href = `${backpage}`;
    };
    
}

// Redirect to printers page
function redirectToPrinters(client, backPath) {
    console.log(backPath);
    window.location.href = `../delete_update_clients_printers/delete_update_clients_printers.html?client_id=${client.id}&client_name=${client.name}&path=${encodeURIComponent(backPath)}`;
}

// Add new phone number
async function addPhoneNumber(clientId) {
    console.log(clientId);
    const newPhone = prompt("Enter new phone number:");
    if (newPhone && newPhone.trim() !== "") {
        const commandAPN = 'add_client_phone_numbers';
        const urlAPN = `http://${host}:${port}/${commandAPN}`;
        let jsonObject = {
            phone_numbers: [
                { client_id: Number(clientId), phone_number: newPhone }
            ]
        }
        const clinetNumber = await fetchTranfer(urlAPN,jsonObject);
        const numberId = clinetNumber.phone_number_id;
        console.log(numberId)
        
        if(numberId){
            const phoneNumbersTable = document.getElementById("phoneNumbersTable");
            const row = document.createElement("tr");
            row.setAttribute("phone_id", numberId); // assuming phone has a unique id
            row.innerHTML = `
            <td>${newPhone}</td>
            <td>
            <button type="button" onclick="editPhoneNumber(${numberId}, '${newPhone.replace(/'/g, "\\'")}')">Edit</button>
            <button type="button" onclick="deletePhoneNumber(${numberId}, this.parentElement.parentElement)">Delete</button>
            </td>`;
            phoneNumbersTable.appendChild(row);
        }
        
    }
}

// Add new address
async function addAddress(clientId) {
    
    const newAddress = prompt("Enter new address:");
    if (newAddress && newAddress.trim() !== "") {
        const commandAA = 'add_client_addresses';
        const urlAA = `http://${host}:${port}/${commandAA}`;
        let jsonObject = {
            client_addresses: [
                { client_id: Number(clientId), client_address: newAddress }
            ]
        }
        const clinetaddress = await fetchTranfer(urlAA,jsonObject);
        const addressId = clinetaddress.address_id;
        console.log(addressId)
        if(addressId){
            const addressesTable = document.getElementById("addressesTable");
            const row = document.createElement("tr");
            row.setAttribute("address_id", addressId); // assuming phone has a unique id
            row.innerHTML = `
            <td>${newAddress}</td>
            <td>
            <button type="button" onclick="editAddress(${addressId}, '${newAddress.replace(/'/g, "\\'")}')">Edit</button>
            <button type="button" onclick="deleteAddress(${addressId}, this.parentElement.parentElement)">Delete</button>
            </td>`;
            addressesTable.appendChild(row);
        }
        
    }
}

// Function to edit the phone number
async function editPhoneNumber(phoneId, oldPhoneNumber) {
    console.log(oldPhoneNumber)
    console.log(phoneId)
    
    const newPhoneNumber = prompt("Enter new phone number:", oldPhoneNumber);
    if (newPhoneNumber && newPhoneNumber.trim() !== "") {
        const commandAPN = 'update_client_phone_number'; // Adjust API endpoint if necessary
        const urlAPN = `http://${host}:${port}/${commandAPN}`;
        let jsonObject = { phone_number_id: Number(phoneId),updated_phone_number: newPhoneNumber};
        const response = await fetchTranfer(urlAPN, jsonObject);
        console.log(response);
        const rows = phoneNumbersTable.querySelectorAll("tr");
        rows.forEach(row => {
            const rowPhoneid = row.getAttribute("phone_id");
            if (Number(rowPhoneid) === Number(phoneId)) {
                const phoneCell = row.querySelector("td");
                phoneCell.textContent = newPhoneNumber;
            }
        });
    }
}
// Edit address
async function editAddress(addressId, oldAddress) {
    const newAddress = prompt("Edit address:", oldAddress);
    if (newAddress && newAddress.trim() !== "") {
        const commandAA = 'update_client_address'; // Adjust API endpoint if necessary
        const urlAA = `http://${host}:${port}/${commandAA}`;
        let jsonObject = { address_id: Number(addressId),updated_address: newAddress};
        const response = await fetchTranfer(urlAA, jsonObject);
        const rows = addressesTable.querySelectorAll("tr");
        rows.forEach(row => {
            const rowAddresId = row.getAttribute("address_id");
            if (Number(addressId) === Number(rowAddresId)) {
                const phoneCell = row.querySelector("td");
                phoneCell.textContent = newAddress;
            }
        });
    }
}

async function deletePhoneNumber(phoneId, rowElement) {
    const phoneNumbersTable = document.getElementById("phoneNumbersTable");
    const rows = phoneNumbersTable.querySelectorAll("tr");
    
    // Check if there's only one phone number
    if (rows.length <= 1) {
        alert("At least one phone number must exist. Deletion is not allowed!");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this phone number?");
    if (confirmDelete) {
        const commandDPN = 'delete_client_phone_number'; // Adjust API endpoint if necessary
        const urlDPN = `http://${host}:${port}/${commandDPN}`;
        let jsonObject = { phone_id: Number(phoneId) };

        const response = await fetchTranfer(urlDPN, jsonObject);
        rowElement.remove(); // Remove the row from the table
        alert("Phone number deleted successfully!");
    }
}

// Function to delete an address
async function deleteAddress(addressId, rowElement) {
    const addressesTable = document.getElementById("addressesTable");
    const rows = addressesTable.querySelectorAll("tr");
    
    // Check if there's only one address
    if (rows.length <= 1) {
        alert("At least one address must exist. Deletion is not allowed!");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this address?");
    if (confirmDelete) {
        const commandDA = 'delete_client_address'; // Adjust API endpoint if necessary
        const urlDA = `http://${host}:${port}/${commandDA}`;
        let jsonObject = { address_id: Number(addressId) };
        
        const response = await fetchTranfer(urlDA, jsonObject);
        rowElement.remove(); // Remove the row from the table
        alert("Address deleted successfully!");
    }
}
