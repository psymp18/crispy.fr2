import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/dist/supabase.min.mjs';

const supabaseUrl = 'https://webvrhhbluuvbjrdlsup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnZyaGhibHV1dmJqcmRsc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMTYzOTMsImV4cCI6MjAzMDU5MjM5M30.CzpwBXjbzBzyQPDZdHcPZWog8vih0Rw_AIECiaX7LlE';  // Update this key with your actual key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function() {


    document.getElementById('search-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();

        const results = await searchPeople(name, license, supabase);

        const output = document.getElementById('output');
        output.innerHTML = '';

        if (results.length === 0) {
            output.innerHTML = '<p>No results found.</p>';
        } else {
            const outputList = results.map(person => `<div>${person.Name} - ${person.LicenseNumber}</div>`).join('');
            output.innerHTML = `<div>${outputList}</div>`;
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
