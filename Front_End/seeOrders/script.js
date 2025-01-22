// Function to load orders based on selected filter
const host = localStorage.getItem('host');
const port = localStorage.getItem('port');
const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");
let dateTime = JSON.parse(urlParams.get("dateTime"));
console.log(dateTime);
console.log(backPath)
function backPage() {
    window.location.href = backPath;
}
function loadOrders(dateType) {
    let queryDate;

    if (dateType === 'today') {
        const startDate = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD
        queryDate = { start: startDate, end: startDate };
    } else if (dateType === 'tomorrow') {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        const startDate = date.toISOString().split('T')[0];
        queryDate = {start: startDate,end: startDate};
    } else if (dateType === 'manual') {
        // Handle custom date range (interval)
        queryDate = getManualDateRange();
    } else {
        queryDate = prompt("Enter the date (YYYY-MM-DD):");
    }
    dateTime = queryDate;
    fetchOrders(queryDate);
}

// Function to fetch orders from the server
function fetchOrders(date) {
    if(!date)return;

    const command = 'get_orders';
    const url = `http://${host}:${port}/${command}`;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(date )  // Send the date range as a payload
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#ordersTable tbody');
        tableBody.innerHTML = '';  // Clear existing rows

        data.forEach(order => {
            const row = document.createElement('tr');
        
            // Handling addresses
            const addressSelect =
                order.addresses && order.addresses.length > 1
                    ? `<select id="address_${order.id}" class="select-address">
                         ${order.addresses.map(address => `
                            <option value="${address.id}" ${address.id === order.address_id ? 'selected' : ''}>
                                ${address.address}
                            </option>
                         `).join('')}
                       </select>`
                    : order.addresses[0]?.address || "No address available";
        
            // Handling phone numbers
            const numberSelect =
                order.phone_numbers && order.phone_numbers.length > 1
                    ? `<select id="number_${order.id}" class="select-number">
                         ${order.phone_numbers.map(number => `
                            <option value="${number.id}" ${number.id === order.phone_number_id ? 'selected' : ''}>
                                ${number.number}
                            </option>
                         `).join('')}
                       </select>`
                    : order.phone_numbers[0]?.number || "No number available";
        
            // Constructing the row'
            row.innerHTML = `
                <td>${order.client_name}</td>
                <td>${addressSelect}</td>
                <td>${numberSelect}</td>
                <td>${order.description}</td>
                <td>${order.state}</td>
                <td>${order.date}</td>
                <td><button onclick="viewOrderDetails(${order.order_id}, ${order.client_id}, '${order.client_name.replace(/'/g, "\\'")}')" class="action-btn">Դիտարկել</button></td>
            `;
        
            // Append the row to the table body
            tableBody.appendChild(row);
        });
        
    })
    .catch(error => {
        console.error('Error fetching orders:', error);
    });
}

// Function to view order details (after selecting address and number)
function viewOrderDetails(orderId,clientId,clientName) {
    // Check if both address and number are selected
    if (orderId) {
        // Redirect to the order details page with selected address and number as query parameters
        const pagePath = `../seeOrders/seeOrdersForDays.html?dateTime=${JSON.stringify(dateTime)}&path=${encodeURIComponent(backPath)}`
        window.location.href = `../clientPrinterCartridgeRepairing/clientPrinterCartridgeRepairing.html?dateTime=${JSON.stringify(dateTime)}&path=${encodeURIComponent(pagePath)}&order_id=${orderId}&client_id=${clientId}&client_name=${clientName}`;
    } else {
        alert('Please select an address and a phone number before proceeding.');
    }
}

// Function to get the date range from the user using the date pickers
function getManualDateRange() {
    const startDate = document.querySelector("#startDate").value;
    const endDate = document.querySelector("#endDate").value;

    // Ensure valid date input
    if (startDate && endDate) {
        return { start: startDate, end: endDate };  // Return both start and end dates as an object
    } else {
        //alert("Please select both start and end dates.");
        return null;
    }
}

// Event listener for the "Apply Date Range" button
document.getElementById("applyDateRange").addEventListener("click", () => {
    loadOrders('manual');
});

// Event listener for the "Today" button
document.getElementById("todayBtn").addEventListener("click", () => {
    loadOrders('today');
});

// Event listener for the "Tomorrow" button
document.getElementById("tomorrowBtn").addEventListener("click", () => {
    loadOrders('tomorrow');
});

// Event listener for the "Custom Date Range" button
document.getElementById("customDateBtn").addEventListener("click", () => {
    // Show the date range input fields when custom date is selected
    document.getElementById("customDateContainer").style.display = "block";
    loadOrders('manual');
});

// Initialize the page with orders for today by default
fetchOrders(dateTime);

