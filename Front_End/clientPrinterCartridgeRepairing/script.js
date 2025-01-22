const host = localStorage.getItem('host');
const port = localStorage.getItem('port');
const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");
const orderId = urlParams.get("order_id");
const clientId = urlParams.get("client_id");
const clientName = urlParams.get("client_name");
let dateTime = JSON.parse(urlParams.get("dateTime"));
const cartridgeSelect = document.getElementById('cartridge');
const updatePrintersButton = document.getElementById('updatePrintersButton');
const printerSelect = document.getElementById('printer');
let selectedRepairs = [];
let totalPrice = 0;
let totalSpend = 0;

 populatePrinterSelect();
 fetchRepairingParts();

function backPage() {
    window.location.href = backPath;
}

async function fetchRepairingParts() {
    const category = document.getElementById('category').value;
    if (!category) return;

    const command = 'get_repair_parts';
    const url = `http://${host}:${port}/${command}`;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ category: category })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const container = document.getElementById('repairing-items-container');
            const tableBody = document.getElementById('repairing-items');
            container.style.display = 'block';
            tableBody.innerHTML = '';

            data.forEach(part => {
                const isChecked = selectedRepairs.some(selectedPart => Number(selectedPart.id) === Number(part.id)) ? 'checked' :  '';
                const price = part.price;
                const spend = part.spend;
                const count = 1;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${part.name}</td>
                    <td><input type="number" class="editable-price" id="price-${part.id}" value="${price}" min="0" onchange="update(${part.id}, 0)"></td>
                    <td><input type="number" class="editable-spend" id="spend-${part.id}" value="${spend}" min="0" onchange="update(${part.id}, 1)"></td>
                    <td><input type="number" id="count-${part.id}" value="${count}" min="1" onchange="update(${part.id}, 2)"></td>
                    <td><input type="checkbox" value="${part.id}" data-name="${part.name}" data-price="${price}" data-spend="${spend}" data-count="${count}" ${isChecked} onchange="toggleRepair(this)"></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching repairing parts:', err));
}

function update(partId) {
    // Find the input elements for the given partId
    const priceInput = document.querySelector(`#price-${partId}`);
    const spendInput = document.querySelector(`#spend-${partId}`);
    const countInput = document.querySelector(`#count-${partId}`);

    // Find the associated checkbox for the partId
    const checkbox = document.querySelector(`input[type="checkbox"][value="${partId}"]`);
    if (checkbox) {
        // Update the checkbox's data attributes with the new values
        checkbox.dataset.price = parseFloat(priceInput.value).toFixed(2);
        checkbox.dataset.spend = parseFloat(spendInput.value).toFixed(2);
        checkbox.dataset.count = parseInt(countInput.value, 10);

        console.log(`Updated checkbox for partId ${partId}:`, {
            price: checkbox.dataset.price,
            spend: checkbox.dataset.spend,
            count: checkbox.dataset.count,
        });
    } else {
        console.error(`Checkbox for partId ${partId} not found.`);
    }
}


function toggleRepair(checkbox) {
    const id = checkbox.value;
    const priceInput = document.querySelector(`#price-${id}`);
    const spendInput = document.querySelector(`#spend-${id}`);
    const countInput = document.querySelector(`#count-${id}`);
    const price = parseFloat(checkbox.dataset.price);
    const spend = parseFloat(checkbox.dataset.spend);
    const count = parseFloat(checkbox.dataset.count);
    const name = checkbox.dataset.name;
    const printer = parseFloat(checkbox.dataset.printer);
    const cartridge = parseFloat(checkbox.dataset.cartridge);

    if (checkbox.checked) {
        
        // Add the part to the selectedRepairs array
        const printer = printerSelect.options[printerSelect.selectedIndex]?.textContent || "No printer selected";
        const cartridge = cartridgeSelect.options[cartridgeSelect.selectedIndex]?.textContent || "No cartridge selected";
        selectedRepairs.push({ name, id, price, spend, count, printer, cartridge});
        totalPrice += price * count;
        totalSpend += spend * count;

        // Disable inputs in the row
        priceInput.disabled = true;
        spendInput.disabled = true;
        countInput.disabled = true;
    } else {
        // Remove the part from the selectedRepairs array
        totalPrice -= price * count;
        totalSpend -= spend * count;
        selectedRepairs = selectedRepairs.filter(item => item.id !== id);

        // Enable inputs in the row
        priceInput.disabled = false;
        spendInput.disabled = false;
        countInput.disabled = false;
    }

    // Update the displayed totals
    document.getElementById('total-price').innerText = `${totalPrice.toFixed(2)}`;
    document.getElementById('total-spend').innerText = `${totalSpend.toFixed(2)}`;
}



function saveSelectedRepairs() {
    if (selectedRepairs.length === 0) {
        alert('No repairs selected!');
        return;
    }
    const description = `
        Repairs: ${selectedRepairs.map(rep => `${rep.name} count= ${rep.count} price=${rep.price} printer=${rep.printer} cartridge =${rep.cartridge}`).join(', ')},
    `;
    console.log(description)
    fetch('/api/saveSelectedRepairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            repairs: selectedRepairs,
            description: description.trim()
        })
    })
        .then(response => {
            if (response.ok) {
                alert('Repairs saved successfully!');
                selectedRepairs = [];
                document.getElementById('total-price').innerText = '0.00';
                document.getElementById('total-spend').innerText = '0.00';
                document.getElementById('repairing-items-container').style.display = 'none';
            } else {
                alert('Failed to save repairs.');
            }
        })
        .catch(err => console.error('Error saving repairs:', err));
}

