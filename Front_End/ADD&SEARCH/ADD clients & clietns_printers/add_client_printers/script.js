const host = localStorage.getItem('host');
const port = localStorage.getItem('port');
const backPagebutton = document.getElementById('back_page');
const  makeOrder = document.getElementById('make_order');
const urlParams = new URLSearchParams(window.location.search);
const backPath = urlParams.get("path");
const clientId = urlParams.get('client_id');
const clientName = urlParams.get('client_name');
console.log("Client ID:", clientId);
document.getElementById('pageTitle').textContent = clientName;
//const pagePath = encodeURIComponent(`../add_clients_printers_.html?path=${decodeURIComponent(backPath)}`);
makeOrder.addEventListener('click', async (event) => {
    event.preventDefault();
    const userConfirmed = confirm(`Do you want to add ${clientName} in order?`);
    if (userConfirmed){
        const pagePath1 = `../ADD&SEARCH/ADD clients & clietns_printers/add_client_printers/add_clients_printers_.html?path=${encodeURIComponent(backPath)}`;
        window.location.href = `../../../createOrders/createOrdersForDays.html?client_id=${clientId}&client_name=${clientName}&path=${encodeURIComponent(pagePath1)}`;
    }
});
backPagebutton.addEventListener('click', async () => {
    console.log(backPath);
    window.location.href = `${backPath}`;
});
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
// Retrieve the client_id from the URL

    const brandSelect = document.getElementById('brand');
    const printTypeSection = document.getElementById('printTypeSection');
    const colorTypeSection = document.getElementById('colorTypeSection');
    
    const modelSelect = document.getElementById('model');
    const manualAddModelForm = document.getElementById('manualAddModelForm');
    const cancelModelAddButton = document.getElementById('cancelModelAdd');
    const printTypeSelect = document.getElementById('print_type');
    const colorTypeSelect = document.getElementById('color_type');
    const modelImageDisplay = document.getElementById('modelImage');
    const addNewModelOption = document.querySelector('#addNewModelOption');
    
    const cartridgeSelect = document.getElementById('cartridge');
    const addCartridgeButton = document.getElementById('addCartridgeButton');
    const selectedCartridgesList = document.getElementById('cartridgeList');
    const addNewCartridgeButton = document.getElementById('addNewCartridgeButton');
    const newCartridgeNameInput = document.getElementById('newCartridgeName');
    const addNewCartridgeSection = document.getElementById('addNewCartridgeSection');
    const addNewCartridgeOption = document.querySelector('#addNewCartridgeOption');
    const cartridgeImageDisplay = document.getElementById('cartridgeImage');

    
    const chipSelect = document.getElementById('chip');
    const addChipModelInput = document.getElementById('addChip_model');
    const addNewChipButton = document.getElementById('addNewChipButton');
    const addNewChipSection = document.getElementById('addNewChipSection');
    const addNewChipOption = document.querySelector('#addNewChipOption');

    const printerDescriptionInput = document.getElementById('printer_description');
    const associatePrinterForm = document.getElementById('associatePrinterForm');
    const responseMessage = document.getElementById('responseMessage');


    async function fetchTranfer(url,_body = null) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(_body),
            });

            if (!response.ok) throw new Error(`Failed to fetch ${_body}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching   ${brandId}:`, error);
            return [];
        }
    }


    const commandGB = 'get_brands';
    const urlGB = `http://${host}:${port}/${commandGB}`;
    fetchTranfer(urlGB)
    .then(brands => {
        populateBrandSelect(brands);  // Pass the resolved data to the function
    })
    .catch(error => {
        console.error('Error fetching brands:', error);
        responseMessage.textContent = 'Error fetching brand data.';
    });
    
    function populateBrandSelect(_brands) {
        if (_brands.some(brand => brand.status === "No_results_found")) {
            return;
        }
        //brandSelect.innerHTML = '<option value="">Select Brand</option>';
        //brandSelect.innerHTML = '<option value="-1"> addNewBrand</option>';
        _brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.textContent = brand.name;
            brandSelect.appendChild(option);
        });
    }
    
    // Populate the model dropdown
    function populateModelSelect(models) {
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        if (addNewModelOption) {
            modelSelect.appendChild(addNewModelOption);
        }
        
        if (models.some(model => model.status === "No_results_found")) {
           // modelSelect.innerHTML = '<option value="">Select Model</option>';
            return;
        }
        
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            console.log(option.textContent)
            modelSelect.appendChild(option);
        });
    }

    // Populate cartridge dropdown based on selected model
    function populateCartridgeSelect(cartridges) {
        
        if (cartridges.some(cartridge => cartridge.status === "No_results_found")) {
            return;
        }
        //cartridgeSelect.innerHTML = '<option value="">Select Cartridge</option>';
        cartridges.forEach(cartridge => {
            const option = document.createElement('option');
            option.value = cartridge.id;
            option.textContent = cartridge.name;
            cartridgeSelect.appendChild(option);
        });
    }
    
    function populateChipSelect(chips) {
        chipSelect.innerHTML = '<option value="">CHIPS</option>';
        if (addNewChipOption) {
            chipSelect.appendChild(addNewChipOption);
        }
        if (chips.some(chip => chip.status === "No_results_found")) {
            return;
        }
        chips.forEach(chip => {
            const option = document.createElement('option');
            option.value = chip.id;
            option.textContent = chip.name;
            chipSelect.appendChild(option);
        });
    }
    
    // Add a new brand
    async function addNewBrand() {
        const newBrandName = prompt("Enter the new brand name:");
        if (!newBrandName) return;
    
        try {
            const commandAB = 'add_brand';
            const urlAB = `http://${host}:${port}/${commandAB}`;
    
            const newBrand = await fetchTranfer(urlAB,{ name: newBrandName }); // Assuming the backend returns just the ID (e.g., { id: 123 })
            //console.log('Backend response:', newBrand);
    
            // Add the new brand to the dropdown
            const newOption = document.createElement('option');
            newOption.value = newBrand.brand_id;
            newOption.textContent = newBrandName; // Use the name provided by the user
            brandSelect.appendChild(newOption);
            brandSelect.value = newBrand.brand_id;
    
            // Automatically select the newly added brand
            modelSelect.innerHTML = '<option value="">Select model</option>';  // Reset to default option
            modelSelect.appendChild(addNewModelOption)
            cartridgeSelect.innerHTML = '<option value="">Select Cartridge</option>';  // Reset to default option
            chipSelect.innerHTML = '<option value="">CHIPS</option>';  // Reset to default option
            
            alert(`Brand "${newBrandName}" added successfully!`);
        } catch (error) {
            console.error('Error adding brand:', error);
            alert('Failed to add the new brand.');
        }
    };
    
    // Show the add model form
    async function addNewModel() {
        manualAddModelForm.classList.remove('hidden');
    };

    // Cancel adding a new model
    async function cenclmanualAddModelForm() {
        manualAddModelForm.classList.add('hidden');
        document.getElementById('newModelName').value = '';
        document.getElementById('newPrintType').value = '';
        document.getElementById('newColorType').value = '';
    }
    
    cancelModelAddButton.addEventListener('click', ()=>{    
        cenclmanualAddModelForm();
        modelSelect.value = "";
    });
    
    // Add a new model
    document.getElementById('addModelForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const modelName = document.getElementById('newModelName').value.trim();
        const printType = document.getElementById('newPrintType').value;
        const colorType = document.getElementById('newColorType').value;
        const brandId = brandSelect.value;
        if (!brandId || !modelName || !printType || !colorType ) {
            responseMessage.textContent = 'Please fill all fields for the new model.';
            return;
        }
            const commandAM = 'add_model';
            const urlAM = `http://${host}:${port}/${commandAM}`;
            const content = { 
                name: modelName, 
                print_type: printType, 
                color_type: colorType, 
                brand_id: Number(brandId)
            }
            const newModel = await fetchTranfer(urlAM,content);
            
            console.log('Backend response:', newModel);
            const newOption = document.createElement('option');
            newOption.value = Number(newModel.model_id);
            newOption.textContent = modelName; // Use the name provided by the user
            
            modelSelect.appendChild(newOption);
            modelSelect.value = Number(newModel.model_id);
            cenclmanualAddModelForm();
            manualAddModelForm.classList.add('hidden');
            responseMessage.textContent = `Model "${modelName}" added successfully!`;
            
        });
        async function getModelsByBrand() {
             cartridgeSelect.innerHTML = '<option value="">Select Cartridge</option>';  // Reset to default option
             modelSelect.innerHTML = '<option value="">Select model</option>';  // Reset to default option
             chipSelect.innerHTML = '<option value="">CHIPS</option>';  // Reset to default option
            cenclmanualAddModelForm();
            const selectedBrandId = brandSelect.value;
            if (selectedBrandId) {
                
                if (selectedBrandId === '-1') {
                    // Call the function to add a new brand
                    addNewBrand();
                    return;
                }else{
                    printTypeSection.classList.remove('hidden');
                    colorTypeSection.classList.remove('hidden');
                }
                if(selectedBrandId && printTypeSelect.value && colorTypeSelect.value){
                    const data = {
                        brand_id: Number(selectedBrandId),
                        print_type: printTypeSelect.value,
                        color_type: colorTypeSelect.value
                    };
                    const command_GM = 'get_models';
                    const url_GM = `http://${host}:${port}/${command_GM}`;
                    const models = await fetchTranfer(url_GM,data);
                    
                    printTypeSelect.value = ""; // Reset print type selection
                    colorTypeSelect.value = ""; // Reset color type selection
                    printTypeSection.classList.add('hidden');
                    colorTypeSection.classList.add('hidden');
                    populateModelSelect(models);
                }
            }
        }
    // Handle brand selection change
    brandSelect.addEventListener('change', getModelsByBrand);
    printTypeSelect.addEventListener('change', getModelsByBrand);
    colorTypeSelect.addEventListener('change', getModelsByBrand);
        

    // Handle model selection change
    modelSelect.addEventListener('change', async () => {
        const selectedModelId = modelSelect.value;
        cartridgeSelect.innerHTML = '<option value="">Select Cartridge</option>';  // Reset to default option
        cartridgeSelect.appendChild(addNewCartridgeOption);

        if(selectedModelId === '-1' && brandSelect.value){
            addNewModel();
            return;
        }
        cenclmanualAddModelForm();
        if (selectedModelId) {
            const command_GC = 'get_cartridges';
            const url_GC = `http://${host}:${port}/${command_GC}`;
            const cartridges = await fetchTranfer(url_GC,{model_id:Number(selectedModelId)});

            populateCartridgeSelect(cartridges);
        }
    });

    cartridgeSelect.addEventListener('change', async () => {
        const selectedCartridge = cartridgeSelect.value;
        chipSelect.innerHTML = '<option value="">CHIPS</option>';  // Reset to default option
        if (selectedCartridge == '-1' && modelSelect.value){
            addNewCartridgeSection.style.display = 'block'; // Show the section
            return;
        }else{
            addNewCartridgeSection.style.display = 'none'; // Hide the section
        }
    
        try {
            const command_GCHIPS = 'get_chips';
            const urlGCHIPS = `http://${host}:${port}/${command_GCHIPS}`;
    
            const Chips = await fetchTranfer(urlGCHIPS,{ cartridge_id: Number(selectedCartridge) }); 
            populateChipSelect(Chips);
    
            
        } catch (error) {
            console.error('Error get_chips:', error);
            alert('Failed to get chips.');
        }
        
    
    });

    chipSelect.addEventListener('change', async () => {
        const selectedChip = chipSelect.value;
        const selectedCartridge = cartridgeSelect.value;
        if(selectedChip === '-1' && selectedCartridge){
            addNewChipSection.style.display = 'block'; // Show the section
        }else{
            addNewChipSection.style.display = 'none'; // Hide the section
        }
    
    });

    modelImageDisplay.addEventListener('click', () => {
        if(!modelSelect.value || modelSelect.value === '-1'){
            return;
        }
        const brandSelectedOption = brandSelect.options[brandSelect.selectedIndex];
        const brandName = brandSelectedOption.textContent;
        const modelSelectedOption = modelSelect.options[modelSelect.selectedIndex];
        const modelName = modelSelectedOption.textContent;

        const selectedModel = `https://www.google.com/search?sca_esv=7c68678e090b94a1&sxsrf=ADLYWIIoy-oH2xHnwrnckwpNFiZYrGZ0Og:1735169602682&q=${brandName}+${modelName}+&udm=2&fbs=AEQNm0Cp43LlY6jdFK77hMn4QH1qa7YpD6Lh6zb2-iXK9x6H7FakiKgVokpm5H9TjJGfTy72qXGI11atH0CYTtZWkfdUMbto-mhT1geNGj1nJiR7BKdqVNlTGVvYQLOY7mya-OhdhNcZrz_hzc0fF5K4SPe-j0_pdwI_yg5oRcanqqHaPqSqTlLFgVQYDH6sv5Xkkdt2mSsBzxfPu2UwBAeIRBHCo4Yjb-YR4JXerlp_JvAjTgDVmmk&sa=X&ved=2ahUKEwie06u-isSKAxU_T6QEHf8aIkIQtKgLegQIEhAB&biw=1654&bih=798&dpr=1`;
        console.log("opppenoing")
        // Do something with selectedCartridge, like opening the URL in a new tab
        window.open(selectedModel, "_blank");
    });
    cartridgeImageDisplay.addEventListener('click', () => {
        if(!cartridgeSelect.value || cartridgeSelect.value === '-1'){
            return;
        }
        const brandSelectedOption = brandSelect.options[brandSelect.selectedIndex];
        const brandName = brandSelectedOption.textContent;
        const cartridgeSelectedOption = cartridgeSelect.options[cartridgeSelect.selectedIndex];
        const cartridgeName = cartridgeSelectedOption.textContent;
       
        const selectedModel = `https://www.google.com/search?sca_esv=7c68678e090b94a1&sxsrf=ADLYWIIoy-oH2xHnwrnckwpNFiZYrGZ0Og:1735169602682&q=cartridge+${brandName}+${cartridgeName}+&udm=2&fbs=AEQNm0Cp43LlY6jdFK77hMn4QH1qa7YpD6Lh6zb2-iXK9x6H7FakiKgVokpm5H9TjJGfTy72qXGI11atH0CYTtZWkfdUMbto-mhT1geNGj1nJiR7BKdqVNlTGVvYQLOY7mya-OhdhNcZrz_hzc0fF5K4SPe-j0_pdwI_yg5oRcanqqHaPqSqTlLFgVQYDH6sv5Xkkdt2mSsBzxfPu2UwBAeIRBHCo4Yjb-YR4JXerlp_JvAjTgDVmmk&sa=X&ved=2ahUKEwie06u-isSKAxU_T6QEHf8aIkIQtKgLegQIEhAB&biw=1654&bih=798&dpr=1`;
        console.log("opppenoing")
        // Do something with selectedCartridge, like opening the URL in a new tab
        window.open(selectedModel, "_blank");
    });
    
    // Add selected cartridge to the list
    addCartridgeButton.addEventListener('click', () => {
        const selectedCartridge = cartridgeSelect.value;
        const cartridgeOption = cartridgeSelect.selectedOptions[0];
    
        if (!selectedCartridge || selectedCartridge === "-1") {
            return;
        }
            const listItem = document.createElement('li');
            listItem.dataset.cartridge_id = Number(selectedCartridge);
    
            // Add cartridge name
            const cartridgeName = document.createElement('span');
            cartridgeName.textContent = cartridgeOption.textContent;
            
            // Create description input field
            const descriptionInput = document.createElement('input');
            descriptionInput.type = 'text';
            descriptionInput.placeholder = 'Add description (optional)';
            descriptionInput.classList.add('description-input');
    
            // Add description to list item (optional)
            const descriptionSpan = document.createElement('span');
            descriptionSpan.textContent = '  No description'; // Default text
            descriptionSpan.classList.add('description-span');
            
            // Create Edit and Save buttons for the description
            const editDescriptionButton = document.createElement('button');
            editDescriptionButton.textContent = 'Edit Description';
            editDescriptionButton.classList.add('edit-description-button');
            const saveDescriptionButton = document.createElement('button');
            saveDescriptionButton.textContent = 'Save Description';
            saveDescriptionButton.classList.add('save-description-button');
            saveDescriptionButton.style.display = 'none'; // Hide Save button initially
            
    
            // Event listener for the Edit button
            editDescriptionButton.addEventListener('click', (event) => {
                event.preventDefault(); 
                descriptionInput.style.display = 'inline';
                saveDescriptionButton.style.display = 'inline';
                descriptionSpan.style.display = 'none';
                editDescriptionButton.style.display = 'none';
            });
    
            // Event listener for the Save button
            saveDescriptionButton.addEventListener('click', (event) => {
                event.preventDefault(); 
                const descriptionText = "  " + descriptionInput.value.trim();
                if (descriptionText) {
                    descriptionSpan.textContent = descriptionText;
                } else {
                    descriptionSpan.textContent = '  No description';
                }
                descriptionInput.style.display = 'none';
                saveDescriptionButton.style.display = 'none';
                descriptionSpan.style.display = 'none';
                editDescriptionButton.style.display = 'inline';
            });
    
            // Create and add the delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => {
                const cartridgeId = listItem.dataset.cartridge_id;
                console.log(`Deleting cartridge with ID: ${cartridgeId}`);
                listItem.remove();
            });
    
            // Append elements to the list item
            listItem.appendChild(cartridgeName);
            listItem.appendChild(descriptionSpan); // Show the description span
            listItem.appendChild(descriptionInput); // Input field for description (hidden initially)
            listItem.appendChild(editDescriptionButton); // Edit button
            listItem.appendChild(saveDescriptionButton); // Save button
            listItem.appendChild(deleteButton); // Delete button
    
            // Append the list item to the cartridge list
            selectedCartridgesList.appendChild(listItem);
    
        
    });

    // Add a new cartridge
    addNewCartridgeButton.addEventListener('click', async () => {
        const newCartridgeName = newCartridgeNameInput.value.trim();
    
        if (!brandSelect.value) {
            alert("Please select a brand before adding a cartridge.");
            return;
        }
    
        if (!modelSelect.value) {
            alert("Please select a model before adding a cartridge.");
            return;
        }
    
        if (!newCartridgeName) {
            alert("Cartridge name cannot be empty.");
            return;
        }
    
        try {
            const commandAC = 'add_cartridge';
            const urlAC = `http://${host}:${port}/${commandAC}`;
            const requestBody = ({
                name: newCartridgeName,
                model_id: Number(modelSelect.value)
            });
            const newCartridge = await fetchTranfer(urlAC,requestBody)
            
            // Create and append the new option to the select element
            console.log(newCartridge.cartridge_id)
            const newOption = document.createElement('option');
            newOption.value = Number(newCartridge.cartridge_id);
            newOption.textContent = newCartridgeName;
            cartridgeSelect.appendChild(newOption);
            cartridgeSelect.value = Number(newCartridge.cartridge_id);
            newCartridgeNameInput.value = ''; // Clear input field
            addNewCartridgeSection.style.display = 'none'; // Hide the section
            chipSelect.innerHTML = '<option value="">CHIPS</option>';
            if (addNewChipOption) {
            chipSelect.appendChild(addNewChipOption);
            }
    
            alert(`Cartridge "${newCartridgeName}" added successfully!`);
        } catch (error) {
            console.error('Error adding new cartridge:', error);
            alert('Failed to add the new cartridge.');
        }
    });


    addNewChipButton.addEventListener('click', async () => {
        const selectedCartridge = cartridgeSelect.value;
        const newChipName = addChipModelInput.value.trim();
        if (!brandSelect.value) {
            alert("Please select a brand before adding a Chip.");
            return;
        }
    
        if (!modelSelect.value) {
            alert("Please select a model before adding a Chip.");
            return;
        }
        if (!selectedCartridge) {
            alert("Please select a cartridge before adding a Chip.");
            return;
        }
        
    
        if (!newChipName) {
            alert("Chip name cannot be empty.");
            return;
        }
    
        try {
            const command_ACHIP = 'add_chip';
            const url_ACHIP = `http://${host}:${port}/${command_ACHIP}`;
            const newChip = await fetchTranfer(url_ACHIP,{cartridge_id: Number(selectedCartridge), name: newChipName});
            const newOption = document.createElement('option');
            newOption.value = Number(newChip.id);
            newOption.textContent = newChipName; // Use the name provided by the user
            chipSelect.appendChild(newOption);
            chipSelect.value = Number(newChip.id);
            addChipModelInput.value = "";
            addNewChipSection.style.display = 'none'; // Hide the section
            alert(`Chip "${newChipName}" added successfully!`);
        } catch (error) {
            console.error('Error adding new chip:', error);
            alert('Failed to add the new chip.');
        }
    });


    // Function to send cartridges data
