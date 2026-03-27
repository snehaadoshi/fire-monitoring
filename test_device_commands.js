// Test Device Commands API
// Run this with: node test_device_commands.js

const BASE_URL = 'https://fire-monitoring.onrender.com';

async function testDeviceCommands() {
    console.log('🧪 Testing Device Commands API\n');

    // Test 1: Send START command
    console.log('Test 1: Sending START command...');
    try {
        const res1 = await fetch(`${BASE_URL}/api/commands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module_no: 1, command: 'START' })
        });
        const data1 = await res1.json();
        console.log('✅ START Response:', data1);
    } catch (err) {
        console.error('❌ START Error:', err.message);
    }

    console.log('\n---\n');

    // Test 2: Send STOP command
    console.log('Test 2: Sending STOP command...');
    try {
        const res2 = await fetch(`${BASE_URL}/api/commands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module_no: 1, command: 'STOP' })
        });
        const data2 = await res2.json();
        console.log('✅ STOP Response:', data2);
    } catch (err) {
        console.error('❌ STOP Error:', err.message);
    }

    console.log('\n---\n');

    // Test 3: Get latest command
    console.log('Test 3: Getting latest command...');
    try {
        const res3 = await fetch(`${BASE_URL}/api/commands/device-command/latest?module_no=1`);
        const data3 = await res3.json();
        console.log('✅ Latest Command Response:', data3);
    } catch (err) {
        console.error('❌ Latest Command Error:', err.message);
    }

    console.log('\n✅ All tests completed!');
}

testDeviceCommands();
