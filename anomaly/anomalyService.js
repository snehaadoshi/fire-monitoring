// NEW FEATURE: Anomaly Detection Service
const axios = require('axios');

const ANOMALY_SERVICE_URL = 'http://127.0.0.1:5002/detect';
const ANOMALY_THRESHOLD = 0.5;

async function detectAnomaly(sensorData) {
  try {
    const response = await axios.post(
      ANOMALY_SERVICE_URL,
      {
        voltage: sensorData.voltage,
        current: sensorData.current,
        temperature: sensorData.temperature,
        humidity: sensorData.humidity,
        smoke: sensorData.smoke
      },
      { timeout: 2000 }
    );

    return {
      is_anomaly: response.data.is_anomaly,
      anomaly_score: response.data.anomaly_score
    };
  } catch (error) {
    console.warn('Anomaly detection service unavailable');
    return { is_anomaly: false, anomaly_score: 0 };
  }
}

module.exports = { detectAnomaly, ANOMALY_THRESHOLD };
