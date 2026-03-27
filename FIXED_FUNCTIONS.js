// REPLACE THESE TWO FUNCTIONS IN advance.html (around line 1963-1972)

async function startDevice() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    const option = document.querySelector("input[name='startOption']:checked").value;
    const serialNumbers = document.getElementById('startSerial').value;
    
    try {
        console.log('Sending START command to backend...');
        const response = await fetch('/api/commands/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                option: option,
                serial_numbers: serialNumbers
            })
        });

        const result = await response.json();
        console.log('Backend response:', result);
        
        if (result.success) {
            const msg = option === 'all' 
                ? 'Started all devices.' 
                : `Started device(s): ${serialNumbers}`;
            alert(msg);
            debugLog(msg + ' - Logged to database');
        } else {
            alert('Error: ' + result.message);
            debugLog('Start device error: ' + result.message);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
        debugLog('Start device error: ' + error.message);
    }
}

async function rapidShutdown() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    const option = document.querySelector("input[name='shutdownOption']:checked").value;
    const serialNumbers = document.getElementById('shutdownSerial').value;
    
    try {
        console.log('Sending STOP command to backend...');
        const response = await fetch('/api/commands/stop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                option: option,
                serial_numbers: serialNumbers
            })
        });

        const result = await response.json();
        console.log('Backend response:', result);
        
        if (result.success) {
            const msg = option === 'all' 
                ? 'Rapid shutdown for all devices.' 
                : `Rapid shutdown for device(s): ${serialNumbers}`;
            alert(msg);
            debugLog(msg + ' - Logged to database');
        } else {
            alert('Error: ' + result.message);
            debugLog('Rapid shutdown error: ' + result.message);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
        debugLog('Rapid shutdown error: ' + error.message);
    }
}
