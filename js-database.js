// After install the supabase-js module
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Create a single supabase client for interacting with your database
const supabase = createClient('https://webvrhhbluuvbjrdlsup.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnZyaGhibHV1dmJqcmRsc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMTYzOTMsImV4cCI6MjAzMDU5MjM5M30.CzpwBXjbzBzyQPDZdHcPZWog8vih0Rw_AIECiaX7LlE');

document.addEventListener('DOMContentLoaded', function() {


    document.getElementById('search-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();

        const message = document.getElementById('message');
        const results = await searchPeople(name, license, supabase);

        const output = document.getElementById('output');
        output.innerHTML = '';

        if (results.length === 0) {
            message.textContent = 'No result found';
            output.innerHTML = '<p>No results found.</p>';
        } else {
            message.textContent = 'Search successful';
            const outputList = results.map(person => {
                return `<div style="border: 1px solid black; padding: 5px; margin-bottom: 5px;">
                            <p><strong>Person ID:</strong> ${person.PersonID}</p>
                            <p><strong>Name:</strong> ${person.Name}</p>
                            <p><strong>Address:</strong> ${person.Address}</p>
                            <p><strong>DOB:</strong> ${person.DOB}</p>
                            <p><strong>License Number:</strong> ${person.LicenseNumber}</p>
                            <p><strong>Expiry Date:</strong> ${person.ExpiryDate}</p>
                        </div>`;
            }).join('');
            output.innerHTML = `<div style='display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start;'>${outputList}</div>`;
        }
    });

    async function searchPeople(name, licenseNumber, supabase) {
        let query = supabase.from('Person').select('*');

        if (name) {
            query = query.ilike('Name', `%${name}%`);
        }

        if (licenseNumber) {
            query = query.ilike('LicenseNumber', `%${licenseNumber}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching data: ', error);
            return [];
        }

        return data;
    }
});
