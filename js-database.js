    const ownerName = document.getElementById('owner-name').value.trim();
    const ownerId = await getOwnerId(ownerName);
    if (!ownerId) {
        updateMessage('Owner does not exist. Please add the owner first.');
        return;
    }

    const rego = document.getElementById('rego').value.trim();
    const make = document.getElementById('make').value.trim();
    const model = document.getElementById('model').value.trim();
    const colour = document.getElementById('colour').value.trim();

    const { error } = await supabase.from('Vehicles').insert([{ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: ownerId }]);
    if (error) {
        updateMessage('Error adding vehicle: ' + error.message);
        return;
    }

    updateMessage('Vehicle added successfully');
