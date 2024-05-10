import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://webvrhhbluuvbjrdlsup.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnZyaGhibHV1dmJqcmRsc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMTYzOTMsImV4cCI6MjAzMDU5MjM5M30.CzpwBXjbzBzyQPDZdHcPZWog8vih0Rw_AIECiaX7LlE');

document.addEventListener('DOMContentLoaded', function() {
    const peopleForm = document.getElementById('search-form');
    const vehicleForm = document.getElementById('vehicle-search-form');

    peopleForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();
        await performPeopleSearch(name, license);
    });

    vehicleForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const vehicleReg = document.getElementById('rego').value.trim();
        await performVehicleSearch(vehicleReg);
    });

    async function performPeopleSearch(name, license) {
        const message = document.getElementById('message');
        const output = document.getElementById('output');
        let query = supabase.from('Person').select('*');

        if (name) query = query.ilike('Name', `%${name}%`);
        if (license) query = query.ilike('LicenseNumber', `%${license}%`);

        const { data, error } = await query;

        updateOutput(data, error, message, output, 'Person');
    }

    async function performVehicleSearch(vehicleReg) {
        const message = document.getElementById('message');
        const output = document.getElementById('output');

        let query = supabase
            .from('Vehicles')
            .select(`
                VehicleID,
                Make,
                Model,
                Colour,
                Person (Name, LicenseNumber)
            `)
            .ilike('VehicleID', `%${vehicleReg}%`);

        const { data, error } = await query;

        updateOutput(data, error, message, output, 'Vehicle');
    }

    function updateOutput(data, error, message, output, type) {
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
            const outputList = data.map(item => formatOutput(item, type)).join('');
            output.innerHTML = `<div class="output-area">${outputList}</div>`;
        }
    }

    function formatOutput(item, type) {
        if (type === 'Person') {
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
                        <p><strong>Owner Name:</strong> ${item.Person?.Name || 'Unknown'}</p>
                        <p><strong>Owner License Number:</strong> ${item.Person?.LicenseNumber || 'Unknown'}</p>
                    </div>`;
        }
    }
});
