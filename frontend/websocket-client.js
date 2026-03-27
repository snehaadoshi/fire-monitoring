// NEW FEATURE: WebSocket Client Integration
// Add this script to advance.html before closing </body> tag

// WebSocket connection (with fallback to polling)
let socket = null;
let socketConnected = false;

function initializeWebSocket() {
  try {
    // Load Socket.IO client
    socket = io('https://fire-monitoring.onrender.com', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✓ WebSocket connected');
      socketConnected = true;
      debugLog('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('✗ WebSocket disconnected');
      socketConnected = false;
      debugLog('WebSocket disconnected - using polling fallback');
    });

    // NEW FEATURE: Listen for sensor updates
    socket.on('sensor_update', (data) => {
      debugLog('WebSocket sensor update received');
      
      // Update sensor data
      const moduleNo = String(data.module_no);
      if (sensorDataBySRNO[moduleNo]) {
        sensorDataBySRNO[moduleNo] = {
          SRNO: moduleNo,
          'Voltage (V)': data.voltage,
          'Current (A)': data.current,
          'Temperature (°C)': data.temperature,
          'Humidity (%)': data.humidity,
          'Smoke (ppm)': data.smoke_level,
          // NEW FEATURE: ML confidence
          'ML Confidence': data.ml_confidence,
          // NEW FEATURE: Anomaly detection
          'Anomaly Score': data.anomaly_score,
          'Is Anomaly': data.is_anomaly
        };
        
        // Re-render grid if on dashboard
        if (document.getElementById('gridWrapper').style.display !== 'none') {
          renderGrid();
        }
      }
    });

    // NEW FEATURE: Listen for alert creation
    socket.on('alert_created', (alert) => {
      debugLog(`Alert created: Module ${alert.module_no} - ${alert.alert_type}`);
      
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('Fire Monitoring Alert', {
          body: `Module ${alert.module_no}: ${alert.message}`,
          icon: '🚨'
        });
      }
      
      // Update system health
      updateSystemHealth();
    });

  } catch (error) {
    console.log('WebSocket initialization failed, using polling only');
    socketConnected = false;
  }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Initialize WebSocket after login (add to doLogin function)
// Call: initializeWebSocket();
