document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const modelId = params.get("model_id");
    const clientPrinterId = params.get('client_printer_id');
    const printerName = params.get('printer_name');
    const backPagePath = params.get('path');
    console.log(backPagePath)
    document.getElementById('pageTitle').textContent = printerName;
     
    const cartridgeSelect = document.getElementById('cartridge');
    const addCartridgeButton = document.getElementById('addCartridgeButton');
    const selectedCartridgesList = document.getElementById('cartridgeList');
    const addNewCartridgeButton = document.getElementById('addNewCartridgeButton');
    const newCartridgeNameInput = document.getElementById('newCartridgeName');
    const addNewCartridgeSection = document.getElementById('addNewCartridgeSection');
    const backPagebutton = document.getElementById('back_page');
    
    
    const chipSelect = document.getElementById('chip');
    const addChipModelInput = document.getElementById('addChip_model');
    const addNewChipButton = document.getElementById('addNewChipButton');
    const addNewChipSection = document.getElementById('addNewChipSection');
    const addNewChipOption = document.querySelector('#addNewChipOption');

    const associatePrinterForm = document.getElementById('cartridgeManagementForm');

    const responseMessage = document.getElementById('responseMessage');
    const host = localStorage.getItem('host');
    const port = localStorage.getItem('port');
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
    
    if(modelId){
    const command_GC = 'get_cartridges';
            const url_GC = `http://${host}:${port}/${command_GC}`;
            fetchTranfer(url_GC,{model_id:Number(modelId)})
            .then(cartridges => {
                populateCartridgeSelect(cartridges);
            })
            .catch(error => {
                console.error('Error fetching brands:', error);
                responseMessage.textContent = 'Error fetching brand data.';
            });
    }

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

    cartridgeSelect.addEventListener('change', async () => {
        const selectedCartridge = cartridgeSelect.value;
        if (selectedCartridge == '-1'){
            addNewCartridgeSection.style.display = 'block'; // Show the section
            return;
        }
            addNewCartridgeSection.style.display = 'none'; // Hide the section
    
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
        console.log("hello")
        try {
            const commandAC = 'add_cartridge';
            const urlAC = `http://${host}:${port}/${commandAC}`;
            const requestBody = {
                name: newCartridgeName,
                model_id: Number(modelId)
            };
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


associatePrinterForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    sendClientPrinterCartridgesData(clientPrinterId);
});

backPagebutton.addEventListener('click', async (event) => {
    console.log("back");
    window.location.href = `${backPagePath}`;
});

    
    });




