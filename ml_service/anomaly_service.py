# NEW FEATURE: Anomaly Detection Service (Isolation Forest)
from flask import Flask, request, jsonify
from sklearn.ensemble import IsolationForest
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load or train anomaly model
if os.path.exists('anomaly_model.pkl'):
    anomaly_model = joblib.load('anomaly_model.pkl')
else:
    # Initialize with default parameters
    anomaly_model = IsolationForest(contamination=0.1, random_state=42)
    print("Anomaly model initialized (needs training)")

@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    
    features = np.array([[
        data['voltage'],
        data['current'],
        data['temperature'],
        data['humidity'],
        data['smoke']
    ]])
    
    try:
        # Predict: -1 for anomaly, 1 for normal
        prediction = anomaly_model.predict(features)[0]
        
        # Get anomaly score (lower = more anomalous)
        score = anomaly_model.score_samples(features)[0]
        
        # Normalize score to 0-1 range (higher = more anomalous)
        anomaly_score = float(1 / (1 + np.exp(score)))
        
        return jsonify({
            'is_anomaly': bool(prediction == -1),
            'anomaly_score': anomaly_score
        })
    except:
        return jsonify({
            'is_anomaly': False,
            'anomaly_score': 0.0
        })

@app.route('/train', methods=['POST'])
def train():
    """Train anomaly model with historical data"""
    data = request.json
    X = np.array(data['features'])
    
    global anomaly_model
    anomaly_model.fit(X)
    joblib.dump(anomaly_model, 'anomaly_model.pkl')
    
    return jsonify({'success': True, 'message': 'Model trained'})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
