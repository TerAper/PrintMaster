const backPagebutton = document.getElementById('back_page');
const params = new URLSearchParams(window.location.search);
const clientId = params.get("client_id");
const clientName = params.get('client_name');
const backPagePath = params.get('path');
console.log(backPagePath);
document.getElementById('pageTitle').textContent = clientName;
backPagebutton.addEventListener('click', async () => {
    window.location.href = `${backPagePath}`;
});


document.addEventListener('DOMContentLoaded', () => {  
    const pagePathForCartridgePage = encodeURIComponent(`../delete_update_clients_printers.html?client_name=${clientName}&client_id=${clientId}&path=${encodeURIComponent(backPagePath)}`);
    const pagePathForPrinterPage = encodeURIComponent(`../../SEARCH&UPDATE clietns & clietnts_printers/delete_update_clients_printers/delete_update_clients_printers.html?client_name=${clientName}&client_id=${clientId}&path=${encodeURIComponent(backPagePath)}`);

    const printTypeSection = document.getElementById('print_type_info');
    const colorTypeSection = document.getElementById('color_type_info');
    const printerSelect = document.getElementById('printer');
    const printerDescriptionInput = document.getElementById('printer_description');
    const printerImageDisplay = document.getElementById('printerImage');
    const deletePrinterButton = document.getElementById('deletePrinterButton');
    const addPrinterToClientButton = document.getElementById('addPrinter');
    
    const cartridgeSelect = document.getElementById('cartridge');
    const cartridgeDescriptionInput = document.getElementById('cartridge_description');
    const cartridgeImageDisplay = document.getElementById('cartridgeImage');
    const deleteCartridgeButton = document.getElementById('deleteCartridgeButton');
    const addCartridgeToPrinterButton = document.getElementById('addCartridge');
    

        


    

    const chipSelect = document.getElementById('chip');


    const host = localStorage.getItem('host');
    const port = localStorage.getItem('port');

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
    let printersData = {};
    populatePrinterSelect();
    // Populate printer dropdown
  async  function populatePrinterSelect() {
      printerSelect.innerHTML = '<option value="">Select Printer</option>';
        const commandGCP = 'get_client_printers';
        const urlGCP = `http://${host}:${port}/${commandGCP}`;
        const printers = await fetchTranfer(urlGCP,{client_id: Number(clientId)} );
        if (printers.some(printer => printer.status === "No results found")) {
            console.log("No_results_found");
            return;
        }
        printers.forEach(client_printer => {
            const option = document.createElement('option');
            option.value = client_printer.client_printer_id;
            option.textContent = client_printer.brand_name + " " + client_printer.model_name;
            printerSelect.appendChild(option);
                printersData[client_printer.client_printer_id] = {
                    description: client_printer.client_printer_description || 'No description available',
                    print_type: client_printer.print_type,
                    color_type: client_printer.color_type,
                    model_id: client_printer.model_id,
                    brand_id: client_printer.brand_id,
                    brand_name: client_printer.brand_name,
                    brand_brand: client_printer.brand_brand,
                };
            
        });
    }
    let cartridesData = {};
    // Populate cartridge dropdown based on selected printer
    function populateCartridgeSelect(client_printerId) {
        const commandGCPC = 'get_client_printer_cartridges';
        const urlGCPC = `http://${host}:${port}/${commandGCPC}`;
        fetchTranfer(urlGCPC, {client_printer_id: Number(client_printerId)})
            .then(clietnPrintercartridges => {
                cartridgeSelect.innerHTML = '<option value="">Select Cartridge</option>'; // Reset cartridges
                if (clietnPrintercartridges.some(cartridge => cartridge.status === "No_results_found" || cartridge.status === "failure")) {
                    console.log("No_results_found");
                    return;
                }
                clietnPrintercartridges.forEach(clietnPrintercartridge => {
                    const option = document.createElement('option');
                    option.value = clietnPrintercartridge.client_printer_cartridge_id;
                    option.textContent = clietnPrintercartridge.cartridge_name;
                    cartridgeSelect.appendChild(option);
                    cartridesData[clietnPrintercartridge.client_printer_cartridge_id] = {description : clietnPrintercartridge.client_printer_cartridge_description || 'No description available', cartridge_id: clietnPrintercartridge.cartridge_id};
                });
            })
            .catch(error => {
                console.error('Error fetching cartridges:', error);
            });
    }

    // Populate chip dropdown based on selected cartridge
    function populateChipSelect(cartridgeId) {
        console.log(cartridgeId)
        const commandGCPCC = 'get_chips';
        const urlGCPCC = `http://${host}:${port}/${commandGCPCC}`;
        fetchTranfer(urlGCPCC, { cartridge_id: cartridgeId })
            .then(chips => {
                chipSelect.innerHTML = '<option value="">Select Chip</option>'; // Reset chips
                if (chips.some(chip => chip.status === "No_results_found")) {
                    return;
                }
                chips.forEach(chip => {
                    const option = document.createElement('option');
                    option.value = chip.id;
                    option.textContent = chip.name;
                    chipSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching chips:', error);
            });
    }

    // Handle printer selection change
    printerSelect.addEventListener('change', async () => {
        const selectedPrinterId = printerSelect.value;
        if (selectedPrinterId) {
            const selectedClientPrinter = printersData[selectedPrinterId];
            printerDescriptionInput.value = selectedClientPrinter.description ;
            printTypeSection.textContent = selectedClientPrinter.print_type;
            colorTypeSection.textContent = selectedClientPrinter.color_type;
            populateCartridgeSelect(selectedPrinterId);
        }
    });

    // Handle cartridge selection change
    cartridgeSelect.addEventListener('change', () => {
        const selectedCartridgeId = cartridgeSelect.value;
        console.log("=",selectedCartridgeId)
        if (selectedCartridgeId) {
            const selectedCartridge = cartridesData[selectedCartridgeId];
            cartridgeDescriptionInput.value = selectedCartridge.description || 'No description available';
            populateChipSelect(selectedCartridge.cartridge_id);
        }
    });

    printerImageDisplay.addEventListener('click', () => {
        if (!printerSelect.value ) {
            return;
        }
        const selectedPrinter = printerSelect.options[printerSelect.selectedIndex];
        const printerName = selectedPrinter.textContent;
        const selectedModel = `https://www.google.com/search?sca_esv=7c68678e090b94a1&sxsrf=ADLYWIIoy-oH2xHnwrnckwpNFiZYrGZ0Og:1735169602682&q=$${printerName}+&udm=2&fbs=AEQNm0Cp43LlY6jdFK77hMn4QH1qa7YpD6Lh6zb2-iXK9x6H7FakiKgVokpm5H9TjJGfTy72qXGI11atH0CYTtZWkfdUMbto-mhT1geNGj1nJiR7BKdqVNlTGVvYQLOY7mya-OhdhNcZrz_hzc0fF5K4SPe-j0_pdwI_yg5oRcanqqHaPqSqTlLFgVQYDH6sv5Xkkdt2mSsBzxfPu2UwBAeIRBHCo4Yjb-YR4JXerlp_JvAjTgDVmmk&sa=X&ved=2ahUKEwie06u-isSKAxU_T6QEHf8aIkIQtKgLegQIEhAB&biw=1654&bih=798&dpr=1`;
        window.open(selectedModel, "_blank");
    });

    cartridgeImageDisplay.addEventListener('click', () => {
        if (!cartridgeSelect.value ) {
            return;
        }
        const selectedCartridge = cartridgeSelect.options[cartridgeSelect.selectedIndex];
        const cartridgeName = selectedCartridge.textContent;
        const brand = printersData[printerSelect.value].brand_name + " cartridge";
        const selectedModel = `https://www.google.com/search?sca_esv=7c68678e090b94a1&sxsrf=ADLYWIIoy-oH2xHnwrnckwpNFiZYrGZ0Og:1735169602682&q=${brand}+${cartridgeName}+&udm=2&fbs=AEQNm0Cp43LlY6jdFK77hMn4QH1qa7YpD6Lh6zb2-iXK9x6H7FakiKgVokpm5H9TjJGfTy72qXGI11atH0CYTtZWkfdUMbto-mhT1geNGj1nJiR7BKdqVNlTGVvYQLOY7mya-OhdhNcZrz_hzc0fF5K4SPe-j0_pdwI_yg5oRcanqqHaPqSqTlLFgVQYDH6sv5Xkkdt2mSsBzxfPu2UwBAeIRBHCo4Yjb-YR4JXerlp_JvAjTgDVmmk&sa=X&ved=2ahUKEwie06u-isSKAxU_T6QEHf8aIkIQtKgLegQIEhAB&biw=1654&bih=798&dpr=1`;
        window.open(selectedModel, "_blank");
    });
    
     deletePrinterButton.addEventListener('click', async () => {
        if(!printerSelect.value){
            return;
        }
        printerDescriptionInput.value = "";
        const commandDCP = 'delete_client_printer';
        const urlDCP = `http://${host}:${port}/${commandDCP}`;
        const response = await fetchTranfer(urlDCP,{client_printer_id:Number(printerSelect.value)});
        console.log(response);
        location.reload();
        //populatePrinterSelect(clientId);
     });

     addPrinterToClientButton.addEventListener('click', async () => {
        const client_id = clientId;
        console.log(client_id);
        console.log(clientName);
        if(!client_id){
            return;
        }
        window.location.href = `../../ADD clients & clietns_printers/add_client_printers/add_clients_printers_.html?client_id=${client_id}&client_name=${clientName}&path=${pagePathForPrinterPage}`;  
     });

     deleteCartridgeButton.addEventListener('click', async () => {
        if(!cartridgeSelect.value){
            return;
        }
        cartridgeDescriptionInput.value = "";
        const commandDCPC = 'delete_client_printer_cartridge';
        const urlDCPC = `http://${host}:${port}/${commandDCPC}`;
        const response = await fetchTranfer(urlDCPC,{client_printer_cartridge_id:Number(cartridgeSelect.value)});
        console.log(response);
        populateCartridgeSelect(printerSelect.value);
     });

     addCartridgeToPrinterButton.addEventListener('click', async () => {
        const selectedPrinter = printerSelect.value;
        if(!selectedPrinter){
            return;
        }
        const Printer = printerSelect.options[printerSelect.selectedIndex];
        const printerName = Printer.textContent;
        const selectedModelId = printersData[selectedPrinter].model_id;

        window.location.href = `./addCartridgesToClientPrinter/addCartridgesTpClientPrinter.html?model_id=${selectedModelId}&client_printer_id=${selectedPrinter}&printer_name=${printerName}&path=${pagePathForCartridgePage}`;

        
     });
});
