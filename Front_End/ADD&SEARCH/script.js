const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");
const backPagebutton = document.getElementById('back_page');
console.log(backPath);
const pagePath = encodeURIComponent(`../clients.html?path=${encodeURIComponent(backPath)}`)
backPagebutton.addEventListener('click', async () => {
    window.location.href = `${backPath}`;
});
document.getElementById("addClientsButton").addEventListener("click", function() {
    window.location.href = `./ADD clients & clietns_printers/add_clients/add_clients.html?path=../${pagePath}`;  // Replace with the actual URL you want to redirect to
});

document.getElementById("searchClientsButton").addEventListener("click", function() {
    window.location.href = `./SEARCH&UPDATE clietns & clietnts_printers/search_clients.html?path=${pagePath}`;  // Replace with the actual URL you want to redirect to
});