import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://webvrhhbluuvbjrdlsup.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnZyaGhibHV1dmJqcmRsc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMTYzOTMsImV4cCI6MjAzMDU5MjM5M30.CzpwBXjbzBzyQPDZdHcPZWog8vih0Rw_AIECiaX7LlE');

document.addEventListener('DOMContentLoaded', function() {
    const peopleForm = document.getElementById('search-form');  // Assumes this ID for the people search form
    const vehicleForm = document.getElementById('vehicle-search-form');  // Assumes this ID for the vehicle search form
    const addVehicleForm = document.getElementById('add-vehicle-form');  // Assumes this ID for the add vehicle form
    const addOwnerForm = document.getElementById('add-new-owner-form');

    peopleForm?.addEventListener('submit', handlePeopleSearch);
    vehicleForm?.addEventListener('submit', handleVehicleSearch);
    addVehicleForm?.addEventListener('submit', handleAddVehicle);
    addOwnerForm?.addEventListener('submit', handleAddOwner);

    async function handlePeopleSearch(event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();
        await performSearch('Person', { Name: name, LicenseNumber: license });
    }

    async function handleVehicleSearch(event) {
        event.preventDefault();
        const rego = document.getElementById('rego').value.trim();
        await performSearch('Vehicles', { VehicleID: rego });
    }

    async function handleAddVehicle(event) {
        event.preventDefault();
        const rego = document.getElementById('rego').value.trim();
        const make = document.getElementById('make').value.trim();
        const model = document.getElementById('model').value.trim();
        const colour = document.getElementById('colour').value.trim();
        const owner = document.getElementById('owner').value.trim();

        const ownerExists = await supabase.from('Person').select('PersonID').eq('PersonID', owner);
        if(ownerExists.error || ownerExists.data.length === 0)
        {
            message.textContext = 'Owner does not exist. Please add the owner first.';
            document.getElementById('add-new-owner-form').style.display = 'block';
            return;
        }
        // Add vehicle logic
        const { data, error } = await supabase.from('Vehicles').insert([
            { VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: owner }
        ]);
        
        if(error)
        {
            console.error('Error adding vehicle: ', error);
            message.textContext('Error adding vehicle.');
        }
        else
        {
            message.textContext = 'Vehicle added successfully!';
        }
    }

    async function handleAddOwner(event) {
        event.preventDefault();
        const personid = document.getElementById('personid').value.trim();
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const dob = document.getElementById('dob').value.trim();
        const license = document.getElementById('license').value.trim();
        const expire = document.getElementById('expire').value.trim();

        // Add owner logic
        const { data, error } = await supabase.from('Person').insert([
            { PersonID: personid, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire }
        ]);

        updateMessage(data, error);
    }

    async function performSearch(table, criteria) {
        let query = supabase.from(table).select('*');
        Object.keys(criteria).forEach(key => {
            if (criteria[key]) query = query.ilike(key, `%${criteria[key]}%`);
        });

        const { data, error } = await query;
        updateMessage(data, error);
    }

    function updateMessage(data, error) {
        const messageElement = document.getElementById('message');
        const outputElement = document.getElementById('output');
        if (error) {
            console.error('Error: ', error);
            messageElement.textContent = 'Error';
            outputElement.innerHTML = '<p>No results found.</p>';
        } else if (data.length === 0) {
            messageElement.textContent = 'No result found';
            outputElement.innerHTML = '<p>No results found.</p>';
        } else {
            messageElement.textContent = 'Search successful';
            const outputList = data.map(item => `<div class="result-box">
                <p><strong>ID:</strong> ${item.PersonID || item.VehicleID}</p>
                <p><strong>Name:</strong> ${item.Name || item.Make}</p>
                <p><strong>Details:</strong> ${item.Address || item.Model}</p>
            </div>`).join('');
            outputElement.innerHTML = `<div class="output-area">${outputList}</div>`;
        }
    }
});
