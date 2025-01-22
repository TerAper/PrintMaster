const host = localStorage.getItem('host');
const port = localStorage.getItem('port');
const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");

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
                const price = part.price;
                const spend = part.spend;
                const count = 1;
                const row = document.createElement('tr');
                row.id = part.id;
                row.innerHTML = `
                    <td>${part.name}</td>
                    <td>${price}</td>
                    <td>${spend}</td>
                    <td>${count}</td>
                    <td><button onclick="deleteRepairPart(${part.id})">Ջնջել</button></td>

                
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching repairing parts:', err));
}

// function update(partId) {
//     // Find the input elements for the given partId
//     const priceInput = document.querySelector(`#price-${partId}`);
//     const spendInput = document.querySelector(`#spend-${partId}`);
//     const countInput = document.querySelector(`#count-${partId}`);

//     // Find the associated checkbox for the partId
//     const checkbox = document.querySelector(`input[type="checkbox"][value="${partId}"]`);
//     if (checkbox) {
//         // Update the checkbox's data attributes with the new values
//         checkbox.dataset.price = parseFloat(priceInput.value).toFixed(2);
//         checkbox.dataset.spend = parseFloat(spendInput.value).toFixed(2);
//         checkbox.dataset.count = parseInt(countInput.value, 10);

//         console.log(`Updated checkbox for partId ${partId}:`, {
//             price: checkbox.dataset.price,
//             spend: checkbox.dataset.spend,
//             count: checkbox.dataset.count,
//         });
//     } else {
//         console.error(`Checkbox for partId ${partId} not found.`);
//     }
// }

function addNewRepairRow(){
    const tableBody = document.getElementById('repairing-items');
    const newRow = document.createElement('tr');
    newRow.id = "new-repair-row";
    newRow.innerHTML = `
        <td><input id="new-repair-name" type="text" placeholder="Repair Name"></td>
        <td><input id="new-repair-price" type="number" placeholder="Price" min="0"></td>
        <td><input id="new-repair-spend" type="number" placeholder="Spend" min="0"></td>
        <td><input id="new-repair-count" type="number" placeholder="Count" min="1"></td>
        <td><button onclick="saveNewRepairPart()">Պահպանել</button></td>
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
                const tableBody = document.getElementById('repairing-items');
                const row = document.createElement('tr');
                row.id = data.id;
                console.log(data.id);
                row.innerHTML = `
                    <td>${newRepairPart.name}</td>
                    <td>${newRepairPart.price}</td>
                    <td>${newRepairPart.spend}</td>
                    <td>${newRepairPart.count}</td>
                    <td><button onclick="deleteRepairPart(${data.id})">Ջնջել</button></td>
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

function deleteRepairPart(repairPartId) {
   if(!repairPartId)return;

    // Define the backend endpoint
    const command = "delete_repair_part";
    const url = `http://${host}:${port}/${command}`;

    // Send data to the backend
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({repair_part_id:Number(repairPartId)}),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to add repair part: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                alert(" repair part deleted successfully!");

                // Remove the blank row
                const newRow = document.getElementById(repairPartId);
                if (newRow) newRow.remove();
                
            } else {
                alert("Failed to add the repair part. Please try again.");
            }
        })
        .catch(err => {
            console.error("Error adding new repair part:", err);
            alert("An error occurred while adding the new repair part.");
        });
}

