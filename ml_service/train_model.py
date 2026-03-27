import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

df = pd.read_csv('fire_risk_dataset.csv')

X = df[['voltage', 'current', 'temperature', 'humidity', 'smoke']]
y = df['fire_risk']

le = LabelEncoder()
y_encoded = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

joblib.dump(model, 'model.pkl')
joblib.dump(le, 'label_encoder.pkl')

print("Model trained and saved successfully!")