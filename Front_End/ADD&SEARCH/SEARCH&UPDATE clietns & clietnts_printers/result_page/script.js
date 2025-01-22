const host = localStorage.getItem('host');
const port = localStorage.getItem('port');
const searchParams = JSON.parse(localStorage.getItem('searchParams'));
const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");
console.log(backPath);
const pagePath = `../result_page/result.html?path=${encodeURIComponent(backPath)}`;
const backPagebutton = document.getElementById('back_page');
backPagebutton.addEventListener('click', async () => {
    window.location.href = `${backPath}`;
});
document.addEventListener("DOMContentLoaded", async function () {
    const command = 'search_client';
    const url = `http://${host}:${port}/${command}`;

    try {
        // Fetch the data from the backend
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(searchParams)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem('searchResults', JSON.stringify(data));
    } catch (error) {
        localStorage.setItem('searchResults', JSON.stringify({}));
        console.error("Error fetching clients:", error);
    }



    const clients = JSON.parse(localStorage.getItem('searchResults'));

    if (clients && Array.isArray(clients)) {
        const tableBody = document.getElementById("clientsTable").getElementsByTagName('tbody')[0];

        clients.forEach(client => {
            const row = document.createElement("tr");
            // Format the phone numbers as dropdown links (only show if there are valid phone numbers)
            const phoneNumbers = client.phone_numbers && Array.isArray(client.phone_numbers) && client.phone_numbers.length > 0 && client.phone_numbers[0].number !== null
                ? client.phone_numbers.length > 1
                    ? `<a href="#" class="dropdown-toggle" data-target="#phone-dropdown-${client.id}">Տեսնել բոլորը</a>
                    <div class="dropdown-content" id="phone-dropdown-${client.id}" style="display:none;">
                        ${client.phone_numbers.map(phone => phone.number ? `<div>${phone.number}</div>` : '').join('')}
                    </div>`
                    : (client.phone_numbers[0]?.number || '')
                : '';  // If no phone numbers or null, default to empty string

            // Format the addresses as dropdown links (only show if there are valid addresses)
            const addresses = client.addresses && Array.isArray(client.addresses) && client.addresses.length > 0 && client.addresses[0].address !== null
                ? client.addresses.length > 1
                    ? `<a href="#" class="dropdown-toggle" data-target="#address-dropdown-${client.id}">Տեսնել բոլորը</a>
                    <div class="dropdown-content" id="address-dropdown-${client.id}" style="display:none;">
                        ${client.addresses.map(address => address.address && address.address.trim() !== '' ? `<div>${address.address}</div>` : '').join('')}
                    </div>`
                    : (client.addresses[0]?.address && client.addresses[0]?.address.trim() !== '' ? client.addresses[0].address : '')
                : '';  // If no addresses or null, default to empty string

            row.innerHTML = `
                <td class="name">${client.name || ''}</td>
                <td class="client_type">${client.client_type || ''}</td>
                <td class="llc">${client.llc || ''}</td>
                <td class="phone_number">${phoneNumbers || ''}</td>
                <td class="address">${addresses || ''}</td>
                <td class="actions">
                    <button class="add-to-order-btn" onclick="addToOrderList(${client.id}, '${client.name}')">Գրանցել Այց</button>
                </td>
                `;
                document.querySelector("#clientsTable tbody").appendChild(row);
            // Add event listener for toggling dropdowns
            const phoneLink = row.querySelector('.dropdown-toggle[data-target^="#phone-dropdown"]');
            if (phoneLink) {
                phoneLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(phoneLink.getAttribute('data-target'));
                    target.style.display = target.style.display === 'none' ? 'block' : 'none';
                });
            }
            const addressLink = row.querySelector('.dropdown-toggle[data-target^="#address-dropdown"]');
            if (addressLink) {
                addressLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(addressLink.getAttribute('data-target'));
                    target.style.display = target.style.display === 'none' ? 'block' : 'none';
                });
            }

            // Add double-click event listener for row navigation
            row.addEventListener("dblclick", () => navigateToClientPage(client.id,pagePath));

            // Append the row to the table
            tableBody.appendChild(row);
        });
    }
});

// Function to handle double-click event on a row and navigate to another page
function navigateToClientPage(clientId,pagePath) {
    if (!clientId) {
        console.error("Client ID is undefined or invalid.");
        return;
    }
    window.location.href = `../delete_update_client/delete_update.html?client_id=${clientId}&path=${encodeURIComponent(pagePath)}`;
}

async function addToOrderList(clientId, clientName) {
    const userConfirmed = confirm(`Do you want to add ${clientName} in order list?`);
    if (userConfirmed){
        const pagePath1 = `../ADD&SEARCH/SEARCH&UPDATE clietns & clietnts_printers/result_page/result.html?path=${encodeURIComponent(backPath)}`
        window.location.href = `../../../createOrders/createOrdersForDays.html?client_id=${clientId}&client_name=${clientName}&path=${encodeURIComponent(pagePath1)}`;
    }
}