async function sendClientPrinterCartridgesData(clientPrinterId) {
    console.log(clientPrinterId);
    const cartridges = Array.from(selectedCartridgesList.children).map(item => {
        const cartridgeId = item.dataset.cartridge_id;
        const description = item.querySelector('input') ? item.querySelector('input').value : '';
        return { cartridge_id: Number(cartridgeId),description: description, client_printer_id: Number(clientPrinterId) };  // Replace 'client-id' with actual client ID
    });
       
    try {
            const commandCPC = 'add_client_printer_cartridges';
            const urlCPC = `http://${host}:${port}/${commandCPC}`;
            fetchTranfer(urlCPC,cartridges);
            responseMessage.textContent = 'add_client_printer_cartridges successfully added';

    } catch (error) {
        console.error('Error sending cartridges:', error);
        responseMessage.textContent = 'Error sending cartridges.';
    }
}

    // Function to send printer details
async function sendPrinterData() {
    const brand = brandSelect.value;
    const selectedOption = modelSelect.options[modelSelect.selectedIndex];
    const selectedModelName = selectedOption ? selectedOption.textContent : null;
    const selectedModelId = selectedOption ? selectedOption.value : null;
console.log(selectedModelName);  // This will log MF753Cdw
console.log(selectedModelId);    // This will log the model id (if you need it)
console.log(brand);    // This will log the model id (if you need it)

    const requestBody = { 
        brand_id: Number(brand), 
        model_id: Number(selectedModelId),
        model_name: selectedModelName, 
    }
    try {
            const commandSP = 'add_printer';
            const urlSP = `http://${host}:${port}/${commandSP}`;
        const newPrinter = await fetchTranfer(urlSP, requestBody);
        console.log(newPrinter);
        const printer_id = newPrinter.printer_id;
        responseMessage.textContent = 'Printer successfully added';
        sendClientPrinter(printer_id);
          //  sendCartridgesData();
    } catch (error) {
        console.error('Error associating printer:', error);
        responseMessage.textContent = 'Error associating printer.';
    }
}

async function sendClientPrinter(_printerId) {
    const printerDescription = printerDescriptionInput.value;
    const requestBody = { 
        printer_id: Number(_printerId), 
        client_id: Number(clientId),
        description: printerDescription,
    };
    console.log(printerDescription)
    try {
            const commandCP = 'add_client_printer';
            const urlCP = `http://${host}:${port}/${commandCP}`;
        const newClinetPrinter = await fetchTranfer(urlCP, requestBody)
        const client_printer_id = newClinetPrinter.client_printer_id;
        console.log(client_printer_id);
        responseMessage.textContent = 'Printer successfully added';
        sendClientPrinterCartridgesData(client_printer_id);
    } catch (error) {
        console.error('Error associating printer:', error);
        responseMessage.textContent = 'Error associating printer.';
    }
}

     associatePrinterForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        await sendPrinterData();
        alert(`printer added to client ${clientName} successfully`)
        location.reload();
    });
});
