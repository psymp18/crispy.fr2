import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://webvrhhbluuvbjrdlsup.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnZyaGhibHV1dmJqcmRsc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwMTYzOTMsImV4cCI6MjAzMDU5MjM5M30.CzpwBXjbzBzyQPDZdHcPZWog8vih0Rw_AIECiaX7LlE');

document.addEventListener('DOMContentLoaded', function() 
{
    const peopleForm = document.getElementById('search-form');
    const vehicleForm = document.getElementById('vehicle-search-form');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const addOwnerForm = document.getElementById('add-new-owner-form');

    peopleForm?.addEventListener('submit', peopleSearch);
    vehicleForm?.addEventListener('submit', vehicleSearch);
    addVehicleForm?.addEventListener('submit', addVehicle);
    addOwnerForm?.addEventListener('submit', addOwner);

    async function peopleSearch(e)
    {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const license = document.getElementById('license').value.trim();
        if(!name && !license)
        {
            updateMessage('Error');
            return;
        }

        performSearch('Person', {Name: name, LicenseNumber: license});
    }

    async function vehicleSearch(e)
    {
        e.preventDefault();
        const rego = document.getElementById('rego').value.trim();

        if(!rego)
        {
            updateMessage('Error');
            return;
        }

        performSearch('Vehicles', {VehicleID: rego});  
    }

    async function addVehicle(e)
    {
        e.preventDefault();
        const ownerName = document.getElementById('owner-name').value.trim();
        const ownerId = await getOwnerId(ownerName);
        // if (!ownerId) {
        //     updateMessage('Owner does not exist. Please add the owner first.');
        //     return;
        // }
    
        const rego = document.getElementById('rego').value.trim();
        const make = document.getElementById('make').value.trim();
        const model = document.getElementById('model').value.trim();
        const colour = document.getElementById('colour').value.trim();
    
        // const { error } = await supabase.from('Vehicles').insert([{ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: ownerId }]);
        // if (error) {
        //     updateMessage('Error adding vehicle: ' + error.message);
        // }
        // else
        // {
        //     updateMessage('Vehicle added successfully');

        // }
        if (!ownerId) {
            // Display the form to add new owner
            document.getElementById('add-new-owner-form').style.display = 'block';
            updateMessage('Owner does not exist. Please add the owner.');
            // Store vehicle details in sessionStorage or another temporary store
            sessionStorage.setItem('vehicleDetails', JSON.stringify({rego, make, model, colour}));
            return;
        }
    
        insertVehicle(ownerId, rego, make, model, colour);
    }

    async function addOwner(e)
    {
        e.preventDefault();

        const personId = document.getElementById('personid').value.trim();
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const dob = document.getElementById('dob').value.trim();
        const license = document.getElementById('license').value.trim();
        const expire = document.getElementById('expire').value.trim();

        if (!name) {
            updateMessage('Name is required to add a new owner.');
            return;
        }

        // const {error} = await supabase.from('Person').insert([{PersonID: personId, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire}], {upsert: true});
        // if (error) {
        //     updateMessage('Error adding owner: ' + error.message);
        // } else {
        //     updateMessage('Owner added successfully');
        //     document.getElementById('add-new-owner-form').style.display = 'none';
        // }
        const { error, data } = await supabase.from('Person').insert([{PersonID: personId, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire}], {upsert: true});
        if (error)
        {
            updateMessage('Error adding owner: ' + error.message);
        } 
        else 
        {
            updateMessage('Owner added successfully');
            document.getElementById('add-new-owner-form').style.display = 'none';
            // Now add the vehicle after owner is successfully added
            const vehicleDetails = JSON.parse(sessionStorage.getItem('vehicleDetails'));
            if (vehicleDetails) {
                await insertVehicle(data[0].PersonID, vehicleDetails.rego, vehicleDetails.make, vehicleDetails.model, vehicleDetails.colour);
                sessionStorage.removeItem('vehicleDetails'); // Clean up
            }
        }
    }

    async function getOwnerId(name)
    {
        const {data, error} = await supabase.from('Person').select('PersonID').ilike('Name', `%${name}%`).single();
        if(error && !data)
        {
            // document.getElementById('add-new-owner-form').style.display = 'block';
            return null;
        } 
        return data.PersonID;
    }

    async function insertVehicle(ownerId, rego, make, model, colour)
    {
        const {error} = await supabase.from('Vehicles').insert([{ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: ownerId }]);
        if(error)
        {
            updateMessage('Error adding vehicle: ' + error.message);
        }
        else
        {
            updateMessage('Vehicle added successfully');
        }
    }

    async function performSearch(table, criteria) 
    {
        let query = supabase.from(table).select('*');

        Object.keys(criteria).forEach(key => {
            if (criteria[key]) query = query.ilike(key, `%${criteria[key]}%`);
        });
        
        const {data, error} = await query;
        if(error) 
        {
            updateMessage('Error' + error.message);
        }
        else if(data.length === 0) 
        {
            updateMessage('No result found');
        } 
        else 
        {
            updateMessage('Search successful', true, table, data);
        }
    }

    // async function checkOwner(owner)
    // {
    //     const {data, error} = await supabase.from('Person').select('PersonID').eq('PersonID', owner);

    //     if(error) 
    //     {
    //         updateMessage('Error: ' + error.message);
    //         return;
    //     }
    //     else if(data.length === 0)
    //     {
    //         document.getElementById('add-new-owner-form').style.display = 'block';
    //         updateMessage('Owner does not exist. Please add the owner first.');
    //     }
    //     else
    //     {
    //         addNewVehicle();    
    //     }
    // }

    // async function addNewVehicle() 
    // {
    //     const ownerName = document.getElementById('owner-name').value.trim();
    //     const rego = document.getElementById('rego').value.trim();
    //     const make = document.getElementById('make').value.trim();
    //     const model = document.getElementById('model').value.trim();
    //     const colour = document.getElementById('colour').value.trim();
    //     const owner = document.getElementById('owner').value.trim();


    //     if(ownerName)
    //     {
    //         updateMessage('Error: please provide a name');
    //         return;
    //     }

    //     let ownerId = await getOrCreateOwner(ownerName);
    //     if(ownerId)
    //     {
    //         await addNewVehicle(ownerId, rego, make, model, colour);
    //     }
    // }

    // async function addNewOwner() 
    // {
    //     const personid = document.getElementById('personid').value.trim();
    //     const name = document.getElementById('name').value.trim();
    //     const address = document.getElementById('address').value.trim();
    //     const dob = document.getElementById('dob').value.trim();
    //     const license = document.getElementById('license').value.trim();
    //     const expire = document.getElementById('expire').value.trim();

    //     const {data, error} = await supabase.from('Person').insert([{PersonID: personid, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire}]);

    //     if(error)
    //     {
    //         updateMessage('Error adding owner: ' + error.message);
    //     }
    //     else
    //     {
    //         updateMessage("Thank you for submitting the owner's details. Please click 'Add' to add your vehicle's details.");
    //         addNewVehicle();
    //     }        
    // }

    function updateMessage(message, isSearch = false, table = '', data = []) 
    {
        const msg = document.getElementById('message');
        const results = document.getElementById('results');
        msg.textContent = message;
        results.innerHTML = '';


        if(isSearch && data.length) 
        {
        const outputList = data.map(item => {
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
            results.innerHTML = outputList;
        }
        else 
        {
            results.innerHTML = '';
        }
    }
});
