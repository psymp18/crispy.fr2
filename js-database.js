// After install the supabase-js module
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Create a single supabase client for interacting with your database
const supabase = createClient('https://webvrhhbluuvbjrdlsup.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnZyaGhibHV1dmJqcmRsc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMTYzOTMsImV4cCI6MjAzMDU5MjM5M30.CzpwBXjbzBzyQPDZdHcPZWog8vih0Rw_AIECiaX7LlE');

document.addEventListener('DOMContentLoaded', function() {
    const peopleForm = document.getElementById('search-form');  // Assuming this ID is correct for the people search
    const vehicleForm = document.getElementById('vehicle-search-form');  // Ensure this ID is set in your HTML for the vehicle search

    peopleForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();
        performSearch('Person', name, license);
    });

    vehicleForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const vehicleID = document.getElementById('rego').value.trim();  // Assuming 'rego' is the ID for vehicle ID input
        performSearch('Vehicles', '', vehicleID);
    });

    async function performSearch(table, name = '', vehicleID = '') {
        const message = document.getElementById('message');
        const output = document.getElementById('output');
        let query = supabase.from(table).select('*');

        if (table === 'Person') {
            if (name) query = query.ilike('Name', `%${name}%`);
            if (vehicleID) query = query.ilike('LicenseNumber', `%${vehicleID}%`);
        } else if (table === 'Vehicles') {
            query = query.ilike('VehicleID', `%${vehicleID}%`);  // Searching by Vehicle ID
        }

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
                                <p><strong>Person ID:</strong> ${item.PersonID}</p>
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
            output.innerHTML = `<div class="output-area">${outputList}</div>`;
        }
    }
});