async function populatePrinterSelect() {
    const commandGCP = 'get_client_printers';
    const urlGCP = `http://${host}:${port}/${commandGCP}`;
    const printers = await fetchTranfer(urlGCP, { client_id: Number(clientId) });
   // printerSelect.innerHTML = '<option value="">Select Printer</option>';
    if (printers.some(printer => printer.status === "No results found")) {
        console.log("No_results_found");
        return;
    }
    printers.forEach(client_printer => {
        const option = document.createElement('option');
        option.value = client_printer.client_printer_id;
        option.textContent = client_printer.brand_name + " " + client_printer.model_name;
        printerSelect.appendChild(option);
    });
    if(printerSelect.value){
        await populateCartridgeSelect(printerSelect.value);
    }
}

async function populateCartridgeSelect(client_printerId) {
    const commandGCPC = 'get_client_printer_cartridges';
    const urlGCPC = `http://${host}:${port}/${commandGCPC}`;
    fetchTranfer(urlGCPC, { client_printer_id: Number(client_printerId) })
        .then(clietnPrintercartridges => {
            //cartridgeSelect.innerHTML = '<option value="">Select Cartridge</option>';
            cartridgeSelect.innerHTML = '';
            if (clietnPrintercartridges.some(cartridge => cartridge.status === "No_results_found" || cartridge.status === "failure")) {
                console.log("No_results_found");
                return;
            }
            clietnPrintercartridges.forEach(clietnPrintercartridge => {
                const option = document.createElement('option');
                option.value = clietnPrintercartridge.client_printer_cartridge_id;
                option.textContent = clietnPrintercartridge.cartridge_name;
                cartridgeSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching cartridges:', error);
        });
}

printerSelect.addEventListener('change', async () => {
    const selectedPrinterId = printerSelect.value;
    populateCartridgeSelect(selectedPrinterId);
});

updatePrintersButton.addEventListener('click', async () => {
    const client_id = clientId;
    if (!client_id) {
        return;
    }
    const pagePath = `../../../clientPrinterCartridgeRepairing/clientPrinterCartridgeRepairing.html?path=${encodeURIComponent(backPath)}&client_id=${clientId}&client_name=${clientName}&order_id=${orderId}`;
    window.location.href = `../ADD&SEARCH/SEARCH&UPDATE clietns & clietnts_printers/delete_update_clients_printers/delete_update_clients_printers.html?client_id=${client_id}&client_name=${clientName}&path=${encodeURIComponent(pagePath)}`;
});

function addNewRepairRow(){
    const tableBody = document.getElementById('repairing-items');
    const newRow = document.createElement('tr');
    newRow.id = "new-repair-row";
    newRow.innerHTML = `
        <td><input id="new-repair-name" type="text" placeholder="Repair Name"></td>
        <td><input id="new-repair-price" type="number" placeholder="Price" min="0"></td>
        <td><input id="new-repair-spend" type="number" placeholder="Spend" min="0"></td>
        <td><input id="new-repair-count" type="number" placeholder="Count" min="1"></td>
        <td><button onclick="saveNewRepairPart()">Save</button></td>
    `;
    tableBody.appendChild(newRow);
}

function saveNewRepairPart() {
    const nameInput = document.getElementById('new-repair-name');
    const priceInput = document.getElementById('new-repair-price');
    const spendInput = document.getElementById('new-repair-spend');
    const countInput = document.getElementById('new-repair-count');
    const categoryInput = document.getElementById('category');

    // Validate input fields
    if (!nameInput.value.trim() || !priceInput.value || !spendInput.value || !countInput.value || !categoryInput.value) {
        alert('Please fill in all fields for the new repair part.');
        return;
    }

    // Create the repair part object
    const newRepairPart = {
        name: nameInput.value.trim(),
        price: parseFloat(priceInput.value),
        spend: parseFloat(spendInput.value),
        count: parseInt(countInput.value, 10),
        category: categoryInput.value.trim(),
    };

    // Define the backend endpoint
    const command = "add_repair_part";
    const url = `http://${host}:${port}/${command}`;

    // Send data to the backend
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRepairPart),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to add repair part: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                alert("New repair part added successfully!");

                // Remove the blank row
                const newRow = document.getElementById('new-repair-row');
                if (newRow) newRow.remove();

                // Add the new repair part to the table
                const isChecked = '';
                const tableBody = document.getElementById('repairing-items');
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${newRepairPart.name}</td>
                    <td><input type="number" class="editable-price" id="price-${data.id}" value="${newRepairPart.price}" min="0" onchange="update(${data.id}, 0)"></td>
                    <td><input type="number" class="editable-spend" id="spend-${data.id}" value="${newRepairPart.spend}" min="0" onchange="update(${data.id}, 1)"></td>
                    <td><input type="number" id="count-${data.id}" value="${newRepairPart.count}" min="1" onchange="update(${data.id}, 2)"></td>
                    <td><input type="checkbox" value="${data.id}" data-name="${newRepairPart.name}" data-price="${newRepairPart.price}" data-spend="${newRepairPart.spend}" data-count="${newRepairPart.count}"  ${isChecked} onchange="toggleRepair(this)"></td>
                `;
                tableBody.appendChild(row);
            } else {
                alert("Failed to add the repair part. Please try again.");
            }
        })
        .catch(err => {
            console.error("Error adding new repair part:", err);
            alert("An error occurred while adding the new repair part.");
        });
}
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
