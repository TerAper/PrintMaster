const host = '192.168.0.118'
const port = '9193'
localStorage.setItem('host',host)
localStorage.setItem('port', port)

const pagePath = encodeURIComponent(`../index.html`)
document.getElementById("clientsButton").addEventListener("click", function() {
    window.location.href = `./ADD&SEARCH/clients.html?path=${pagePath}`;  // Replace with the actual URL you want to redirect to
});

document.getElementById("createOrdersButton").addEventListener("click", function() {
    window.location.href = `./createOrders/createOrdersForDays.html?path=${pagePath}`;  // Replace with the actual URL you want to redirect to
});

document.getElementById("seeOrdersButton").addEventListener("click", function() {
    window.location.href = `./seeOrders/seeOrdersForDays.html?path=${pagePath}`;  // Replace with the actual URL you want to redirect to
});
document.getElementById("addRepaiPartsButton").addEventListener("click", function() {
    window.location.href = `./clientPrinterCartridgeRepairing/addRepairParts/addRepairParts.html?path=../${pagePath}`;  // Replace with the actual URL you want to redirect to
});
