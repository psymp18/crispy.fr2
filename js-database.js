import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://webvrhhbluuvbjrdlsup.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnZyaGhibHV1dmJqcmRsc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMTYzOTMsImV4cCI6MjAzMDU5MjM5M30.CzpwBXjbzBzyQPDZdHcPZWog8vih0Rw_AIECiaX7LlE');

document.addEventListener('DOMContentLoaded', function() {
    const peopleForm = document.getElementById('search-form');
    const vehicleForm = document.getElementById('vehicle-search-form');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const addOwnerForm = document.getElementById('add-new-owner-form');

    peopleForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        performSearch('Person', {
            Name: document.getElementById('name').value.trim(),
            LicenseNumber: document.getElementById('license').value.trim()
        });
    });

    vehicleForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        performSearch('Vehicles', {
            VehicleID: document.getElementById('rego').value.trim()
        });
    });

    addVehicleForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        checkOwner();
    });

    addOwnerForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        addOwner();
    });

    async function performSearch(table, criteria) {
        let query = supabase.from(table).select('*');
        Object.keys(criteria).forEach(key => {
            if (criteria[key]) query = query.ilike(key, `%${criteria[key]}%`);
        });

        const { data, error } = await query;
        updateMessage(table, data, error);
    }

    async function checkOwner()
        {
            const owner = document.getElementById('owner').value.trim();
            const { data: ownerData, error: ownerError } = await supabase.from('Person').select('PersonID').eq('PersonID', owner);

            if (ownerError || ownerData.length === 0) {
                document.getElementById('add-new-owner-form').style.display = 'block';
                updateMessage('Error', null, { message: 'Owner does not exist. Please add the owner first.' });
                return;
        }

        addVehicle();
        }

    async function addVehicle() {
        const rego = document.getElementById('rego').value.trim();
        const make = document.getElementById('make').value.trim();
        const model = document.getElementById('model').value.trim();
        const colour = document.getElementById('colour').value.trim();
        const owner = document.getElementById('owner').value.trim();

        const { data, error } = await supabase.from('Vehicles').insert([
            { VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: owner }
        ]);

        if (error) {
            console.error('Error adding vehicle: ', error);
            updateMessage('Error', null, { message: 'Error adding vehicle: ' + error.message });
        } else {
            updateMessage('Vehicles', data, { message: 'Vehicle added successfully!' });
        }
    }

    async function addOwner() {
        const personid = document.getElementById('personid').value.trim();
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const dob = document.getElementById('dob').value.trim();
        const license = document.getElementById('license').value.trim();
        const expire = document.getElementById('expire').value.trim();

        const { data, error } = await supabase.from('Person').insert([
            { PersonID: personid, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire }
        ]);

        if(error)
        {
             console.error('Error adding owner: ', error);
            updateMessage('Error', null, {message: 'Error adding owner: ' + error.message});
        }
        else
        {
            document.getElementById('add-new-owner-form').style.display = 'none';
            const messageElement = document.getElementById('message');
            messageElement.textContext = "Thank you for submitting the owner's details. Please click 'Add' to add your vehicle's details.";
        }
        
        /*updateMessage('Person', data, error);*/
    }

    function updateMessage(table, data, error) {
        const messageElement = document.getElementById('message');
        const outputElement = document.getElementById('output');
        messageElement.textContent = '';
        outputElement.innerHTML = '';

        if (error) {
            console.error('Error: ', error);
            messageElement.textContent = 'Error';
            outputElement.innerHTML = `<p>Error occurred: ${error.message}</p>`;
        } else if (data.length === 0) {
            messageElement.textContent = 'No result found';
            outputElement.innerHTML = '<p>No results found.</p>';
        } else {
            messageElement.textContent = 'Search successful';
            let outputList = data.map(item => {
                if (table === 'Person') {
                    return `<div class="result-box">
                        <p><strong>ID:</strong> ${item.PersonID}</p>
                        <p><strong>Name:</strong> ${item.Name}</p>
                        <p><strong>Address:</strong> ${item.Address}</p>
                        <p><strong>DOB:</strong> ${item.DOB}</p>
                        <p><strong>License Number:</strong> ${item.LicenseNumber}</p>
                        <p><strong>Expiry Date:</strong> ${item.ExpiryDate}</p>
                    </div>`;
                } else {
                    return `<div class="result-box">
                        <p><strong>Vehicle ID:</strong> ${item.VehicleID}</p>
                        <p><strong>Make:</strong> ${item.Make}</p>
                        <p><strong>Model:</strong> ${item.Model}</p>
                        <p><strong>Colour:</strong> ${item.Colour}</p>
                        <p><strong>Owner ID:</strong> ${item.OwnerID}</p>
                    </div>`;
                }
            }).join('');
            outputElement.innerHTML = `<div class="output-area">${outputList}</div>`;
        }
    }
});
