import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://webvrhhbluuvbjrdlsup.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnZyaGhibHV1dmJqcmRsc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMTYzOTMsImV4cCI6MjAzMDU5MjM5M30.CzpwBXjbzBzyQPDZdHcPZWog8vih0Rw_AIECiaX7LlE');

document.addEventListener('DOMContentLoaded', function() {
    const peopleForm = document.getElementById('search-form');  // Assumes this ID for the people search form
    const vehicleForm = document.getElementById('vehicle-search-form');  // Assumes this ID for the vehicle search form
    const addVehicleForm = document.getElementById('add-vehicle-form');  // Assumes this ID for the add vehicle form

    // Event listener for people search
    peopleForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        performSearch('Person', 'Name', document.getElementById('name').value, 'LicenseNumber', document.getElementById('license').value);
    });

    // Event listener for vehicle search
    vehicleForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        performSearch('Vehicles', 'VehicleID', document.getElementById('rego').value);
    });

    // Event listener for adding a vehicle
    addVehicleForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        addVehicle();
    });

    async function performSearch(table, key1, value1, key2 = '', value2 = '') {
        const message = document.getElementById('message');
        const output = document.getElementById('output');
        let query = supabase.from(table).select('*');
        if (value1) query = query.ilike(key1, `%${value1}%`);
        if (value2) query = query.ilike(key2, `%${value2}%`);

        const { data, error } = await query;

        output.innerHTML = '';
        if (error) {
            console.error('Error fetching data: ', error);
            message.textContent = 'Error';
            return;
        }

        if (data.length === 0) {
            message.textContent = 'No result found';
            output.innerHTML = '<p>No results found.</p>';
        } else {
            message.textContent = 'Search successful';
            const outputList = data.map(item => {
                if (table === 'Person') {
                    return `<div class="result-box">
                                <p><strong>Name:</strong> ${item.Name}</p>
                                <p><strong>License Number:</strong> ${item.LicenseNumber}</p>
                                <p><strong>Address:</strong> ${item.Address}</p>
                                <p><strong>DOB:</strong> ${item.DOB}</p>
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
            output.innerHTML = `<div class="output-area">${outputList}</div>`;
        }
    }

    async function addVehicle() {
        const rego = document.getElementById('rego').value.trim();
        const make = document.getElementById('make').value.trim();
        const model = document.getElementById('model').value.trim();
        const colour = document.getElementById('colour').value.trim();
        const owner = document.getElementById('owner').value.trim();
        const message = document.getElementById('message');

        const { data, error } = await supabase.from('Vehicles').insert([
            {
                VehicleID: rego,
                Make: make,
                Model: model,
                Colour: colour,
                OwnerID: owner  // Assumes owner ID directly provided; adjust if needed to handle new owner creation
            }
        ]);

        if (error) {
            console.error('Error adding vehicle: ', error);
            message.textContent = 'Error adding vehicle.';
        } else {
            message.textContent = 'Vehicle added successfully!';
            console.log('Added vehicle:', data);
        }
    }
});
