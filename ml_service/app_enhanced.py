# NEW FEATURE: ML Service with Confidence Score
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load('model.pkl')
label_encoder = joblib.load('label_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    features = np.array([[
        data['voltage'],
        data['current'],
        data['temperature'],
        data['humidity'],
        data['smoke']
    ]])
    
    # Get prediction
    prediction = model.predict(features)[0]
    fire_risk = label_encoder.inverse_transform([prediction])[0]
    
    # NEW FEATURE: Get prediction probabilities
    probabilities = model.predict_proba(features)[0]
    confidence = float(max(probabilities))
    
    return jsonify({
        'fire_risk': fire_risk,
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
