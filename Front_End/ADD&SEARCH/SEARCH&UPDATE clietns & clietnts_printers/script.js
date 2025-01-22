const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");
console.log(backPath);
const backPagebutton = document.getElementById('back_page');
backPagebutton.addEventListener('click', async () => {
    console.log(backPath);
    window.location.href = `${backPath}`;
});
document.getElementById("searchButton").addEventListener("click", function () {
    // Get form values
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const llc = document.getElementById("llc").value;
    const phone = document.getElementById("phone").value;
    const clientType = document.getElementById("clientType").value;
    // const host = localStorage.getItem('host')
    // const port = localStorage.getItem('port')

    // Create the search parameters
    
    const searchParams = {
        name: name || undefined,
        address: address || undefined,
        llc: llc || undefined,
        phone_number: phone || undefined,
        client_type: clientType || undefined
    };
    localStorage.setItem('searchParams', JSON.stringify(searchParams));
    const pagePath = `../search_clients.html?path=${encodeURIComponent(backPath)}`;
    window.location.href = `./result_page/result.html?path=${encodeURIComponent(pagePath)}`; // Change to your results page URL
});